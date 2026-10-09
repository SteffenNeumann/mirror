"""Erzeugt App-Icons und iOS-Startbilder fuer die installierte Mirror-App.

Aufruf (im Repo-Root):  python3 scripts/gen-pwa-assets.py . /tmp/links.txt
Schreibt icon-192.png, icon-512.png, apple-touch-icon.png und splash/*.png;
die <link rel="apple-touch-startup-image">-Zeilen landen in der Links-Datei
und werden in index.html eingefuegt. Braucht Pillow.
"""
import sys
from PIL import Image, ImageDraw

out, links_path = sys.argv[1], sys.argv[2]
TILE = (15, 23, 42)
FG = (241, 245, 249)
BG = (2, 6, 23)


def logo(size):
    S = 4
    n = size * S
    im = Image.new("RGB", (n, n), TILE)
    d = ImageDraw.Draw(im)
    k = n / 512
    p = lambda x, y: (x * k, y * k)
    d.rectangle([p(112, 128), p(164, 384)], fill=FG)
    d.rectangle([p(348, 128), p(400, 384)], fill=FG)
    d.polygon([p(164, 128), p(348, 128), p(256, 356)], fill=FG)
    return im.resize((size, size), Image.LANCZOS)


for s, name in [(180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
    logo(s).save(f"{out}/{name}", optimize=True)

devs = [
    (440, 956, 3), (430, 932, 3), (420, 912, 3), (402, 874, 3), (393, 852, 3),
    (428, 926, 3), (390, 844, 3), (414, 896, 3), (375, 812, 3), (360, 780, 3),
    (414, 896, 2), (375, 667, 2),
    (1032, 1376, 2), (1024, 1366, 2), (834, 1210, 2), (834, 1194, 2),
    (820, 1180, 2), (810, 1080, 2), (744, 1133, 2),
]
links = []
for w, h, r in devs:
    for orient in ("portrait", "landscape"):
        W, H = (w * r, h * r) if orient == "portrait" else (h * r, w * r)
        im = Image.new("RGB", (W, H), BG)
        ls = int(min(W, H) * 0.28)
        m = Image.new("L", (ls * 4, ls * 4), 0)
        ImageDraw.Draw(m).rounded_rectangle([0, 0, ls * 4 - 1, ls * 4 - 1], radius=int(ls * 4 * 0.225), fill=255)
        m = m.resize((ls, ls), Image.LANCZOS)
        im.paste(Image.composite(logo(ls), Image.new("RGB", (ls, ls), BG), m), ((W - ls) // 2, (H - ls) // 2))
        fn = f"splash-{W}x{H}.png"
        im.save(f"{out}/splash/{fn}", optimize=True)
        links.append(
            f'\t\t<link rel="apple-touch-startup-image" media="(device-width: {w}px) and (device-height: {h}px)'
            f' and (-webkit-device-pixel-ratio: {r}) and (orientation: {orient})" href="/splash/{fn}" />'
        )
open(links_path, "w").write("\n".join(links) + "\n")
