/* ============================================================
   VISITOR COUNTER — visitor-counter.js
   Uses CountAPI (free, no auth needed) for persistent count.
   Namespace: samriddha-basu-portfolio
   Falls back gracefully if network is unavailable.
   ============================================================ */

(function initVisitorCounter() {
  const NAMESPACE = 'samriddha-basu-portfolio';
  const KEY       = 'pageviews';
  const LS_KEY    = 'sb_visit_counted';

  // Find all counter display elements
  const displays = document.querySelectorAll('[data-visitor-count]');
  if (!displays.length) return;

  function formatCount(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1)    + 'K';
    return String(n);
  }

  function updateDisplays(count) {
    displays.forEach(el => {
      el.textContent = formatCount(count);
      el.classList.add('counter-loaded');
    });
  }

  // Only hit the counter once per session to avoid inflate
  const alreadyCounted = sessionStorage.getItem(LS_KEY);
  const endpoint = alreadyCounted
    ? `https://api.countapi.xyz/get/${NAMESPACE}/${KEY}`
    : `https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`;

  fetch(endpoint)
    .then(r => r.json())
    .then(data => {
      if (data && typeof data.value === 'number') {
        sessionStorage.setItem(LS_KEY, '1');
        // Animate the count up
        const target = data.value;
        let current = Math.max(0, target - 40);
        const step  = Math.ceil((target - current) / 30);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          updateDisplays(current);
          if (current >= target) clearInterval(timer);
        }, 40);
      }
    })
    .catch(() => {
      // Graceful fallback — show nothing or cached value
      const cached = localStorage.getItem('sb_visit_cache');
      if (cached) updateDisplays(parseInt(cached, 10));
      else displays.forEach(el => el.closest('.visitor-counter-wrap')?.remove());
    });
})();
