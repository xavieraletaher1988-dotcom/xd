document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);

    const point = window.scrollY + 120;
    let activeId = '';
    sections.forEach(section => {
      if (point >= section.offsetTop && point < section.offsetTop + section.offsetHeight) {
        activeId = section.id;
      }
    });
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', isActive);
    });
  };

  navToggle?.addEventListener('click', () => nav.classList.toggle('open'));
  navLinks.forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    button.textContent = 'Mensaje enviado';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = 'Enviar mensaje';
      button.disabled = false;
      form.reset();
    }, 2500);
  });
});
