/* ============================================================
   VISITOR COUNTER — visitor-counter.js
   Uses api.web3forms.com hit counter (reliable, free, no auth).
   Falls back to a local estimate if network unavailable.
   Counter key is unique to this portfolio domain.
   ============================================================ */

(function initVisitorCounter() {
  var STORAGE_KEY  = 'sb_portfolio_hits';
  var SESSION_KEY  = 'sb_session_counted';
  var COUNTER_URL  = 'https://hits.sh/samriddha-basu-om.netlify.app.json';

  var displays = document.querySelectorAll('[data-visitor-count]');
  if (!displays.length) return;

  function fmt(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return '—';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1)    + 'K';
    return String(n);
  }

  function animateTo(target) {
    var cached  = parseInt(localStorage.getItem(STORAGE_KEY), 10) || 0;
    var current = Math.max(0, target - Math.min(50, Math.floor(target * 0.05)));
    var step    = Math.max(1, Math.ceil((target - current) / 25));
    function tick() {
      current = Math.min(current + step, target);
      displays.forEach(function(el) {
        el.textContent = fmt(current);
        el.classList.add('counter-loaded');
      });
      if (current < target) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    localStorage.setItem(STORAGE_KEY, String(target));
  }

  function showCached() {
    var cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      displays.forEach(function(el) {
        el.textContent = fmt(parseInt(cached, 10));
        el.classList.add('counter-loaded');
      });
    }
    // If no cache, leave as '—' — don't show fake zeros
  }

  // hits.sh returns JSON: {"count": N, "total": N}
  // Only increment if this is a fresh session
  var alreadyCounted = sessionStorage.getItem(SESSION_KEY);
  var fetchUrl = alreadyCounted
    ? COUNTER_URL.replace('.json', '/json')  // GET without increment
    : COUNTER_URL;                            // GET with increment (hits.sh default)

  // hits.sh increments on every unique visit by default
  fetch('https://hits.sh/samriddha-basu-portfolio.json')
    .then(function(r) {
      if (!r.ok) throw new Error('Network response was not ok');
      return r.json();
    })
    .then(function(data) {
      var count = data.total || data.count || data.value || 0;
      if (count > 0) {
        sessionStorage.setItem(SESSION_KEY, '1');
        animateTo(count);
      } else {
        showCached();
      }
    })
    .catch(function() {
      showCached();
    });
})();
