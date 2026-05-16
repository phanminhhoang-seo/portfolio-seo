'use strict';
(function () {
  const ROLES = ['an SEO Specialist', 'a Technical SEO Strategist', 'a Content Optimization Expert', 'a Digital Growth Leader'];
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];
  const mob = () => window.innerWidth <= 768;

  /* ============================================================
     1. GSAP ANIMATIONS (the big upgrade)
     ============================================================ */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* --- Hero stagger --- */
    gsap.from('.hero .gsap-fade', {
      y: 50, opacity: 0, duration: 0.9, stagger: 0.15,
      ease: 'power3.out', delay: 0.2
    });

    /* --- Float cards pop in --- */
    gsap.from('.float-card', {
      scale: 0, opacity: 0, duration: 0.6, stagger: 0.2,
      ease: 'back.out(1.7)', delay: 1.0
    });

    /* --- Section labels & titles --- */
    $$('.section-head .gsap-fade').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
      });
    });

    /* --- Skills: stagger from bottom --- */
    gsap.from('.gsap-skill', {
      scrollTrigger: { trigger: '.skills-grid', start: 'top 80%' },
      y: 60, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out'
    });

    /* --- Experience timeline: line fills as you scroll --- */
    const fill = $('#expLineFill');
    if (fill) {
      ScrollTrigger.create({
        trigger: '.exp-list',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 0.5,
        onUpdate: self => {
          fill.style.height = (self.progress * 100) + '%';
        }
      });
    }

    /* --- Experience cards: alternate slide in + dot lights up --- */
    $$('.gsap-exp').forEach((card, i) => {
      const isLeft = i % 2 === 0;
      const dot = card.querySelector('.exp-dot');

      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 78%',
          toggleActions: 'play none none none'
        },
        x: mob() ? 0 : (isLeft ? -80 : 80),
        y: mob() ? 40 : 0,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          if (dot) dot.classList.add('dot-lit');
        }
      });
    });

    /* --- Projects: stagger with scale --- */
    gsap.from('.gsap-proj', {
      scrollTrigger: { trigger: '.proj-grid', start: 'top 80%' },
      y: 50, opacity: 0, scale: 0.95, duration: 0.7, stagger: 0.12, ease: 'power3.out'
    });

    /* --- Gallery fade in --- */
    $$('.gallery.gsap-fade, .gallery-controls .gsap-fade, .contact-row.gsap-fade').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%' },
        y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
      });
    });

    /* --- Contact cards --- */
    gsap.from('.cc', {
      scrollTrigger: { trigger: '.contact-row', start: 'top 80%' },
      y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out'
    });

    /* --- Parallax hero photo --- */
    if (!mob()) {
      gsap.to('.hero-photo-wrap', {
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        y: 80, ease: 'none'
      });
    }
  }

  /* ============================================================
     2. TYPING
     ============================================================ */
  function initTyping() {
    const el = $('#typed'); if (!el) return;
    let ri = 0, ci = 0, del = false;
    function tick() {
      const w = ROLES[ri];
      if (!del) { el.textContent = w.slice(0, ++ci); if (ci === w.length) return setTimeout(() => { del = true; tick() }, 2000); setTimeout(tick, 60) }
      else { el.textContent = w.slice(0, --ci); if (ci === 0) { del = false; ri = (ri + 1) % ROLES.length; return setTimeout(tick, 350) } setTimeout(tick, 30) }
    }
    setTimeout(tick, 600);
  }

  /* ============================================================
     3. COUNTERS (uses GSAP ScrollTrigger for trigger)
     ============================================================ */
  function initCounters() {
    $$('[data-count]').forEach(el => {
      const end = parseFloat(el.dataset.count);
      const hasDot = String(end).includes('.');
      const dec = hasDot ? (String(end).split('.')[1] || '').length : 0;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: end, duration: 1.4, ease: 'power2.out',
            onUpdate: function () {
              el.textContent = hasDot ? this.targets()[0].val.toFixed(dec) : Math.round(this.targets()[0].val);
            }
          });
        }
      });
    });
  }

  /* ============================================================
     4. HEADER SCROLL
     ============================================================ */
  function initHeader() {
    const h = $('#header'); if (!h) return;
    let t = false;
    window.addEventListener('scroll', () => {
      if (!t) { requestAnimationFrame(() => { h.classList.toggle('scrolled', window.scrollY > 60); t = false }); t = true }
    }, { passive: true });
  }

  /* ============================================================
     5. MOBILE MENU
     ============================================================ */
  function initMenu() {
    const btn = $('#menuBtn'), nav = $('#nav'); if (!btn || !nav) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const o = btn.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('no-scroll', o);
    });
    $$('a', nav).forEach(a => a.addEventListener('click', () => {
      btn.classList.remove('active'); nav.classList.remove('active'); document.body.classList.remove('no-scroll');
    }));
    document.addEventListener('click', e => {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        btn.classList.remove('active'); nav.classList.remove('active'); document.body.classList.remove('no-scroll');
      }
    });
  }

  /* ============================================================
     6. SMOOTH SCROLL
     ============================================================ */
  function initScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href'); if (!id || id === '#') return;
        const target = $(id); if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - (mob() ? 76 : 84), behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     7. GALLERY
     ============================================================ */
  function initGallery() {
    const track = $('#galleryTrack'), prev = $('#galPrev'), next = $('#galNext'), dots = $('#galDots');
    if (!track || !prev || !next || !dots) return;
    const slides = $$('.gallery-slide', track), total = slides.length;
    let idx = 0;
    const pv = () => mob() ? 1 : 2;
    function buildDots() {
      const pages = Math.ceil(total / pv()); dots.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const d = document.createElement('span');
        d.className = 'gc-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => go(i));
        dots.appendChild(d);
      }
    }
    function go(i) {
      const pages = Math.ceil(total / pv());
      idx = Math.max(0, Math.min(i, pages - 1));
      const w = slides[0].offsetWidth + 20;
      track.style.transform = `translateX(-${idx * w * pv()}px)`;
      $$('.gc-dot', dots).forEach((d, j) => d.classList.toggle('active', j === idx));
    }
    buildDots();
    prev.addEventListener('click', () => go(idx - 1));
    next.addEventListener('click', () => go(idx + 1));
    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.touches[0].clientX }, { passive: true });
    track.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(dx < 0 ? idx + 1 : idx - 1) }, { passive: true });
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { buildDots(); go(0) }, 300) });
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    initGSAP();
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
