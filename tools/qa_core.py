#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import re,sys
ROOT=Path.cwd(); core=['index.html','home.html','learn.html','lead.html','act.html','bring-az.html','about.html','get-involved.html']; errors=[]; warnings=[]
class P(HTMLParser):
 def __init__(self): super().__init__();self.h1=0;self.main=0;self.ids=[];self.img=[];self.runtime=[];self.aria=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if tag=='main':self.main+=1
  if 'id' in a:self.ids.append(a['id'])
  if tag=='img':self.img.append(a)
  if tag in {'img','script','source','video'} and a.get('src','').startswith(('http://','https://','//')):self.runtime.append((tag,a['src']))
  if tag=='link' and any(x in (a.get('rel') or '') for x in ['stylesheet','preload','preconnect']) and a.get('href','').startswith(('http://','https://','//')):self.runtime.append((tag,a['href']))
  if 'aria-label' in a:self.aria.append(a['aria-label'])
for name in core:
 p=ROOT/name
 if not p.exists():errors.append(name+': missing');continue
 s=p.read_text(encoding='utf-8');x=P();x.feed(s)
 if x.h1!=1:errors.append(f'{name}: H1 count {x.h1}')
 if x.main!=1:errors.append(f'{name}: main count {x.main}')
 if len(x.ids)!=len(set(x.ids)):errors.append(f'{name}: duplicate id')
 if x.runtime:errors.append(f'{name}: external runtime asset {x.runtime[:3]}')
 if x.aria:errors.append(f'{name}: aria-label text remains {x.aria}')
 if 'STOPAZ</p><h1>' in s or '<p class="eyebrow">STOPAZ</p>' in s:errors.append(f'{name}: unapproved STOPAZ eyebrow')
 if 'images.squarespace-cdn.com' in s:errors.append(f'{name}: Squarespace reference')
 if '<video' in s:errors.append(f'{name}: video remains')
for f in ['rebuild.css','rebuild-nav.css','rebuild.js','site-nav.js']:
 if not (ROOT/f).exists():errors.append(f+': missing')
for f in ['rebuild.css','rebuild-nav.css']:
 s=(ROOT/f).read_text(encoding='utf-8')
 for bad in ['#000','#111','#17191d','#161a20','#090a0b','#7f1d2d','#b72835']:
  if bad in s.lower():errors.append(f'{f}: old/non-approved color {bad}')
 if 'http://' in s or 'https://' in s:errors.append(f'{f}: external URL')
for f in ['rebuild.js','site-nav.js']:
 s=(ROOT/f).read_text(encoding='utf-8')
 for bad in ['eval(','new Function(','innerHTML','fetch(','localStorage']:
  if bad in s:errors.append(f'{f}: prohibited {bad}')
print('STOPAZ CORE QA');print('errors',len(errors));print('warnings',len(warnings));[print('-',e) for e in errors];raise SystemExit(1 if errors else 0)
