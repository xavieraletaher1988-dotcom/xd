// BERA HASS - JavaScript
document.addEventListener('DOMContentLoaded', () => {

    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 1800);
    });
    setTimeout(() => preloader.classList.add('hidden'), 3000);

    // Navbar scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile nav
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

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Scroll reveal
    const revealElements = document.querySelectorAll('.section-tag, .about-grid, .products-grid, .benefits-layout, .process-steps, .nutri-grid, .cta-content, .contact-layout, .ben-card, .prod-card, .p-step, .stat-item');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${i % 4 * 0.1}s`;
        revealObserver.observe(el);
    });

    // Contact form
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.innerHTML = '<span>Enviado</span>';
            btn.style.background = '#2d5a27';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.innerHTML = '<span>Enviar Mensaje</span>';
                btn.style.background = '';
                btn.style.color = '';
                form.reset();
            }, 3000);
        });
    }

    // Parallax on hero
    window.addEventListener('scroll', () => {
        const heroImg = document.querySelector('.hero-bg-img');
        if (heroImg && window.scrollY < window.innerHeight) {
            heroImg.style.transform = `scale(1.1) translateY(${window.scrollY * 0.3}px)`;
        }
    });
});
