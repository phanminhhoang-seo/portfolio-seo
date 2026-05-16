'use strict';

/* ====================================================================
   MODERN PORTFOLIO JS — Scroll-driven, animated, performant
   ==================================================================== */

const App = (() => {
  /* ---------- CONFIG ---------- */
  const ROLES = [
    'an SEO Specialist',
    'a Search Optimization Expert',
    'a Technical SEO Strategist',
    'a Digital Growth Leader',
  ];

  /* ---------- STATE ---------- */
  let cursorX = 0, cursorY = 0, dotX = 0, dotY = 0, ringX = 0, ringY = 0;
  let proofIndex = 0;

  /* ---------- UTILS ---------- */
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const isMobile = () => window.innerWidth <= 768;

  /* =================================================================
     1. SCROLL REVEAL (IntersectionObserver)
     ================================================================= */
  function initScrollReveal() {
    const els = $$('.reveal-up, .reveal-left, .reveal-right');
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
  }

  /* =================================================================
     2. TYPING ANIMATION (pure JS)
     ================================================================= */
  function initTyping() {
    const el = $('#roleText');
    if (!el) return;

    let roleIdx = 0, charIdx = 0, deleting = false;

    function tick() {
      const current = ROLES[roleIdx];
      if (!deleting) {
        el.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          setTimeout(() => { deleting = true; tick(); }, 1800);
          return;
        }
        setTimeout(tick, 70);
      } else {
        el.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % ROLES.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 35);
      }
    }
    setTimeout(tick, 600);
  }

  /* =================================================================
     3. COUNTER ANIMATION
     ================================================================= */
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => io.observe(el));
  }

  function animateCounter(el) {
    const end = parseFloat(el.dataset.count);
    const isFloat = String(end).includes('.');
    const decimals = isFloat ? (String(end).split('.')[1] || '').length : 0;
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const val = eased * end;
      el.textContent = isFloat ? val.toFixed(decimals) : Math.round(val);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =================================================================
     4. HEADER SCROLL
     ================================================================= */
  function initHeaderScroll() {
    const header = $('#global-header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* =================================================================
     5. MOBILE MENU
     ================================================================= */
  function initMobileMenu() {
    const toggle = $('#mobileToggle');
    const nav = $('#mainNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = toggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('no-scroll', open);
      toggle.setAttribute('aria-expanded', open);
    });

    $$('[data-nav]', nav).forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });

    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  /* =================================================================
     6. SMOOTH SCROLL
     ================================================================= */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        const offset = isMobile() ? 80 : 90;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* =================================================================
     7. CUSTOM CURSOR
     ================================================================= */
  function initCursor() {
    if (isMobile() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    if (!dot || !ring) return;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    });

    function cursorLoop() {
      dotX = lerp(dotX, cursorX, 0.9);
      dotY = lerp(dotY, cursorY, 0.9);
      ringX = lerp(ringX, cursorX, 0.15);
      ringY = lerp(ringY, cursorY, 0.15);

      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();

    // Hover effect on interactive elements
    $$('a, button, .project-card, .skill-card, .contact-card, .proof-item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* =================================================================
     8. CARD SPOTLIGHT EFFECT (mouse glow)
     ================================================================= */
  function initCardSpotlight() {
    $$('.skill-card, .project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });
  }

  /* =================================================================
     9. PROOF GALLERY (horizontal scroll)
     ================================================================= */
  function initProofGallery() {
    const track = $('#proofTrack');
    const prevBtn = $('#proofPrev');
    const nextBtn = $('#proofNext');
    const dotsContainer = $('#proofDots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const items = $$('.proof-item', track);
    const total = items.length;
    let itemsPerView = isMobile() ? 1 : 2;

    // Build dots
    function buildDots() {
      itemsPerView = isMobile() ? 1 : 2;
      const pages = Math.ceil(total / itemsPerView);
      dotsContainer.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('span');
        dot.className = 'proof-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }
    buildDots();

    function goTo(idx) {
      const pages = Math.ceil(total / itemsPerView);
      proofIndex = Math.max(0, Math.min(idx, pages - 1));
      const item = items[0];
      if (!item) return;
      const gap = 24;
      const itemW = item.offsetWidth + gap;
      track.style.transform = `translateX(-${proofIndex * itemW * itemsPerView}px)`;

      $$('.proof-dot', dotsContainer).forEach((d, i) => {
        d.classList.toggle('active', i === proofIndex);
      });
    }

    prevBtn.addEventListener('click', () => goTo(proofIndex - 1));
    nextBtn.addEventListener('click', () => goTo(proofIndex + 1));

    // Touch swipe
    let startX = 0, startTranslate = 0, dragging = false;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      dragging = true;
    }, { passive: true });
    track.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const diff = e.touches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        dragging = false;
        if (diff < 0) goTo(proofIndex + 1);
        else goTo(proofIndex - 1);
      }
    }, { passive: true });
    track.addEventListener('touchend', () => { dragging = false; }, { passive: true });

    // Responsive
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildDots();
        goTo(0);
      }, 300);
    });
  }

  /* =================================================================
     10. PARALLAX SHAPES (subtle)
     ================================================================= */
  function initParallax() {
    if (isMobile()) return;
    const tags = $$('.floating-tag');
    if (!tags.length) return;

    window.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        tags.forEach((tag, i) => {
          const speed = 0.02 + i * 0.01;
          tag.style.transform = `translateY(${-sy * speed}px)`;
        });
      });
    }, { passive: true });
  }

  /* =================================================================
     BOOT
     ================================================================= */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot);
    } else {
      boot();
    }
  }

  function boot() {
    initScrollReveal();
    initTyping();
    initCounters();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initCursor();
    initCardSpotlight();
    initProofGallery();
    initParallax();
    console.log('✅ Portfolio loaded');
  }

  return { init };
})();

App.init();
