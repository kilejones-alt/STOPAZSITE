#!/usr/bin/env python3
from pathlib import Path
ROOT=Path.cwd()
for name in ["vercel.json","download","stalin-hero-loop.mp4","stalin-hero-reverse.mp4","stalin-hero-loop-mobile.mp4","stalin-hero-reverse-mobile.mp4"]:
    p=ROOT/name
    if p.exists():
        p.unlink(); print("removed",name)
(ROOT/".nojekyll").touch()
