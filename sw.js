// Mirror Service Worker — Offline-First Cache + Offline Notes Sync Queue
const CACHE_NAME = "mirror-v1";
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

	// Static assets: stale-while-revalidate
	event.respondWith(
		caches.open(CACHE_NAME).then((cache) =>
			cache.match(event.request).then((cachedResponse) => {
				const fetchPromise = fetch(event.request)
					.then((networkResponse) => {
						// Only cache same-origin successful responses
						if (
							networkResponse.ok &&
							url.origin === self.location.origin
						) {
							cache.put(event.request, networkResponse.clone());
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
