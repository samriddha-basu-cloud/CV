/* ============================================================
   NAV INJECTOR — nav.js
   GitHub Pages compatible — all links use .html extensions.
   Self-contained: no dependency on utils.js.
   ============================================================ */
(function () {
  'use strict';

  var path       = window.location.pathname;
  var inSections = path.indexOf('/sections/') !== -1;
  var inBlogs    = path.indexOf('/blogs/')    !== -1;
  var base       = (inSections || inBlogs) ? '../' : '';

  var links = [
    { href: 'index.html#about',            label: 'About',      section: 'about'      },
    { href: 'sections/experience.html',    label: 'Experience', section: 'experience' },
    { href: 'sections/skills.html',        label: 'Skills',     section: 'skills'     },
    { href: 'sections/projects.html',      label: 'Projects',   section: 'projects'   },
    { href: 'sections/blogs.html',         label: 'Insights',   section: 'blogs'      },
    { href: 'sections/contact.html',       label: 'Contact',    section: 'contact'    },
  ];

  var navHTML =
    '<nav class="nav" id="main-nav">' +
      '<div class="nav-inner">' +
        '<a href="' + base + 'index.html" class="nav-logo">' +
          '<span class="nav-logo-bracket">[</span>SB<span class="nav-logo-bracket">]</span>' +
        '</a>' +
        '<ul class="nav-links">' +
          links.map(function(l) {
            return '<li><a href="' + base + l.href + '" data-section="' + l.section + '">' + l.label + '</a></li>';
          }).join('') +
        '</ul>' +
        '<a href="' + base + 'sections/contact.html" class="nav-cta">Work With Me \u2192</a>' +
        '<button class="nav-hamburger" id="hamburger-btn" aria-label="Open navigation" aria-expanded="false">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
    '</nav>' +
    '<div class="nav-mobile" id="nav-mobile">' +
      links.map(function(l) {
        return '<a href="' + base + l.href + '">' + l.label + '</a>';
      }).join('') +
      '<a href="' + base + 'sections/contact.html" style="color:var(--color-accent);">\u2192 Work With Me</a>' +
    '</div>' +
    '<div class="noise-overlay"></div>';

  var wrapper = document.createElement('div');
  wrapper.innerHTML = navHTML;

  function insertAndInit() {
    document.body.insertBefore(wrapper, document.body.firstChild);
    init();
  }

  if (document.body) {
    insertAndInit();
  } else {
    document.addEventListener('DOMContentLoaded', insertAndInit);
  }

  function init() {
    var nav  = document.getElementById('main-nav');
    var btn  = document.getElementById('hamburger-btn');
    var menu = document.getElementById('nav-mobile');

    /* Scroll */
    if (nav) {
      function onScroll() {
        nav.classList[window.scrollY > 24 ? 'add' : 'remove']('scrolled');
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* Hamburger */
    if (btn && menu) {
      function openMenu() {
        menu.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Close navigation');
        document.body.style.overflow = 'hidden';
      }
      function closeMenu() {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open navigation');
        document.body.style.overflow = '';
      }

      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.contains('open') ? closeMenu() : openMenu();
      });

      var mLinks = menu.querySelectorAll('a');
      for (var i = 0; i < mLinks.length; i++) {
        mLinks[i].addEventListener('click', closeMenu);
      }

      document.addEventListener('click', function(e) {
        if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) {
          closeMenu();
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
      });
    }

    /* Active link on scroll */
    var sections = document.querySelectorAll('[data-section]');
    var navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
    if (sections.length && navLinks.length) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var sec = entry.target.dataset.section;
            navLinks.forEach(function(a) {
              var href = a.getAttribute('href') || '';
              a.classList[href.indexOf(sec) !== -1 ? 'add' : 'remove']('active');
            });
          }
        });
      }, { rootMargin: '-40% 0px -40% 0px' });
      sections.forEach(function(s) { obs.observe(s); });
    }
  }
})();
