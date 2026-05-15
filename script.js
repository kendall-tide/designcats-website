/*
  DesignCats — script.js
*/

(function () {
    'use strict';

    const header   = document.getElementById('site-header');
    const toggle   = document.querySelector('.nav__toggle');
    const navLinks = document.querySelector('.nav__links');

    // ——— Scroll-aware header shadow ———
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ——— Mobile nav toggle ———
    toggle.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav when a link is tapped
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // ——— Close mobile nav on outside click ———
    document.addEventListener('click', function (e) {
        if (
            navLinks.classList.contains('open') &&
            !navLinks.contains(e.target) &&
            !toggle.contains(e.target)
        ) {
            navLinks.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // ——— Smooth scroll for anchor links (offset for fixed nav) ———
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = link.getAttribute('href');
            if (href === '#' || href === '#top') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const navHeight = 72;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    // ——— Subtle fade-in on scroll for key elements ———
    if ('IntersectionObserver' in window) {
        const targets = document.querySelectorAll(
            '.section__heading, .section__intro, .about__text p, .about__stats, ' +
            '.service-card, .review-card, .contact__detail'
        );

        targets.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(16px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        targets.forEach(function (el) {
            observer.observe(el);
        });
    }

})();
