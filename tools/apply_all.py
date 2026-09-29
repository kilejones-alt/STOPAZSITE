#!/usr/bin/env python3
from pathlib import Path
import subprocess
import sys

ROOT = Path.cwd()
TOOLS = ROOT / 'tools'
steps = [
    'patch_sitewide_navigation.py',
    'localize_squarespace_assets.py',
    'remove_approved_obsolete_files.py',
    'qa_core.py',
    'qa_full_repo.py',
]
for step in steps:
    print(f'\n== {step} ==')
    result = subprocess.run([sys.executable, str(TOOLS / step)], cwd=ROOT)
    if result.returncode:
        raise SystemExit(result.returncode)
print('\nSTOPAZ rebuild applied and QA passed.')
