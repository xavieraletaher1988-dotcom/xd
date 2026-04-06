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

    // ── Offer Banner Countdown ──────────────────────────
    const offerBanner = document.getElementById('offerBanner');
    const offerClose = document.getElementById('offerClose');
    if (offerBanner) {
        // Set countdown to end of today
        const setCountdown = () => {
            const now = new Date();
            const end = new Date(now);
            end.setHours(23, 59, 59, 0);
            const diff = end - now;
            if (diff <= 0) return;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            const hEl = document.getElementById('cd-hours');
            const mEl = document.getElementById('cd-mins');
            const sEl = document.getElementById('cd-secs');
            if (hEl) hEl.textContent = String(h).padStart(2, '0');
            if (mEl) mEl.textContent = String(m).padStart(2, '0');
            if (sEl) sEl.textContent = String(s).padStart(2, '0');
        };
        setCountdown();
        setInterval(setCountdown, 1000);
        navbar.classList.add('banner-active');
        offerClose.addEventListener('click', () => {
            offerBanner.classList.add('hidden');
            navbar.classList.remove('banner-active');
        });
    }

    // ── Testimonials Carousel ─────────────────────────
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    if (track && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        // Create dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        const goToSlide = (n) => {
            currentSlide = n;
            track.style.transform = `translateX(-${n * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === n));
        };
        // Auto-advance every 5s
        setInterval(() => {
            goToSlide((currentSlide + 1) % cards.length);
        }, 5000);
    }

    // ── Social Proof Popup ────────────────────────────
    const socialProof = document.getElementById('socialProof');
    const spClose = document.getElementById('spClose');
    if (socialProof) {
        const spData = [
            { name: 'María de Bogotá', product: 'compró Aceite Extra Virgen', time: 'hace 3 minutos' },
            { name: 'Carlos de Medellín', product: 'compró Galón de 5L', time: 'hace 7 minutos' },
            { name: 'Ana de Cali', product: 'compró Aceite Refinado', time: 'hace 12 minutos' },
            { name: 'Pedro de Barranquilla', product: 'compró Aceite Extra Virgen', time: 'hace 18 minutos' },
            { name: 'Laura de Cartagena', product: 'compró Aceite Refinado x2', time: 'hace 25 minutos' },
        ];
        let spIndex = 0;
        let spDismissed = false;
        const showSP = () => {
            if (spDismissed) return;
            const d = spData[spIndex % spData.length];
            document.getElementById('spName').textContent = d.name;
            document.getElementById('spProduct').textContent = d.product;
            document.getElementById('spTime').textContent = d.time;
            socialProof.classList.add('show');
            setTimeout(() => {
                socialProof.classList.remove('show');
                spIndex++;
            }, 4000);
        };
        // First popup after 8s, then every 30s
        setTimeout(showSP, 8000);
        setInterval(showSP, 30000);
        spClose.addEventListener('click', () => {
            socialProof.classList.remove('show');
            spDismissed = true;
        });
    }

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
