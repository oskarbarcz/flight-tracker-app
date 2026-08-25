#!/usr/bin/env python3
"""Regenerate app/assets/operator/transparent from the source fin photographs.

The background is knocked out by flooding inward from the image edges, but only
through pixels that are both near-white AND flat (low local contrast). The
flatness test is what stops the fill leaking through a fin outline into the
fin's own white areas - without it, white-bodied fins like KLM, El Al and
Air France lose their bodies. The outer anti-aliased ring is then absorbed so no
white halo survives on a dark background, and the result is trimmed and quantized.

The sources were app/assets/operator/thumb/*.jpg, removed once the transparent set
replaced them. Recover them from git history before re-running:

    git checkout <commit-before-removal> -- app/assets/operator/thumb

Usage:  pip install pillow
        python3 bin/make_transparent_fins.py app/assets/operator/transparent <source>/*.jpg
"""
import sys, os
from collections import deque
from PIL import Image, ImageFilter, ImageChops

TOL       = 22    # how far from white still counts as background
EDGE_TOL  = 10    # local contrast above this is a fin outline: the fill stops there
FEATHER   = 0.8
MAX_SIDE  = 160
COLORS    = 128

def process(src, dst):
    im = Image.open(src).convert("RGB")
    w, h = im.size
    px = im.load()

    # morphological gradient: ~0 on flat background, high on the fin's outline.
    # this is what stops the fill leaking into a fin's own white areas.
    g = im.convert("L").filter(ImageFilter.GaussianBlur(0.5))
    grad = ImageChops.difference(g.filter(ImageFilter.MaxFilter(3)), g.filter(ImageFilter.MinFilter(3)))
    gp = grad.load()

    passable = bytearray(w * h)
    for y in range(h):
        for x in range(w):
            r, gg, b = px[x, y]
            if r >= 255 - TOL and gg >= 255 - TOL and b >= 255 - TOL and gp[x, y] <= EDGE_TOL:
                passable[y * w + x] = 1

    bg = bytearray(w * h)
    dq = deque()
    def push(x, y):
        i = y * w + x
        if not bg[i] and passable[i]:
            bg[i] = 1
            dq.append((x, y))
    for x in range(w):
        push(x, 0); push(x, h - 1)
    for y in range(h):
        push(0, y); push(w - 1, y)
    while dq:
        x, y = dq.popleft()
        for nx, ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
            if 0 <= nx < w and 0 <= ny < h:
                push(nx, ny)

    # absorb the outer half of the anti-aliased outline so no white ring is left
    for _ in range(2):
        grow = []
        for y in range(h):
            base = y * w
            for x in range(w):
                if bg[base + x]:
                    continue
                r, gg, b = px[x, y]
                if r < 244 or gg < 244 or b < 244:
                    continue
                if ((x > 0 and bg[base + x - 1]) or (x < w-1 and bg[base + x + 1])
                        or (y > 0 and bg[base - w + x]) or (y < h-1 and bg[base + w + x])):
                    grow.append(base + x)
        if not grow:
            break
        for i in grow:
            bg[i] = 1

    alpha = Image.frombytes("L", (w, h), bytes(0 if b else 255 for b in bg))
    alpha = alpha.filter(ImageFilter.GaussianBlur(FEATHER))

    out = im.copy()
    out.putalpha(alpha)
    box = out.getbbox()
    if box:
        out = out.crop(box)
    ow, oh = out.size
    if max(ow, oh) > MAX_SIDE:
        s = MAX_SIDE / max(ow, oh)
        out = out.resize((max(1, round(ow*s)), max(1, round(oh*s))), Image.LANCZOS)
    out = out.quantize(colors=COLORS, method=Image.FASTOCTREE)
    out.save(dst, "PNG", optimize=True)

if __name__ == "__main__":
    dstdir = sys.argv[1]
    os.makedirs(dstdir, exist_ok=True)
    for s in sorted(sys.argv[2:]):
        process(s, os.path.join(dstdir, os.path.basename(s).replace(".jpg", ".png")))
    print(f"{len(sys.argv)-2} regenerated")
