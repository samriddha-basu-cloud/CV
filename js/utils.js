/* ============================================================
   UTILS — utils.js
   Scroll reveal, animated counters, skill bars, typewriter,
   cursor glow, timeline connector. Nav is handled by nav.js.
   ============================================================ */

/* ── Scroll Reveal ── */
(function initReveal() {
  var els = document.querySelectorAll('.reveal, .reveal-left');
  if (!els.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(function (el) { obs.observe(el); });
})();

/* ── Animated Counters ── */
function animateCounter(el, target, duration, suffix) {
  duration = duration || 1400;
  suffix   = suffix   || '';
  var start = 0;
  var isFloat = String(target).indexOf('.') !== -1;
  var steps = Math.ceil(duration / 16);
  var step  = target / steps;
  function tick() {
    start = Math.min(start + step, target);
    el.textContent = (isFloat ? start.toFixed(1) : Math.floor(start)) + suffix;
    if (start < target) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el     = e.target;
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        animateCounter(el, target, 1400, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { obs.observe(el); });
}
document.addEventListener('DOMContentLoaded', initCounters);

/* ── Skill Bar Animations ── */
function initSkillBars() {
  var bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(function (b) { obs.observe(b); });
}
document.addEventListener('DOMContentLoaded', initSkillBars);

/* ── Typewriter ── */
function typewriter(el, strings, speed, pause) {
  speed = speed || 70;
  pause = pause || 2200;
  var si = 0, ci = 0, deleting = false;
  function tick() {
    var s = strings[si];
    if (!deleting) {
      ci++;
      el.textContent = s.slice(0, ci);
      if (ci === s.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      ci--;
      el.textContent = s.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        si = (si + 1) % strings.length;
      }
    }
    setTimeout(tick, deleting ? Math.floor(speed / 2) : speed);
  }
  tick();
}

/* ── Cursor Glow (desktop only) ── */
(function initCursorGlow() {
  if (window.matchMedia('(max-width: 900px)').matches) return;
  var glow = document.createElement('div');
  glow.style.cssText = [
    'position:fixed',
    'width:320px',
    'height:320px',
    'border-radius:50%',
    'background:radial-gradient(circle,rgba(255,159,28,0.06) 0%,transparent 70%)',
    'pointer-events:none',
    'z-index:0',
    'transform:translate(-50%,-50%)',
    'transition:left 0.5s cubic-bezier(0.23,1,0.32,1),top 0.5s cubic-bezier(0.23,1,0.32,1)',
    'will-change:left,top'
  ].join(';');
  document.body.appendChild(glow);
  document.addEventListener('mousemove', function (e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();
