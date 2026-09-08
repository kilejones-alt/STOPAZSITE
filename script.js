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

  const video=d.querySelector('.hero-stalin-video,.site-bg-video video');
  if(video){if(saveData||reduce){video.autoplay=false;video.pause();video.removeAttribute('autoplay')}else if('IntersectionObserver'in window){const vio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){video.play().catch(()=>{})}else video.pause()}),{threshold:.02});vio.observe(video)}}

  // Giving Kitchen-style impact: spinner + odometer count settles into the large verified metrics.
  const impact=d.querySelector('.impact-band');
  const format=(n)=>Math.round(n).toLocaleString('en-US');
  const settleStat=(el,instant=false)=>{const target=Number(el.dataset.count||0),suffix=el.dataset.suffix||'';if(instant||reduce){el.textContent=format(target)+suffix;return}el.classList.add('is-spinning');const start=performance.now(),dur=target>=1000?2200:1650;const tick=t=>{const p=Math.min(1,(t-start)/dur),ease=1-Math.pow(1-p,4),v=target*ease;el.textContent=format(v)+suffix;if(p<1)requestAnimationFrame(tick);else{el.textContent=format(target)+suffix;el.classList.remove('is-spinning');el.classList.add('is-settled')}};requestAnimationFrame(tick)};
  if(impact){const counters=[...impact.querySelectorAll('[data-count]')]; if(reduce)counters.forEach(e=>settleStat(e,true)); else {const iio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!impact.classList.contains('impact-played')){impact.classList.add('impact-played');counters.forEach((c,i)=>setTimeout(()=>settleStat(c),i*260));iio.disconnect()}}),{threshold:.24});iio.observe(impact)}}

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

  const footer=d.querySelector('.footer'); if(footer){footer.classList.add('motion-footer');if(!reduce&&'IntersectionObserver'in window){const fio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){footer.classList.add('is-footer-visible');fio.disconnect()}}),{threshold:.04});fio.observe(footer)}else footer.classList.add('is-footer-visible')}

  const form=d.getElementById('inquiry-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(form),subject=fd.get('subject')||'STOPAZ inquiry',msg=`Name: ${fd.get('name')||''}\nOrganization: ${fd.get('organization')||''}\nEmail: ${fd.get('email')||''}\n\n${fd.get('message')||''}`;location.href=`mailto:info@stopaz.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`});
})();
