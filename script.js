'use strict';

/* ====================================================================
   Portfolio JS v3 — Lean, performant, polished
   ==================================================================== */
(function () {

  /* ---------- CONFIG ---------- */
  const ROLES = [
    'an SEO Specialist',
    'a Technical SEO Strategist',
    'a Content Optimization Expert',
    'a Digital Growth Leader',
  ];

  /* ---------- Helpers ---------- */
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];
  const isMobile = () => window.innerWidth <= 768;

  /* =================================================================
     1. SCROLL-REVEAL  (IntersectionObserver + data-delay stagger)
     ================================================================= */
  function initReveal() {
    const items = $$('.anim');
    if (!items.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.delay || '0', 10);
            setTimeout(() => e.target.classList.add('in'), delay);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    items.forEach((el) => io.observe(el));
  }

  /* =================================================================
     2. TYPING
     ================================================================= */
  function initTyping() {
    const el = $('#typed');
    if (!el) return;

    let ri = 0, ci = 0, del = false;
    function tick() {
      const word = ROLES[ri];
      if (!del) {
        el.textContent = word.slice(0, ++ci);
        if (ci === word.length) return setTimeout(() => { del = true; tick(); }, 2000);
        setTimeout(tick, 65);
      } else {
        el.textContent = word.slice(0, --ci);
        if (ci === 0) { del = false; ri = (ri + 1) % ROLES.length; return setTimeout(tick, 350); }
        setTimeout(tick, 30);
      }
    }
    setTimeout(tick, 700);
  }

  /* =================================================================
     3. COUNTERS
     ================================================================= */
  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            countUp(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    nums.forEach((n) => io.observe(n));
  }

  function countUp(el) {
    const end = parseFloat(el.dataset.count);
    const hasDot = String(end).includes('.');
    const dec = hasDot ? (String(end).split('.')[1] || '').length : 0;
    const dur = 1400;
    const t0 = performance.now();

    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = hasDot ? (ease * end).toFixed(dec) : Math.round(ease * end);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* =================================================================
     4. HEADER SCROLL
     ================================================================= */
  function initHeader() {
    const h = $('#header');
    if (!h) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          h.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* =================================================================
     5. MOBILE MENU
     ================================================================= */
  function initMenu() {
    const btn = $('#menuBtn');
    const nav = $('#nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = btn.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('no-scroll', open);
    });

    $$('a', nav).forEach((a) =>
      a.addEventListener('click', () => {
        btn.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      })
    );

    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        btn.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  /* =================================================================
     6. SMOOTH SCROLL
     ================================================================= */
  function initScroll() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        const off = isMobile() ? 76 : 80;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
      });
    });
  }

  /* =================================================================
     7. GALLERY
     ================================================================= */
  function initGallery() {
    const track = $('#galleryTrack');
    const prev = $('#galPrev');
    const next = $('#galNext');
    const dots = $('#galDots');
    if (!track || !prev || !next || !dots) return;

    const slides = $$('.gallery-slide', track);
    const total = slides.length;
    let idx = 0;

    function perView() { return isMobile() ? 1 : 2; }

    function buildDots() {
      const pages = Math.ceil(total / perView());
      dots.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const d = document.createElement('span');
        d.className = 'gn-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => go(i));
        dots.appendChild(d);
      }
    }

    function go(i) {
      const pages = Math.ceil(total / perView());
      idx = Math.max(0, Math.min(i, pages - 1));
      const slide = slides[0];
      if (!slide) return;
      const w = slide.offsetWidth + 20; // gap
      track.style.transform = `translateX(-${idx * w * perView()}px)`;
      $$('.gn-dot', dots).forEach((d, j) => d.classList.toggle('active', j === idx));
    }

    buildDots();
    prev.addEventListener('click', () => go(idx - 1));
    next.addEventListener('click', () => go(idx + 1));

    // Touch swipe
    let sx = 0;
    track.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(dx < 0 ? idx + 1 : idx - 1);
    }, { passive: true });

    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { buildDots(); go(0); }, 300);
    });
  }

  /* =================================================================
     BOOT
     ================================================================= */
  function boot() {
    initReveal();
    initTyping();
    initCounters();
    initHeader();
    initMenu();
    initScroll();
    initGallery();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
