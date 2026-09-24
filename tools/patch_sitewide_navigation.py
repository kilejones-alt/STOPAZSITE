#!/usr/bin/env python3
from pathlib import Path
import re
ROOT=Path.cwd(); SKIP={'index.html','home.html','learn.html','lead.html','act.html','bring-az.html','about.html','get-involved.html'}
HEADER='<header class="top sitewide-nav-v2"><a class="brand" id="site-brand" href="index.html">STOP<span>AZ</span></a><button aria-controls="primary-menu" aria-expanded="false" class="nav2-toggle" type="button">Menu</button><nav class="sitewide-menu-v2" id="primary-menu"><a href="learn.html">LEARN</a><a href="lead.html">LEAD</a><a href="act.html">ACT</a><a href="bring-az.html">BRING AZ</a><a href="about.html">ABOUT US</a><a href="get-involved.html">GET INVOLVED</a></nav></header><div aria-hidden="true" class="mega-v2" id="mega"><div class="mega-v2-inner"><p class="mega-v2-title" id="mega-title"></p><nav aria-labelledby="mega-title" class="mega-v2-links" id="mega-links"></nav></div></div>'
for p in ROOT.glob('*.html'):
  if p.name in SKIP: continue
  s=p.read_text(encoding='utf-8')
  ns,n=re.subn(r'<header\b[^>]*class="[^"]*\btop\b[^"]*"[^>]*>.*?</header>',HEADER,s,count=1,flags=re.S|re.I)
  if not n: continue
  if 'rebuild-nav.css' not in ns:
    ns=ns.replace('</head>','<link href="rebuild-nav.css?v=20260920-final" rel="stylesheet"/></head>',1)
  if 'site-nav.js' not in ns:
    ns=ns.replace('</body>','<script defer src="site-nav.js?v=20260920-final"></script></body>',1)
  p.write_text(ns,encoding='utf-8'); print('patched',p.name)
