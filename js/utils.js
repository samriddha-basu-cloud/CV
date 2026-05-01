/* ============================================================
   SHARED JS — utils.js
   Scroll reveal, nav behavior, counters, active link tracking
   ============================================================ */

// ── Nav scroll behavior ──────────────────────────────────────
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  // Hamburger toggle
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Active link highlight on scroll
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href')?.includes(e.target.dataset.section));
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => obs.observe(s));
})();

// ── Scroll Reveal ────────────────────────────────────────────
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left');
  if (!revealEls.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => obs.observe(el));
})();

// ── Animated Counters ────────────────────────────────────────
function animateCounter(el, target, duration = 1400, suffix = '') {
  let start = 0;
  const step = target / (duration / 16);
  const isFloat = String(target).includes('.');
  function tick() {
    start = Math.min(start + step, target);
    el.textContent = (isFloat ? start.toFixed(1) : Math.floor(start)) + suffix;
    if (start < target) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, 1400, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
}
document.addEventListener('DOMContentLoaded', initCounters);

// ── Skill bar animations ──────────────────────────────────────
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => obs.observe(b));
}
document.addEventListener('DOMContentLoaded', initSkillBars);

// ── Typewriter ───────────────────────────────────────────────
function typewriter(el, strings, speed = 70, pause = 2200) {
  let si = 0, ci = 0, deleting = false;
  function tick() {
    const s = strings[si];
    if (!deleting) {
      el.textContent = s.slice(0, ++ci);
      if (ci === s.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      el.textContent = s.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        si = (si + 1) % strings.length;
      }
    }
    setTimeout(tick, deleting ? speed / 2 : speed);
  }
  tick();
}

// ── Cursor glow (desktop only) ───────────────────────────────
(function initCursorGlow() {
  if (window.matchMedia('(max-width: 900px)').matches) return;
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,159,28,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.5s cubic-bezier(0.23,1,0.32,1), top 0.5s cubic-bezier(0.23,1,0.32,1);
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

// ── Timeline connector animation ────────────────────────────
function initTimeline() {
  const lines = document.querySelectorAll('.timeline-line');
  if (!lines.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.height = e.target.dataset.height || '100%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  lines.forEach(l => obs.observe(l));
}
document.addEventListener('DOMContentLoaded', initTimeline);
