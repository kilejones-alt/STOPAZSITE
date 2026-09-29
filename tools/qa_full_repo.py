#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import re

ROOT = Path.cwd()
errors = []
warnings = []

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = 0
        self.main = 0
        self.ids = []
        self.runtime = []
        self.iframes = 0
        self.videos = 0
        self.header_new = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'h1':
            self.h1 += 1
        if tag == 'main':
            self.main += 1
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'header' and 'sitewide-nav-v2' in (a.get('class') or '').split():
            self.header_new = True
        if tag == 'iframe':
            self.iframes += 1
        if tag == 'video':
            self.videos += 1
        if tag in {'img', 'script', 'source', 'video'}:
            src = a.get('src', '')
            if src.startswith(('http://', 'https://', '//')):
                self.runtime.append((tag, src))
            srcset = a.get('srcset', '')
            if srcset:
                for part in srcset.split(','):
                    candidate = part.strip().split()[0] if part.strip() else ''
                    if candidate.startswith(('http://', 'https://', '//')):
                        self.runtime.append((tag + ':srcset', candidate))
        if tag == 'link':
            href = a.get('href', '')
            rel = a.get('rel') or ''
            if isinstance(rel, list):
                rel = ' '.join(rel)
            if href.startswith(('http://', 'https://', '//')) and any(x in rel for x in ['stylesheet', 'preconnect', 'preload', 'dns-prefetch']):
                self.runtime.append((tag, href))

def local_targets(page, source):
    refs = [m.group(1) for m in re.finditer(r'(?:href|src)=["\']([^"\']+)["\']', source, re.I)]
    for m in re.finditer(r'srcset=["\']([^"\']+)["\']', source, re.I):
        refs.extend(part.strip().split()[0] for part in m.group(1).split(',') if part.strip())
    for ref in refs:
        if not ref or ref.startswith(('#', 'http://', 'https://', 'mailto:', 'tel:', 'data:', 'javascript:')):
            continue
        target = ref.split('#', 1)[0].split('?', 1)[0]
        if target and not (page.parent / target).exists():
            errors.append(f'{page.name}: missing local target {target}')

htmls = sorted(ROOT.glob('*.html'))
for page in htmls:
    source = page.read_text(encoding='utf-8')
    parser = Parser()
    parser.feed(source)
    if parser.h1 != 1:
        errors.append(f'{page.name}: H1 count {parser.h1}')
    if parser.main != 1:
        errors.append(f'{page.name}: main count {parser.main}')
    if len(parser.ids) != len(set(parser.ids)):
        errors.append(f'{page.name}: duplicate IDs')
    if parser.runtime:
        errors.append(f'{page.name}: external runtime asset {parser.runtime[:3]}')
    if parser.iframes:
        errors.append(f'{page.name}: iframe remains')
    if parser.videos:
        errors.append(f'{page.name}: video remains')
    if not parser.header_new:
        errors.append(f'{page.name}: spreadsheet navigation patch missing')
    if 'images.squarespace-cdn.com' in source:
        errors.append(f'{page.name}: Squarespace reference remains')
    local_targets(page, source)

for obsolete in ['vercel.json', 'download', 'stalin-hero-loop.mp4', 'stalin-hero-reverse.mp4', 'stalin-hero-loop-mobile.mp4', 'stalin-hero-reverse-mobile.mp4']:
    if (ROOT / obsolete).exists():
        errors.append(f'obsolete file remains: {obsolete}')

for js in ROOT.glob('*.js'):
    source = js.read_text(encoding='utf-8')
    if 'images.squarespace-cdn.com' in source:
        errors.append(f'{js.name}: Squarespace runtime reference remains')

for css in ROOT.glob('*.css'):
    source = css.read_text(encoding='utf-8')
    if 'images.squarespace-cdn.com' in source:
        errors.append(f'{css.name}: Squarespace runtime reference remains')

print('STOPAZ FULL-REPO QA')
print('pages', len(htmls))
print('errors', len(errors))
print('warnings', len(warnings))
for item in errors:
    print('-', item)
raise SystemExit(1 if errors else 0)
