document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('#mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    const carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
        const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
        let activeIndex = 0;

        const setSlide = (index) => {
            activeIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });

            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        };

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                setSlide(Number(dot.dataset.heroDot || '0'));
            });
        });

        if (slides.length > 1) {
            window.setInterval(() => {
                setSlide(activeIndex + 1);
            }, 5800);
        }
    }

    const filterRoot = document.querySelector('[data-card-filter-root]');

    if (filterRoot) {
        const input = filterRoot.querySelector('[data-card-filter-input]');
        const chips = Array.from(filterRoot.querySelectorAll('[data-category-filter]'));
        const list = document.querySelector('[data-card-filter-list]');
        const cards = list ? Array.from(list.querySelectorAll('.movie-card')) : [];
        let activeFilter = '';

        const applyFilter = () => {
            const keyword = (input ? input.value : '').trim().toLowerCase();

            cards.forEach((card) => {
                const text = [
                    card.dataset.title || '',
                    card.dataset.region || '',
                    card.dataset.genre || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                const matchKeyword = !keyword || text.includes(keyword);
                const matchChip = !activeFilter || text.includes(activeFilter.toLowerCase());
                card.style.display = matchKeyword && matchChip ? '' : 'none';
            });
        };

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                activeFilter = chip.dataset.categoryFilter || '';
                chips.forEach((item) => item.classList.remove('is-active'));
                chip.classList.add('is-active');
                applyFilter();
            });
        });
    }
});
