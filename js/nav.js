/* ============================================================
   NAV INJECTOR — nav.js
   Auto-injects navigation into every page.
   ============================================================ */

(function injectNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const inSubdir = window.location.pathname.includes('/sections/');
  const base = inSubdir ? '../' : '';

  const links = [
    { href: 'index.html#about',          label: 'About',      section: 'about'      },
    { href: 'sections/experience.html',  label: 'Experience', section: 'experience' },
    { href: 'sections/skills.html',      label: 'Skills',     section: 'skills'     },
    { href: 'sections/projects.html',    label: 'Projects',   section: 'projects'   },
    { href: 'sections/blogs.html',       label: 'Blogs',      section: 'blogs'      },
    { href: 'sections/contact.html',     label: 'Contact',    section: 'contact'    },
  ];

  const navHTML = `
    <nav class="nav" id="main-nav">
      <div class="nav-inner">
        <a href="${base}index.html" class="nav-logo">
          <span class="nav-logo-bracket">[</span>SB<span class="nav-logo-bracket">]</span>
        </a>
        <ul class="nav-links">
          ${links.map(l => `<li><a href="${base}${l.href}" data-section="${l.section}">${l.label}</a></li>`).join('')}
        </ul>
        <a href="${base}sections/contact.html" class="nav-cta">Work With Me →</a>
        <button class="nav-hamburger" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="nav-mobile">
      ${links.map(l => `<a href="${base}${l.href}">${l.label}</a>`).join('')}
      <a href="${base}sections/contact.html" style="color:var(--color-accent);border-bottom:none;">→ Work With Me</a>
    </div>
    <div class="noise-overlay"></div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = navHTML;
  document.body.insertBefore(wrapper, document.body.firstChild);

  // Nav scroll behavior
  setTimeout(() => {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.nav-mobile');
    if (nav) {
      window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 24), { passive: true });
    }
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
      });
      mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }));
    }
    // Active link
    const sections = document.querySelectorAll('[data-section]');
    const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href')?.includes(e.target.dataset.section)));
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });
    sections.forEach(s => obs.observe(s));
  }, 0);
})();
