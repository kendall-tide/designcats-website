/*
  DesignCats — script.js
*/

(function () {
    'use strict';

    var header   = document.getElementById('site-header');
    var toggle   = document.querySelector('.nav__toggle');
    var navLinks = document.querySelector('.nav__links');

    // Scroll-aware header border
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile nav toggle
    toggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav on link tap
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close mobile nav on outside click
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

    // Smooth scroll with fixed-nav offset
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (href === '#' || href === '#top') return;
            var target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
            var top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    // Gallery carousel: arrow buttons plus gentle auto-scroll
    var track = document.querySelector('.gallery__track');
    if (track) {
        var prev = document.querySelector('.gallery__btn--prev');
        var next = document.querySelector('.gallery__btn--next');

        function slideWidth() {
            var slide = track.querySelector('.gallery__slide');
            return slide ? slide.getBoundingClientRect().width + 16 : track.clientWidth;
        }

        function step(dir) {
            var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
            if (dir > 0 && atEnd) {
                track.scrollTo({ left: 0 });
            } else {
                track.scrollBy({ left: dir * slideWidth() });
            }
        }

        prev.addEventListener('click', function () { step(-1); });
        next.addEventListener('click', function () { step(1); });

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var paused = false;
        var carousel = track.parentNode;
        ['mouseenter', 'touchstart', 'focusin'].forEach(function (ev) {
            carousel.addEventListener(ev, function () { paused = true; }, { passive: true });
        });
        ['mouseleave', 'focusout'].forEach(function (ev) {
            carousel.addEventListener(ev, function () { paused = false; });
        });

        if (!reduceMotion) {
            setInterval(function () {
                if (!paused && !document.hidden) step(1);
            }, 4000);
        }
    }

})();
