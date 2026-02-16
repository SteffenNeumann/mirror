// Mirror Service Worker — Offline-First Cache + Offline Notes Sync Queue
const CACHE_NAME = "mirror-v2";
const PRECACHE_URLS = [
	"/",
	"/index.html",
	"/app.js",
	"/styles/app.css",
	"/vendor/yjs.bundle.js",
	"/vendor/yjs-init.js",
	"/excalidraw-embed.html",
	"/manifest.json",
];

// CDN assets to cache on first use (stale-while-revalidate)
const CDN_CACHE_URLS = [
	"https://cdn.tailwindcss.com",
	"https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js",
	"https://cdn.jsdelivr.net/npm/markdown-it-task-lists@2.1.1/dist/markdown-it-task-lists.min.js",
	"https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
	"https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css",
];

// --- Install: pre-cache critical assets ---
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(PRECACHE_URLS))
			.then(() => self.skipWaiting())
	);
});

// --- Activate: clean old caches ---
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((k) => k !== CACHE_NAME)
						.map((k) => caches.delete(k))
				)
			)
			.then(() => self.clients.claim())
	);
});

// --- Fetch: Network-first for API, Cache-first for static assets ---
self.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);

	// Skip non-GET requests
	if (event.request.method !== "GET") return;

	// API requests: network-only (handled by app.js offline logic)
	if (url.pathname.startsWith("/api/")) return;

	// WebSocket upgrade: skip
	if (event.request.headers.get("Upgrade") === "websocket") return;

	// Upload files: network-only
	if (url.pathname.startsWith("/uploads/")) return;

	// CDN assets: cache-first (stale-while-revalidate)
	const isCdn = url.origin !== self.location.origin;

	event.respondWith(
		caches.open(CACHE_NAME).then((cache) =>
			cache.match(event.request).then((cachedResponse) => {
				const fetchPromise = fetch(event.request)
					.then((networkResponse) => {
						// Cache same-origin + CDN successful responses
						if (networkResponse.ok) {
							const shouldCache =
								url.origin === self.location.origin ||
								CDN_CACHE_URLS.some((u) => event.request.url.startsWith(u));
							if (shouldCache) {
								cache.put(event.request, networkResponse.clone());
							}
						}
						return networkResponse;
					})
					.catch(() => {
						// Network failed — return cached or offline fallback
						if (cachedResponse) return cachedResponse;
						// For navigation requests, return cached index
						if (event.request.mode === "navigate") {
							return cache.match("/index.html");
						}
						return new Response("Offline", {
							status: 503,
							statusText: "Service Unavailable",
						});
					});

				// Return cached version immediately, update in background
				return cachedResponse || fetchPromise;
			})
		)
	);
});

// --- Message: cache version bump ---
self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});
