/*
 * Finder (demo clone) - front-end behaviour
 * Works on both index.html (Arabic / RTL) and index-en.html (English / LTR).
 * Direction comes from <html dir>, theme from <html data-bs-theme>.
 */
(function () {
    'use strict';

    const root = document.documentElement;
    const isRTL = () => (root.getAttribute('dir') || 'ltr').toLowerCase() === 'rtl';

    // localStorage can throw (private mode, blocked cookies) - never let it break the page
    const storage = {
        get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
        set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
        }
    };

    /* ------------------------------------------------------------------ */
    /* Tooltips                                                            */
    /* ------------------------------------------------------------------ */
    function initializeTooltips() {
        if (typeof bootstrap === 'undefined') return;
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
            new bootstrap.Tooltip(el);
        });
    }

    /* ------------------------------------------------------------------ */
    /* Swiper carousels (direction is auto-detected from the page's dir)   */
    /* ------------------------------------------------------------------ */
    function initializeSwipers() {
        if (typeof Swiper === 'undefined') return;

        const configs = [
            {
                selector: '.mySwiper-3', slidesPerView: 2, spaceBetween: 20,
                breakpoints: { 768: { slidesPerView: 3, spaceBetween: 20 } }
            },
            {
                selector: '.mySwiper-4', slidesPerView: 2, spaceBetween: 20, loop: true,
                breakpoints: {
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 30 }
                }
            },
            {
                selector: '.mySwiper-7', slidesPerView: 2, spaceBetween: 20, loop: true,
                breakpoints: {
                    768: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 30 }
                }
            },
            {
                selector: '.mySwiper-8', slidesPerView: 1, spaceBetween: 10,
                breakpoints: {
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    768: { slidesPerView: 3, spaceBetween: 30 },
                    1024: { slidesPerView: 5, spaceBetween: 40 }
                }
            },
            {
                selector: '.mySwiper-10', slidesPerView: 1, spaceBetween: 20,
                breakpoints: {
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 30 }
                }
            }
        ];

        configs.forEach(function (config) {
            const el = document.querySelector(config.selector);
            if (!el) return;
            new Swiper(el, {
                slidesPerView: config.slidesPerView,
                spaceBetween: config.spaceBetween,
                loop: config.loop || false,
                breakpoints: config.breakpoints,
                // scoped to this swiper so carousels never share one pagination element
                pagination: { el: el.querySelector('.swiper-pagination'), clickable: true }
            });
        });
    }

    /* ------------------------------------------------------------------ */
    /* Location search (filters ONLY the location dropdown)                */
    /* ------------------------------------------------------------------ */
    function initializeLocationSearch() {
        const input = document.getElementById('locationSearch');
        if (!input) return;
        const menu = input.closest('.dropdown-menu');
        if (!menu) return;

        input.addEventListener('input', function () {
            const query = input.value.trim().toLowerCase();
            menu.querySelectorAll('.dropdown-item').forEach(function (item) {
                const match = item.textContent.toLowerCase().includes(query);
                item.parentElement.style.display = match ? '' : 'none';
            });
        });
    }

    /* ------------------------------------------------------------------ */
    /* Price range slider (LTR + RTL)                                      */
    /* ------------------------------------------------------------------ */
    function initializeRangeSlider() {
        const slider = document.getElementById('customRange3');
        const label = document.getElementById('rangeValue');
        if (!slider || !label) return;

        const THUMB_PX = 11.2; // 0.7rem thumb defined in style.css

        function update() {
            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            const value = parseFloat(slider.value);
            const ratio = (value - min) / (max - min);
            const rtl = isRTL();

            // In RTL the browser puts the minimum on the right, so the filled part grows from the right
            slider.style.setProperty('--track-dir', rtl ? 'to left' : 'to right');
            slider.style.setProperty('--track-color-percentage', (ratio * 100) + '%');

            // Keep the value bubble centred on the thumb (logical property: works in both directions)
            const travel = Math.max(slider.offsetWidth - THUMB_PX, 0);
            label.style.insetInlineStart = (ratio * travel + THUMB_PX / 2) + 'px';
            label.textContent = '$' + value;
        }

        slider.addEventListener('input', update);
        window.addEventListener('resize', update);
        window.addEventListener('load', update); // widths can change once fonts/images load
        update();
    }

    /* ------------------------------------------------------------------ */
    /* Theme: light | dark | auto  (saved in localStorage)                 */
    /* ------------------------------------------------------------------ */
    function initializeThemeManager() {
        const VALID = ['light', 'dark', 'auto'];
        const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
        const items = document.querySelectorAll('.dropdown-item[data-theme]');

        let choice = storage.get('theme');
        if (VALID.indexOf(choice) === -1) choice = 'light';

        function resolve(c) {
            if (c === 'auto') return mq && mq.matches ? 'dark' : 'light';
            return c;
        }

        function apply(c) {
            root.setAttribute('data-bs-theme', resolve(c));
            items.forEach(function (item) {
                const active = item.getAttribute('data-theme') === c;
                item.classList.toggle('active', active);
                if (active) item.setAttribute('aria-current', 'true');
                else item.removeAttribute('aria-current');
            });
        }

        items.forEach(function (item) {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                const next = item.getAttribute('data-theme');
                if (VALID.indexOf(next) === -1) return;
                choice = next;
                storage.set('theme', choice);
                apply(choice);
            });
        });

        // Follow the OS setting live while "auto" is selected
        if (mq) {
            const onChange = function () { if (choice === 'auto') apply(choice); };
            if (mq.addEventListener) mq.addEventListener('change', onChange);
            else if (mq.addListener) mq.addListener(onChange);
        }

        apply(choice);
    }

    /* ------------------------------------------------------------------ */
    /* Scroll progress bar                                                 */
    /* ------------------------------------------------------------------ */
    function initializeScrollProgress() {
        const bar = document.querySelector('.scroll-indicator .progress-bar');
        if (!bar) return;

        function update() {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
        }

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    /* ------------------------------------------------------------------ */
    function initializeAll() {
        initializeTooltips();
        initializeSwipers();
        initializeLocationSearch();
        initializeRangeSlider();
        initializeThemeManager();
        initializeScrollProgress();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        initializeAll();
    }
})();
