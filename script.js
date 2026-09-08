(() => {
  'use strict';
  const d=document, de=d.documentElement, body=d.body;
  const progress=d.getElementById('progress'), header=d.querySelector('.top'), toggle=d.querySelector('.nav-toggle'), menu=d.querySelector('.menu');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const saveData=!!(navigator.connection && navigator.connection.saveData);
  const declared=body.dataset.page||'', pathLast=location.pathname.split('/').filter(Boolean).pop()||'', raw=declared||(location.pathname.endsWith('/')?'index.html':(pathLast||'index.html')), file=raw.replace(/\.html$/i,'')||'index';
  const aliases={index:'home',home:'home',declaration:'global-declaration','sign-global-declaration':'global-declaration'}, page=aliases[file]||file;
  body.classList.add('page-'+page,'motion-ready');
  requestAnimationFrame(()=>requestAnimationFrame(()=>body.classList.add('is-page-ready')));

  const activeMedia=new Set();
  let lastY=scrollY, pending=false;
  const hero=d.querySelector('.page-hero');
  const paint=()=>{
    pending=false; const y=scrollY, max=de.scrollHeight-innerHeight;
    if(progress) progress.style.width=(max>0?Math.min(100,y/max*100):0)+'%';
    if(header){
      header.classList.toggle('is-scrolled',y>60);
      header.classList.toggle('header-hidden',y>280 && y>lastY+10 && !body.classList.contains('menu-open'));
      if(y<lastY-10||y<120) header.classList.remove('header-hidden');
    }
    if(hero&&!reduce){
      const r=hero.getBoundingClientRect(), active=r.bottom>0&&r.top<innerHeight;
      hero.classList.toggle('is-motion-active',active); body.classList.toggle('is-motion-active',active&&page==='home');
      if(active) de.style.setProperty('--hero-shift',Math.max(-22,Math.min(44,y*.055))+'px');
    }
    if(!reduce&&activeMedia.size){
      const vh=innerHeight;
      activeMedia.forEach(host=>{
        if(!host.isConnected){activeMedia.delete(host);return}
        const r=host.getBoundingClientRect();
        if(r.bottom<-120||r.top>vh+120)return;
        const center=r.top+r.height/2, delta=(center-vh/2)/Math.max(vh,1);
        host.style.setProperty('--media-scroll',(Math.max(-1,Math.min(1,delta))*-16).toFixed(2)+'px');
      });
    }
    lastY=y;
  };
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(paint)}},{passive:true});
  addEventListener('resize',()=>{if(!pending){pending=true;requestAnimationFrame(paint)}},{passive:true}); paint();

  if(toggle&&menu){
    const close=()=>{menu.classList.remove('open');body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu'};
    toggle.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close':'Menu';header&&header.classList.remove('header-hidden')});
    menu.addEventListener('click',e=>{if(e.target.closest('a'))close()}); d.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }
  d.querySelectorAll('.menu a').forEach(a=>{try{const n=new URL(a.href,location.href).pathname.split('/').filter(Boolean).pop()?.replace(/\.html$/i,'')||'index';if((aliases[n]||n)===page)a.setAttribute('aria-current','page')}catch{}});

  // Hero entrance is clip-based rather than a generic fade.
  if(hero){hero.classList.add('motion-hero'); [...hero.querySelectorAll(':scope>div>*')].forEach((el,i)=>{el.classList.add('hero-motion-item');el.style.setProperty('--hero-delay',(110+i*115)+'ms')});}

  // Whole-site section choreography: heading wipe + alternating section direction + staggered inner units.
  const sections=[...d.querySelectorAll('main>section')];
  const unitSelector='.section-head,.large-copy,.source-visual,.card-grid,.program-stack,.leadership-list,.marketplace-grid,.actions,.product-copy,.product-hero-media,.join-visuals,ul,.module-kicker,.detail-grid,.contact-form-layout form,.team-org,.era-gallery';
  sections.forEach((sec,i)=>{
    sec.dataset.sectionIndex=String(i+1).padStart(2,'0');
    sec.classList.add('motion-section',i%2?'motion-from-right':'motion-from-left');
    const heads=sec.querySelectorAll('.section-head h2,.module-kicker,.endorsement-subhead');
    heads.forEach(h=>h.classList.add('motion-heading'));
    const groups=[...sec.children].filter(el=>el.matches(unitSelector));
    groups.forEach((el,j)=>{el.classList.add('reveal','motion-group');el.style.setProperty('--reveal-delay',Math.min(j*70,300)+'ms')});
    const units=sec.querySelectorAll('.card-grid>article,.leadership-list>article,.program-card,.marketplace-grid>article,.large-copy>p,ul>li,.actions>.button,.join-visuals>*');
    units.forEach((el,j)=>{el.classList.add('motion-unit');el.style.setProperty('--unit-delay',Math.min((j%10)*55,495)+'ms')});
  });

  const reveals=[...d.querySelectorAll('.reveal')];
  if(!reduce&&'IntersectionObserver'in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px',threshold:.04}); reveals.forEach(el=>io.observe(el));
    const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-section-visible');sio.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px',threshold:.03}); sections.forEach(s=>sio.observe(s));
  } else {reveals.forEach(el=>el.classList.add('is-visible'));sections.forEach(s=>s.classList.add('is-section-visible'))}

  // Media reveal and scroll-parallax set only while visible.
  const hosts=[...d.querySelectorAll('.source-visual,.card-grid article,.leadership-list article,.program-card,.marketplace-grid article,.product-hero-media,.join-visuals,.announcement-poster,.hero-media,.leadership-photo-strip figure')].filter(h=>h.matches('img')||h.querySelector('img'));
  hosts.forEach((h,i)=>h.classList.add('media-reveal',i%2?'media-reveal-right':'media-reveal-left'));
  if(!reduce&&'IntersectionObserver'in window){
    const mio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-media-visible');activeMedia.add(e.target)}else activeMedia.delete(e.target)}),{rootMargin:'120px 0px',threshold:.01}); hosts.forEach(h=>mio.observe(h));
  } else hosts.forEach(h=>h.classList.add('is-media-visible'));

  // One delegated pointer handler for media parallax and magnetic buttons.
  if(fine&&!reduce){
    let active=null,button=null,movePending=false,lastEvent=null;
    d.addEventListener('pointermove',e=>{
      lastEvent=e;
      const h=e.target.closest('.media-reveal'); if(h!==active){if(active){active.style.removeProperty('--mx');active.style.removeProperty('--my')}active=h}
      const b=e.target.closest('.button'); if(b!==button){if(button){button.style.removeProperty('--bx');button.style.removeProperty('--by')}button=b}
      if(movePending)return; movePending=true;
      requestAnimationFrame(()=>{movePending=false;if(!lastEvent)return;
        if(active){const r=active.getBoundingClientRect();active.style.setProperty('--mx',(((lastEvent.clientX-r.left)/Math.max(1,r.width)-.5)*8).toFixed(2)+'px');active.style.setProperty('--my',(((lastEvent.clientY-r.top)/Math.max(1,r.height)-.5)*8).toFixed(2)+'px')}
        if(button){const r=button.getBoundingClientRect();button.style.setProperty('--bx',(((lastEvent.clientX-r.left)/Math.max(1,r.width)-.5)*7).toFixed(2)+'px');button.style.setProperty('--by',(((lastEvent.clientY-r.top)/Math.max(1,r.height)-.5)*5).toFixed(2)+'px')}
      });
    },{passive:true});
    d.addEventListener('pointerout',e=>{if(active&&!active.contains(e.relatedTarget)){active.style.removeProperty('--mx');active.style.removeProperty('--my');active=null}if(button&&!button.contains(e.relatedTarget)){button.style.removeProperty('--bx');button.style.removeProperty('--by');button=null}},{passive:true});
  }

  d.querySelectorAll('main img').forEach(img=>{img.classList.add('image-loading');const done=()=>{img.classList.remove('image-loading');img.classList.add('image-ready')};if(img.complete&&img.naturalWidth)done();else img.addEventListener('load',done,{once:true});img.addEventListener('error',()=>{img.classList.remove('image-loading');img.classList.add('image-error')},{once:true})});

  const video=d.querySelector('.hero-stalin-video');
  if(video){
    const panel=video.closest('.hero-stalin-panel');
    const mobile=matchMedia('(max-width:700px)').matches;
    const wanted=mobile?video.dataset.mobileSrc:video.dataset.desktopSrc;
    if(wanted && video.getAttribute('src')!==wanted){video.src=wanted;video.load()}
    video.muted=true; video.defaultMuted=true; video.loop=true; video.autoplay=true; video.playsInline=true;
    let lastTime=-1, lastProgressAt=performance.now();
    const showFallback=()=>panel?.classList.remove('hero-video-playing');
    const revealVideo=()=>{
      const now=performance.now();
      if(video.currentTime>lastTime+.03){lastTime=video.currentTime;lastProgressAt=now}
      if(video.currentTime>.12 && !video.paused && video.readyState>=2)panel?.classList.add('hero-video-playing');
    };
    const tryPlay=()=>{if(!d.hidden){const p=video.play();if(p&&p.catch)p.catch(showFallback)}};
    ['timeupdate','playing','loadeddata','canplay'].forEach(ev=>video.addEventListener(ev,()=>{revealVideo();if(ev==='canplay')tryPlay()},{passive:true}));
    ['error','stalled','abort','emptied'].forEach(ev=>video.addEventListener(ev,showFallback,{passive:true}));
    addEventListener('pageshow',tryPlay,{passive:true});
    d.addEventListener('visibilitychange',()=>{if(d.hidden)video.pause();else tryPlay()});
    const watchdog=setInterval(()=>{
      if(d.hidden)return;
      revealVideo();
      if(panel?.classList.contains('hero-video-playing') && performance.now()-lastProgressAt>2200)showFallback();
      if(video.paused || video.readyState<2)tryPlay();
    },900);
    addEventListener('pagehide',()=>clearInterval(watchdog),{once:true});
    tryPlay(); setTimeout(tryPlay,180); setTimeout(tryPlay,700);
  }

  // Giving Kitchen-style impact: replay whenever the section leaves view and is entered again.
  const impact=d.querySelector('.impact-band');
  const format=(n)=>Math.round(n).toLocaleString('en-US');
  const resetStat=(el)=>{el._countRun=(el._countRun||0)+1;el.textContent='0';el.classList.remove('is-spinning','is-settled')};
  const settleStat=(el,instant=false)=>{const target=Number(el.dataset.count||0),suffix=el.dataset.suffix||'';el._countRun=(el._countRun||0)+1;const run=el._countRun;if(instant||reduce){el.textContent=format(target)+suffix;el.classList.add('is-settled');return}el.classList.remove('is-settled');el.classList.add('is-spinning');const start=performance.now(),dur=target>=1000?2200:1650;const tick=t=>{if(run!==el._countRun)return;const p=Math.min(1,(t-start)/dur),ease=1-Math.pow(1-p,4),v=target*ease;el.textContent=format(v)+suffix;if(p<1)requestAnimationFrame(tick);else{el.textContent=format(target)+suffix;el.classList.remove('is-spinning');el.classList.add('is-settled')}};requestAnimationFrame(tick)};
  if(impact){
    const counters=[...impact.querySelectorAll('[data-count]')];
    if(reduce)counters.forEach(e=>settleStat(e,true));
    else {
      let armed=true,timers=[];
      const clearTimers=()=>{timers.forEach(clearTimeout);timers=[]};
      const play=()=>{if(!armed)return;armed=false;clearTimers();impact.classList.add('impact-played');counters.forEach(resetStat);counters.forEach((c,i)=>timers.push(setTimeout(()=>settleStat(c),i*260)))};
      const reset=()=>{if(armed)return;armed=true;clearTimers();impact.classList.remove('impact-played');counters.forEach(resetStat)};
      const iio=new IntersectionObserver(es=>es.forEach(e=>{if(e.intersectionRatio>=.34)play();else if(e.intersectionRatio<=.10)reset()}),{threshold:[0,.10,.34,.6]});
      iio.observe(impact);
    }
  }

  // Homepage special announcement: only animate while visible; reduced-motion renders the final state immediately.
  const announcement=d.querySelector('.home-announcement');
  if(announcement){
    const show=()=>announcement.classList.add('is-announcement-visible');
    if(reduce){show();}
    else if('IntersectionObserver'in window){
      const aio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){show();announcement.classList.add('is-announcement-active')}else announcement.classList.remove('is-announcement-active')}),{rootMargin:'140px 0px',threshold:.06});
      aio.observe(announcement);
      d.addEventListener('visibilitychange',()=>{if(d.hidden)announcement.classList.remove('is-announcement-active')});
    } else {show();announcement.classList.add('is-announcement-active')}
  }

  // Auto rails allocate timers only while visible and stop in hidden tabs or during interaction.
  const autoTracks=[];
  if(page==='home') autoTracks.push(d.querySelector('main>section:nth-of-type(5) .card-grid'),d.querySelector('main>section:nth-of-type(7) ul'));
  if(page==='declarationendorsements') {const e=d.querySelector('.card-grid');if(e){e.classList.add('endorsement-motion-rail');autoTracks.push(e)}}
  autoTracks.filter(Boolean).forEach((track,idx)=>{
    if(reduce)return; let timer=0,visible=false,paused=false;
    const stop=()=>{if(timer){clearInterval(timer);timer=0}}, advance=()=>{if(paused||!visible||d.hidden||track.scrollWidth<=track.clientWidth+8)return;const first=track.firstElementChild,step=(first?first.getBoundingClientRect().width:track.clientWidth*.7)+22,near=track.scrollLeft+track.clientWidth>=track.scrollWidth-step*.55;track.scrollTo({left:near?0:track.scrollLeft+step,behavior:'smooth'})}, start=()=>{stop();if(visible&&!paused&&!d.hidden)timer=setInterval(advance,idx===2?2700:3900+idx*500)};
    ['pointerenter','focusin','touchstart'].forEach(ev=>track.addEventListener(ev,()=>{paused=true;stop()},{passive:true}));['pointerleave','focusout','touchend'].forEach(ev=>track.addEventListener(ev,()=>{paused=false;start()},{passive:true}));
    const rio=new IntersectionObserver(es=>es.forEach(e=>{visible=e.isIntersecting;visible?start():stop()}),{rootMargin:'100px 0px',threshold:.01});rio.observe(track);d.addEventListener('visibilitychange',()=>d.hidden?stop():start());
  });

  // Page transitions for same-site HTML navigation only; never delays external links, mailto, downloads or new tabs.
  if(!reduce)d.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download'))return;let u;try{u=new URL(a.href,location.href)}catch{return}if(u.origin!==location.origin||!(u.pathname.endsWith('.html')||u.pathname.endsWith('/'))||u.href===location.href||(u.pathname===location.pathname&&u.hash))return;e.preventDefault();body.classList.add('is-page-leaving');setTimeout(()=>location.href=u.href,210)});


  // ===== Giving Kitchen interaction completion pass =====
  const gkDesktop=matchMedia('(min-width:821px) and (hover:hover) and (pointer:fine)');
  const navGroups={
    'about.html':[
      ['About','about.html'],['Vision','vision-statement.html'],['Team','partners.html']
    ],
    'vision-statement.html':[
      ['About','about.html'],['Vision','vision-statement.html'],['Team','partners.html']
    ],
    'partners.html':[
      ['About','about.html'],['Vision','vision-statement.html'],['Team','partners.html']
    ],
    'educationtraining.html':[
      ['Education','educationtraining.html'],['Certificates','certificate-program.html'],['LEARN','learn.html'],['LEAD','lead.html'],['ACT','act.html']
    ],
    'certificate-program.html':[
      ['Education','educationtraining.html'],['Certificates','certificate-program.html'],['LEARN','learn.html'],['LEAD','lead.html'],['ACT','act.html']
    ],
    'global-declaration.html':[
      ['Declaration','global-declaration.html'],['Sign Global Declaration','sign-global-declaration.html'],['Declaration Endorsements','declarationendorsements.html']
    ],
    'events.html':[
      ['Events','events.html'],['World Symposium Against Antizionism','symposium.html']
    ],
    'volunteer.html':[
      ['Get Involved','volunteer.html'],['Donate','donate-1.html'],['Marketplace','marketplace.html']
    ]
  };
  const navMedia={
    'about.html':'leadership-naya-960.webp',
    'vision-statement.html':'leadership-natasha-960.webp',
    'partners.html':'leadership-kile-960.webp',
    'educationtraining.html':'antizionist-certification-fall-2026-840.webp',
    'certificate-program.html':'antizionist-certification-fall-2026-840.webp',
    'global-declaration.html':'https://images.squarespace-cdn.com/content/v1/691ddea6053ddb3437696ada/4ab255ff-96c1-4a3a-b02f-2a92a124c128/StopAZ_GlobalDeclarationBanner_2.png',
    'events.html':'https://images.squarespace-cdn.com/content/v1/691ddea6053ddb3437696ada/efddb611-8678-4aec-b057-9c9ff7bd5bb2/TheatreSymposium%2B%281%29.png',
    'volunteer.html':'https://images.squarespace-cdn.com/content/v1/691ddea6053ddb3437696ada/3a7cfeb5-28fc-4f41-a48e-6fb871b76591/Leadership%2B%281%29.png'
  };

  let mega=null,megaLinks=null,megaImg=null,megaOpenFor='',megaCloseTimer=0;
  if(header&&menu){
    mega=d.createElement('div'); mega.className='desktop-mega'; mega.setAttribute('aria-hidden','true');
    const inner=d.createElement('div'); inner.className='desktop-mega-inner';
    megaLinks=d.createElement('nav'); megaLinks.className='desktop-mega-links';
    const media=d.createElement('div'); media.className='desktop-mega-media'; media.setAttribute('aria-hidden','true');
    megaImg=d.createElement('img'); megaImg.alt=''; megaImg.decoding='async';megaImg.addEventListener('error',()=>{if(!megaImg.src.endsWith('stalin-hero-poster.jpg'))megaImg.src='stalin-hero-poster.jpg'}); media.appendChild(megaImg);
    inner.append(megaLinks,media); mega.appendChild(inner); header.insertAdjacentElement('afterend',mega);
    const closeMega=()=>{clearTimeout(megaCloseTimer);mega.classList.remove('is-open');mega.setAttribute('aria-hidden','true');body.classList.remove('mega-open');menu.querySelectorAll('a.mega-active').forEach(x=>{x.classList.remove('mega-active');x.setAttribute('aria-expanded','false')});megaOpenFor=''};
    const scheduleClose=()=>{clearTimeout(megaCloseTimer);megaCloseTimer=setTimeout(closeMega,170)};
    const keepOpen=()=>clearTimeout(megaCloseTimer);
    const openMega=(a)=>{
      if(!gkDesktop.matches)return;
      menu.querySelectorAll('a.mega-active').forEach(x=>{if(x!==a){x.classList.remove('mega-active');x.setAttribute('aria-expanded','false')}});
      const href=(a.getAttribute('href')||'').split('/').pop()||''; const group=navGroups[href]; if(!group)return closeMega();
      keepOpen(); header.classList.remove('header-hidden');
      de.style.setProperty('--mega-top',Math.max(0,header.getBoundingClientRect().bottom)+'px');
      if(megaOpenFor!==href){
        megaLinks.replaceChildren(...group.map(([label,url])=>{const x=d.createElement('a');x.className='desktop-mega-link';x.href=url;x.textContent=label;return x}));
        megaImg.src=navMedia[href]||''; megaOpenFor=href;
      }
      a.classList.add('mega-active');a.setAttribute('aria-haspopup','true');a.setAttribute('aria-expanded','true');mega.classList.add('is-open');mega.setAttribute('aria-hidden','false');body.classList.add('mega-open');
    };
    menu.querySelectorAll('a').forEach(a=>{const href=(a.getAttribute('href')||'').split('/').pop()||'';if(navGroups[href]){a.setAttribute('aria-haspopup','true');a.setAttribute('aria-expanded','false')}a.addEventListener('pointerenter',()=>openMega(a));a.addEventListener('focus',()=>openMega(a))});
    header.addEventListener('pointerenter',keepOpen);header.addEventListener('pointerleave',e=>{if(!mega.contains(e.relatedTarget))scheduleClose()});
    mega.addEventListener('pointerenter',keepOpen);mega.addEventListener('pointerleave',e=>{if(!header.contains(e.relatedTarget))scheduleClose()});
    mega.addEventListener('focusin',keepOpen);mega.addEventListener('focusout',e=>{if(!header.contains(e.relatedTarget)&&!mega.contains(e.relatedTarget))scheduleClose()});
    d.addEventListener('keydown',e=>{if(e.key==='Escape')closeMega()});
    addEventListener('resize',()=>{if(mega.classList.contains('is-open'))de.style.setProperty('--mega-top',Math.max(0,header.getBoundingClientRect().bottom)+'px')},{passive:true});
  }

  // Full-screen icon-only search. Results use only existing STOPAZ page names.
  if(header){
    const searchToggle=d.createElement('button'); searchToggle.type='button'; searchToggle.className='site-search-toggle'; searchToggle.setAttribute('aria-label','Search');
    const search=d.createElement('div'); search.className='search-overlay'; search.setAttribute('aria-hidden','true');
    const shell=d.createElement('div'); shell.className='search-shell';
    const close=d.createElement('button'); close.type='button';close.className='search-close';close.textContent='×';close.setAttribute('aria-label','Close');
    const field=d.createElement('input'); field.className='search-field';field.type='search';field.autocomplete='off';field.spellcheck=false;field.setAttribute('aria-label','Search');
    const results=d.createElement('div'); results.className='search-results';
    shell.append(field,results);search.append(close,shell);body.appendChild(search);
    header.insertBefore(searchToggle,toggle||menu);
    const sitePages=[
      ['STOP AZ','index.html'],['About','about.html'],['Vision Statement','vision-statement.html'],['Team/Partners','partners.html'],['Education & Training','educationtraining.html'],['StopAZ Certificate Program','certificate-program.html'],['Global Declaration','global-declaration.html'],['Sign Global Declaration','sign-global-declaration.html'],['Declaration Endorsements','declarationendorsements.html'],['Support & Partner','volunteer.html'],['Marketplace','marketplace.html'],['LEARN','learn.html'],['LEAD','lead.html'],['ACT','act.html'],['World Symposium Against Antizionism','symposium.html'],['Events','events.html'],['Donate','donate-1.html']
    ];
    const renderSearch=()=>{const q=field.value.trim().toLowerCase();results.replaceChildren();if(!q)return;sitePages.filter(([label])=>label.toLowerCase().includes(q)).slice(0,10).forEach(([label,url])=>{const a=d.createElement('a');a.className='search-result';a.href=url;a.textContent=label;results.appendChild(a)})};
    const closeSearch=()=>{search.classList.remove('is-open');search.setAttribute('aria-hidden','true');body.classList.remove('search-open');field.value='';results.replaceChildren();searchToggle.focus({preventScroll:true})};
    const openSearch=()=>{if(mega&&mega.classList.contains('is-open')){mega.classList.remove('is-open');mega.setAttribute('aria-hidden','true');body.classList.remove('mega-open')}search.classList.add('is-open');search.setAttribute('aria-hidden','false');body.classList.add('search-open');setTimeout(()=>field.focus(),60)};
    searchToggle.addEventListener('click',openSearch);close.addEventListener('click',closeSearch);field.addEventListener('input',renderSearch);search.addEventListener('click',e=>{if(e.target===search)closeSearch()});search.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const fs=[close,field,...results.querySelectorAll('a')].filter(x=>!x.disabled);if(!fs.length)return;const first=fs[0],last=fs[fs.length-1];if(e.shiftKey&&d.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&d.activeElement===last){e.preventDefault();first.focus()}});d.addEventListener('keydown',e=>{if(e.key==='Escape'&&search.classList.contains('is-open'))closeSearch()});
  }

  // Persistent existing CTA + icon-only back-to-top.
  if(page!=='volunteer'){
    const float=d.createElement('a');float.className='floating-get-involved';float.href='volunteer.html';float.textContent='Get Involved';body.appendChild(float);
    let floatRaf=0;const updateFloat=()=>{floatRaf=0;float.classList.toggle('is-visible',!body.classList.contains('mega-open')&&!body.classList.contains('search-open'))};const queueFloat=()=>{if(!floatRaf)floatRaf=requestAnimationFrame(updateFloat)};addEventListener('scroll',queueFloat,{passive:true});addEventListener('resize',queueFloat,{passive:true});new MutationObserver(queueFloat).observe(body,{attributes:true,attributeFilter:['class']});updateFloat();
  }
  const topButton=d.createElement('button');topButton.type='button';topButton.className='back-to-top';topButton.setAttribute('aria-label','Back to top');body.appendChild(topButton);
  let topRaf=0;const updateTop=()=>{topRaf=0;topButton.classList.toggle('is-visible',scrollY>900)};const queueTop=()=>{if(!topRaf)topRaf=requestAnimationFrame(updateTop)};addEventListener('scroll',queueTop,{passive:true});addEventListener('resize',queueTop,{passive:true});updateTop();topButton.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));

  // Rich carousel controls and pointer drag. Arrow-only controls add no visible wording.
  const carouselTracks=[];
  if(page==='home'){
    const s5=d.querySelector('main>section:nth-of-type(5) .card-grid'),s7=d.querySelector('main>section:nth-of-type(7) ul'),s9=d.querySelector('main>section:nth-of-type(9) .card-grid');
    [s5,s7,s9].filter(Boolean).forEach(t=>carouselTracks.push(t));
  }
  carouselTracks.forEach(track=>{
    track.classList.add('gk-carousel-track'); const host=track.parentElement;host.classList.add('gk-carousel-host');
    const controls=d.createElement('div');controls.className='carousel-controls';
    const make=(dir)=>{const b=d.createElement('button');b.type='button';b.setAttribute('aria-label',dir<0?'Previous':'Next');const s=d.createElement('span');s.setAttribute('aria-hidden','true');s.textContent=dir<0?'←':'→';b.appendChild(s);b.addEventListener('click',()=>{const first=track.firstElementChild,step=(first?first.getBoundingClientRect().width:track.clientWidth*.75)+22;track.scrollBy({left:dir*step,behavior:reduce?'auto':'smooth'})});return b};
    controls.append(make(-1),make(1));host.appendChild(controls);
    if(fine){let dragging=false,startX=0,startLeft=0;track.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;startX=e.clientX;startLeft=track.scrollLeft;track.classList.add('is-dragging');track.setPointerCapture?.(e.pointerId)});track.addEventListener('pointermove',e=>{if(!dragging)return;track.scrollLeft=startLeft-(e.clientX-startX)});const end=e=>{if(!dragging)return;dragging=false;track.classList.remove('is-dragging');try{track.releasePointerCapture?.(e.pointerId)}catch{}};track.addEventListener('pointerup',end);track.addEventListener('pointercancel',end)}
  });

  const footer=d.querySelector('.footer'); if(footer){footer.classList.add('motion-footer');if(!reduce&&'IntersectionObserver'in window){const fio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){footer.classList.add('is-footer-visible');fio.disconnect()}}),{threshold:.04});fio.observe(footer)}else footer.classList.add('is-footer-visible')}

  const form=d.getElementById('inquiry-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(form),subject=fd.get('subject')||'STOPAZ inquiry',msg=`Name: ${fd.get('name')||''}\nOrganization: ${fd.get('organization')||''}\nEmail: ${fd.get('email')||''}\n\n${fd.get('message')||''}`;location.href=`mailto:info@stopaz.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`});
})();
