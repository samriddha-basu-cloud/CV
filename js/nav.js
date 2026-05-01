/* ============================================================
   NAV INJECTOR — nav.js
   Injects navigation into every page automatically.
   ============================================================ */

(function injectNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const links = [
    { href: 'index.html#about',      label: 'About',       section: 'about'      },
    { href: 'sections/experience.html', label: 'Experience', section: 'experience' },
    { href: 'sections/skills.html',  label: 'Skills',      section: 'skills'     },
    { href: 'sections/projects.html',label: 'Projects',    section: 'projects'   },
    { href: 'sections/contact.html', label: 'Contact',     section: 'contact'    },
  ];

  // Resolve relative paths based on current page depth
  const inSubdir = currentPage !== 'index.html' && window.location.pathname.includes('/sections/');
  const base = inSubdir ? '../' : '';

  const navHTML = `
    <nav class="nav" id="main-nav">
      <div class="nav-inner">
        <a href="${base}index.html" class="nav-logo">
          <span class="nav-logo-bracket">[</span>SB<span class="nav-logo-bracket">]</span>
        </a>
        <ul class="nav-links">
          ${links.map(l => `<li><a href="${base}${l.href}" data-section="${l.section}">${l.label}</a></li>`).join('')}
        </ul>
        <a href="${base}sections/contact.html" class="nav-cta">Hire Me →</a>
        <button class="nav-hamburger" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="nav-mobile">
      ${links.map(l => `<a href="${base}${l.href}">${l.label}</a>`).join('')}
      <a href="${base}sections/contact.html" style="color: var(--color-accent); border-bottom: none;">→ Hire Me</a>
    </div>
    <div class="noise-overlay"></div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = navHTML;
  document.body.insertBefore(wrapper, document.body.firstChild);
})();
