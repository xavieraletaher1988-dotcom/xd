// BERA HASS — JavaScript 2026
document.addEventListener('DOMContentLoaded', () => {

    // ── Preloader ──────────────────────────────────────
    const preloader = document.getElementById('preloader');
    const hidePreloader = () => {
        preloader.classList.add('hidden');
        // Trigger hero animations after preloader
        document.querySelectorAll('.hero-text h1, .hero-subtitle, .hero-buttons').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.2 + i * 0.15}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.2 + i * 0.15}s`;
            requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        });
    };
    window.addEventListener('load', () => setTimeout(hidePreloader, 800));
    setTimeout(hidePreloader, 2000);

    // ── Navbar scroll ──────────────────────────────────
    const navbar = document.getElementById('navbar');
    const handleScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ── Mobile nav ─────────────────────────────────────
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

    // ── Smooth scroll ──────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ── Scroll reveal ──────────────────────────────────
    const revealEls = document.querySelectorAll(
        '.section-tag, .about-grid, .products-grid, .benefits-layout, ' +
        '.process-steps, .process-visual, .cta-content, .contact-layout, ' +
        '.ben-card, .prod-card, .p-step, .stat-item, .nutri-grid, ' +
        '.section-header, .about-float, .about-img-secondary, .benefits-image, ' +
        '.ben-card-v2, .about-hl, .gallery-feat, .about-mosaic, .about-story'
    );
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(32px)';
        el.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${(i % 6) * 0.1}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${(i % 6) * 0.1}s`;
        revealObs.observe(el);
    });

    // ── Counter animation ──────────────────────────────
    const counters = document.querySelectorAll('.counter-num');
    if (counters.length) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent.trim();
                    const match = text.match(/^([\d.]+)(.*)$/);
                    if (match) {
                        const target = parseFloat(match[1]);
                        const suffix = match[2] || '';
                        const isDecimal = match[1].includes('.');
                        const duration = 2000;
                        const start = performance.now();
                        const animate = (now) => {
                            const progress = Math.min((now - start) / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const current = isDecimal
                                ? (target * eased).toFixed(1)
                                : Math.floor(target * eased);
                            el.textContent = current + suffix;
                            if (progress < 1) requestAnimationFrame(animate);
                        };
                        requestAnimationFrame(animate);
                    }
                    counterObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => counterObs.observe(c));
    }

    // ── Contact form ───────────────────────────────────
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const data = new FormData(form);
            btn.innerHTML = '<span>Enviando...</span>';
            btn.disabled = true;

            fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(res => {
                if (res.ok) {
                    btn.innerHTML = '<span>&#10004; ¡Mensaje Enviado!</span>';
                    btn.style.background = 'var(--green)';
                    btn.style.color = '#fff';
                    form.reset();
                } else {
                    btn.innerHTML = '<span>&#10008; Error, intenta de nuevo</span>';
                    btn.style.background = '#c0392b';
                    btn.style.color = '#fff';
                }
            }).catch(() => {
                btn.innerHTML = '<span>&#10008; Error de conexión</span>';
                btn.style.background = '#c0392b';
                btn.style.color = '#fff';
            }).finally(() => {
                setTimeout(() => {
                    btn.innerHTML = '<span>Enviar Mensaje</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 4000);
            });
        });
    }

    // ── Active nav highlight ───────────────────────────
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

    // ── Parallax on scroll ────────────────────────────
    const heroBg = document.querySelector('.hero-bg');
    const parallaxEls = document.querySelectorAll('.about-panorama-img, .process-bg-img');
    if (heroBg || parallaxEls.length) {
        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            if (heroBg) heroBg.style.transform = `translateY(${sy * 0.3}px)`;
            parallaxEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (rect.top - window.innerHeight / 2) * 0.08;
                    el.style.transform = `translateY(${offset}px) scale(0.85)`;
                }
            });
        }, { passive: true });
    }

    // ── Product card hover effect ──────────────────────
    document.querySelectorAll('.prod-card').forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-10px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = '';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
    });

    // ── Smooth section bg tint on scroll ───────────────
    const tintSections = document.querySelectorAll('.section-tag');
    if (tintSections.length) {
        window.addEventListener('scroll', () => {
            tintSections.forEach(tag => {
                const rect = tag.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const progress = 1 - (rect.top / window.innerHeight);
                    tag.style.opacity = Math.min(1, progress * 1.5);
                }
            });
        }, { passive: true });
    }

    // ── Magnetic hover on CTA buttons ──────────────────
    document.querySelectorAll('.btn-gold, .btn-prod-gold').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translateY(-3px) translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

});
