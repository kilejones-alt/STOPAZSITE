#!/usr/bin/env python3
from pathlib import Path
import hashlib, html as htmllib, mimetypes, os, re, sys, urllib.parse, urllib.request
ROOT=Path.cwd(); DEST=ROOT/'assets'/'vendor'/'squarespace'; DEST.mkdir(parents=True,exist_ok=True)
EXTS={'.html','.css','.js'}; HOST='images.squarespace-cdn.com'; URL_RE=re.compile(r'https://images\.squarespace-cdn\.com/[^\s\"\'<>)]*',re.I)
def files():
  for p in ROOT.rglob('*'):
    if p.is_file() and p.suffix.lower() in EXTS and not any(x in {'.git','node_modules','assets'} for x in p.parts): yield p
def ext(ctype,url):
  c=(ctype or '').split(';',1)[0].strip().lower(); m={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/gif':'.gif','image/svg+xml':'.svg','image/avif':'.avif'}
  if c in m:return m[c]
  e=mimetypes.guess_extension(c) if c else None
  return e or Path(urllib.parse.unquote(urllib.parse.urlsplit(url).path)).suffix or '.img'
def get(url):
  req=urllib.request.Request(htmllib.unescape(url),headers={'User-Agent':'STOPAZ-static-localizer/1.0','Accept':'image/*,*/*;q=.2'})
  with urllib.request.urlopen(req,timeout=45) as r:
    data=r.read();ctype=r.headers.get('Content-Type','')
  if not data or (ctype and not ctype.lower().startswith('image/')): raise RuntimeError(f'bad image response: {url}')
  return data,ctype
texts={p:p.read_text(encoding='utf-8') for p in files()}; urls=sorted({m.group(0) for s in texts.values() for m in URL_RE.finditer(s)})
map={};fail=[]
for i,u in enumerate(urls,1):
  try:
    data,ctype=get(u); name=hashlib.sha256(data).hexdigest()[:20]+ext(ctype,u); out=DEST/name
    if not out.exists():out.write_bytes(data)
    map[u]=out;print(f'[{i}/{len(urls)}] {out.relative_to(ROOT)}')
  except Exception as e:fail.append((u,str(e)))
if fail:
  print('aborted; no source rewrites because downloads failed',file=sys.stderr)
  [print('-',u,e,file=sys.stderr) for u,e in fail];raise SystemExit(2)
for p,s in texts.items():
  ns=s
  for u,out in map.items():
    if u in ns:ns=ns.replace(u,os.path.relpath(out,p.parent).replace(os.sep,'/'))
  ns=re.sub(r'<link\b(?=[^>]*\brel=[\"\']preconnect[\"\'])(?=[^>]*\bhref=[\"\']https://images\.squarespace-cdn\.com[\"\'])[^>]*>\s*','',ns,flags=re.I)
  if ns!=s:p.write_text(ns,encoding='utf-8')
remaining=[str(p.relative_to(ROOT)) for p in files() if HOST in p.read_text(encoding='utf-8')]
if remaining:print('remaining:',*remaining,sep='\n- ',file=sys.stderr);raise SystemExit(3)
print('localized',len(map),'unique URLs')
