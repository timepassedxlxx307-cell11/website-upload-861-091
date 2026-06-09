(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[type="search"]');
            var query = input ? input.value.trim() : '';
            var base = form.getAttribute('data-base') || './';
            if (query) {
                window.location.href = base + 'search.html?q=' + encodeURIComponent(query);
            }
        });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === activeIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        showSlide(0);
        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    var filterRoot = document.querySelector('[data-filter-root]');
    if (filterRoot) {
        var keywordInput = filterRoot.querySelector('[data-filter-keyword]');
        var categorySelect = filterRoot.querySelector('[data-filter-category]');
        var yearSelect = filterRoot.querySelector('[data-filter-year]');
        var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-movie-card]'));
        var empty = filterRoot.querySelector('[data-empty-state]');

        function normalize(value) {
            return (value || '').toString().toLowerCase();
        }

        function applyFilter() {
            var keyword = normalize(keywordInput && keywordInput.value).trim();
            var category = categorySelect ? categorySelect.value : '';
            var year = yearSelect ? yearSelect.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region'));
                var cardCategory = card.getAttribute('data-category') || '';
                var cardYear = card.getAttribute('data-year') || '';
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (category && cardCategory !== category) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }

                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        }

        [keywordInput, categorySelect, yearSelect].forEach(function (field) {
            if (field) {
                field.addEventListener('input', applyFilter);
                field.addEventListener('change', applyFilter);
            }
        });

        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && keywordInput) {
            keywordInput.value = q;
        }
        applyFilter();
    }
})();
