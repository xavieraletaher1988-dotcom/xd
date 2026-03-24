// BERA HASS — Enhanced JavaScript 2026
document.addEventListener('DOMContentLoaded', () => {

  // ── Preloader ──────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => preloader.classList.add('hidden');
  window.addEventListener('load', () => setTimeout(hidePreloader, 1800));
  setTimeout(hidePreloader, 3500);

  // ── Navbar scroll ──────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const handleScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile nav ─────────────────────────────────────────
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
    });
  });

  // ── Smooth scroll ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Floating particles in hero ─────────────────────────
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    const colors = ['rgba(200,169,81,.12)', 'rgba(74,140,63,.1)', 'rgba(255,255,255,.05)'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 60 + 20;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 15 + 12}s;
        animation-delay: ${Math.random() * -15}s;
        filter: blur(${Math.random() * 4 + 2}px);
      `;
      particlesContainer.appendChild(p);
    }
  }

  // ── Scroll reveal ──────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.section-tag, .about-grid, .products-grid, .benefits-layout, ' +
    '.process-steps, .cta-content, .contact-layout, ' +
    '.ben-card, .prod-card, .p-step, .stat-item, .col-img-wrap'
  );
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s ease ${(i % 6) * 0.08}s, transform 0.7s ease ${(i % 6) * 0.08}s`;
    revealObs.observe(el);
  });

  // ── Contact form ───────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.innerHTML = '<span>✅ ¡Mensaje Enviado!</span>';
      btn.style.background = '#2d5a27';
      btn.style.color = '#fff';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '<span>Enviar Mensaje</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  }

  // ── Active nav highlight ───────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) item.classList.add('active');
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ── Parallax hero bg ───────────────────────────────────
  window.addEventListener('scroll', () => {
    const heroImg = document.querySelector('.hero-bg-img');
    if (heroImg && window.scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.25}px)`;
    }
  }, { passive: true });

  // ── Product card tilt effect ───────────────────────────
  document.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-10px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
