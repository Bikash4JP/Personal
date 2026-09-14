(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Loading screen ---------------- */
  const loader = document.getElementById('loader');
  const loadStart = Date.now();
  window.addEventListener('load', () => {
    const elapsed = Date.now() - loadStart;
    const wait = Math.max(0, 700 - elapsed);
    setTimeout(() => loader && loader.classList.add('hidden'), wait);
  });

  /* ---------------- Custom cursor glow ---------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && !isTouch) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    }, { passive: true });
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  /* ---------------- Nav: scroll state + mobile menu ---------------- */
  const nav = document.getElementById('siteNav');
  const navLinks = document.getElementById('navLinks');
  const navBurger = document.getElementById('navBurger');

  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navBurger) {
    navBurger.addEventListener('click', () => {
      navBurger.classList.toggle('open');
      navLinks.classList.toggle('open');
      nav.classList.toggle('menu-open', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navBurger.classList.remove('open');
        navLinks.classList.remove('open');
        nav.classList.remove('menu-open');
      });
    });
  }

  /* ---------------- Language toggle (EN / JP) ---------------- */
  const langToggle = document.getElementById('langToggle');
  const root = document.documentElement;

  function applyLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'jp' ? 'ja' : 'en');
    document.querySelectorAll('[data-en][data-jp]').forEach((el) => {
      el.textContent = lang === 'jp' ? el.getAttribute('data-jp') : el.getAttribute('data-en');
    });
    if (langToggle) {
      langToggle.querySelector('.lang-en').classList.toggle('active', lang === 'en');
      langToggle.querySelector('.lang-jp').classList.toggle('active', lang === 'jp');
    }
    localStorage.setItem('bt-lang', lang);
  }

  const savedLang = localStorage.getItem('bt-lang') || 'en';
  applyLang(savedLang);

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-lang');
      applyLang(current === 'en' ? 'jp' : 'en');
    });
  }

  /* ---------------- Typewriter ---------------- */
  const typewriterEl = document.getElementById('typewriter');
  const phrases = ['Full-Stack Engineer', 'AI-Driven Developer', 'フルスタックエンジニア', 'React Native Developer'];

  function typewriter() {
    if (!typewriterEl) return;
    let phraseIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndex--;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 40 : 75);
    }
    tick();
  }
  typewriter();

  /* ---------------- Reveal on scroll (IntersectionObserver) ---------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('in'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------- 3D tilt effect (profile card + project cards) ---------------- */
  function applyTilt(card) {
    if (isTouch) return;
    const maxTilt = 8;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * maxTilt).toFixed(2)}deg) rotateY(${(x * maxTilt).toFixed(2)}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  }
  document.querySelectorAll('.tilt-card').forEach(applyTilt);

  /* ---------------- Skill bars: animate width on scroll into view ---------------- */
  const skillRows = document.querySelectorAll('.skill-row');
  skillRows.forEach((row) => {
    const fill = row.querySelector('.skill-fill');
    const pct = row.getAttribute('data-pct');
    if (hasGSAP && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      gsap.to(fill, {
        width: pct + '%',
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 88%' },
      });
    } else {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fill.style.width = pct + '%';
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      obs.observe(row);
    }
  });

  /* ---------------- Stat counters ---------------- */
  document.querySelectorAll('.stat-num').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const run = () => {
      if (hasGSAP && !prefersReducedMotion) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(counter.val); },
        });
      } else {
        el.textContent = target;
      }
    };
    if (hasGSAP && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: run });
    } else {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { run(); obs.unobserve(entry.target); } });
      }, { threshold: 0.5 });
      obs.observe(el);
    }
  });

  /* ---------------- Project filter ---------------- */
  const filterTabs = document.getElementById('filterTabs');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterTabs) {
    filterTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-tab');
      if (!btn) return;
      filterTabs.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const cats = card.getAttribute('data-cats').split(' ');
        const show = filter === 'all' || cats.includes(filter);
        card.classList.toggle('hide', !show);
      });
    });
  }

  /* ---------------- Timeline stagger reveal (GSAP enhancement) ---------------- */
  if (hasGSAP && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: (i % 2) * 0.08,
        scrollTrigger: { trigger: card, start: 'top 92%' },
      });
    });
  }

  /* ---------------- Contact form (Web3Forms) ---------------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.form-submit');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      submitBtn.disabled = true;
      btnText.hidden = true;
      btnLoading.hidden = false;
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      try {
        const formData = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });
        const result = await res.json();
        if (result.success) {
          const lang = root.getAttribute('data-lang');
          formStatus.textContent = lang === 'jp' ? '送信しました。ありがとうございます！' : 'Message sent — thank you!';
          formStatus.classList.add('ok');
          form.reset();
        } else {
          throw new Error(result.message || 'Failed');
        }
      } catch (err) {
        const lang = root.getAttribute('data-lang');
        formStatus.textContent = lang === 'jp' ? '送信に失敗しました。後でもう一度お試しください。' : 'Something went wrong. Please try again.';
        formStatus.classList.add('err');
      } finally {
        submitBtn.disabled = false;
        btnText.hidden = false;
        btnLoading.hidden = true;
      }
    });
  }

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
