'use strict';
(function(){
  const ROLES=['an SEO Specialist','a Technical SEO Strategist','a Content Optimization Expert','a Digital Growth Leader'];
  const $=(s,p)=>(p||document).querySelector(s);
  const $$=(s,p)=>[...(p||document).querySelectorAll(s)];
  const mob=()=>window.innerWidth<=768;

  // Scroll Reveal
  function initReveal(){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){const d=parseInt(e.target.dataset.delay||'0',10);setTimeout(()=>e.target.classList.add('in'),d);io.unobserve(e.target)}});
    },{threshold:.1,rootMargin:'0px 0px -30px 0px'});
    $$('.anim').forEach(el=>io.observe(el));
  }

  // Typing
  function initTyping(){
    const el=$('#typed');if(!el)return;
    let ri=0,ci=0,del=false;
    function tick(){
      const w=ROLES[ri];
      if(!del){el.textContent=w.slice(0,++ci);if(ci===w.length)return setTimeout(()=>{del=true;tick()},2000);setTimeout(tick,60)}
      else{el.textContent=w.slice(0,--ci);if(ci===0){del=false;ri=(ri+1)%ROLES.length;return setTimeout(tick,350)}setTimeout(tick,30)}
    }
    setTimeout(tick,600);
  }

  // Counters
  function initCounters(){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){countUp(e.target);io.unobserve(e.target)}});
    },{threshold:.4});
    $$('[data-count]').forEach(n=>io.observe(n));
  }
  function countUp(el){
    const end=parseFloat(el.dataset.count),hasDot=String(end).includes('.'),dec=hasDot?(String(end).split('.')[1]||'').length:0,dur=1400,t0=performance.now();
    (function step(now){const p=Math.min((now-t0)/dur,1),ease=1-Math.pow(1-p,3);el.textContent=hasDot?(ease*end).toFixed(dec):Math.round(ease*end);if(p<1)requestAnimationFrame(step)})(t0);
  }

  // Header
  function initHeader(){
    const h=$('#header');if(!h)return;let t=false;
    window.addEventListener('scroll',()=>{if(!t){requestAnimationFrame(()=>{h.classList.toggle('scrolled',window.scrollY>60);t=false});t=true}},{passive:true});
  }

  // Menu
  function initMenu(){
    const btn=$('#menuBtn'),nav=$('#nav');if(!btn||!nav)return;
    btn.addEventListener('click',e=>{e.stopPropagation();const o=btn.classList.toggle('active');nav.classList.toggle('active');document.body.classList.toggle('no-scroll',o)});
    $$('a',nav).forEach(a=>a.addEventListener('click',()=>{btn.classList.remove('active');nav.classList.remove('active');document.body.classList.remove('no-scroll')}));
    document.addEventListener('click',e=>{if(!btn.contains(e.target)&&!nav.contains(e.target)){btn.classList.remove('active');nav.classList.remove('active');document.body.classList.remove('no-scroll')}});
  }

  // Smooth Scroll
  function initScroll(){
    $$('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const id=a.getAttribute('href');if(!id||id==='#')return;const target=$(id);if(!target)return;e.preventDefault();window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-(mob()?76:84),behavior:'smooth'})})});
  }

  // Gallery
  function initGallery(){
    const track=$('#galleryTrack'),prev=$('#galPrev'),next=$('#galNext'),dots=$('#galDots');
    if(!track||!prev||!next||!dots)return;
    const slides=$$('.gallery-slide',track),total=slides.length;let idx=0;
    const pv=()=>mob()?1:2;
    function buildDots(){const pages=Math.ceil(total/pv());dots.innerHTML='';for(let i=0;i<pages;i++){const d=document.createElement('span');d.className='gc-dot'+(i===0?' active':'');d.addEventListener('click',()=>go(i));dots.appendChild(d)}}
    function go(i){const pages=Math.ceil(total/pv());idx=Math.max(0,Math.min(i,pages-1));const w=slides[0].offsetWidth+20;track.style.transform=`translateX(-${idx*w*pv()}px)`;$$('.gc-dot',dots).forEach((d,j)=>d.classList.toggle('active',j===idx))}
    buildDots();
    prev.addEventListener('click',()=>go(idx-1));next.addEventListener('click',()=>go(idx+1));
    let sx=0;
    track.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
    track.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)go(dx<0?idx+1:idx-1)},{passive:true});
    let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{buildDots();go(0)},300)});
  }

  function boot(){initReveal();initTyping();initCounters();initHeader();initMenu();initScroll();initGallery()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
