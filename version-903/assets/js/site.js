(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            menuButton.classList.toggle('is-open');
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        var showSlide = function (index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
            });
        });

        window.setInterval(function () {
            showSlide(current + 1);
        }, 5600);
    }

    var filterPanel = document.querySelector('[data-filter-panel]');

    if (filterPanel) {
        var searchInput = filterPanel.querySelector('[data-local-search]');
        var yearSelect = filterPanel.querySelector('[data-year-filter]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var years = [];

        cards.forEach(function (card) {
            var year = card.getAttribute('data-year');

            if (year && years.indexOf(year) === -1) {
                years.push(year);
            }
        });

        years.sort(function (a, b) {
            return String(b).localeCompare(String(a));
        });

        if (yearSelect) {
            years.forEach(function (year) {
                var option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });
        }

        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query && searchInput) {
            searchInput.value = query;
        }

        var applyFilter = function () {
            var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var year = yearSelect ? yearSelect.value : '';

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var cardYear = card.getAttribute('data-year') || '';
                var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchYear = !year || cardYear === year;

                card.classList.toggle('is-hidden', !(matchKeyword && matchYear));
            });
        };

        if (searchInput) {
            searchInput.addEventListener('input', applyFilter);
        }

        if (yearSelect) {
            yearSelect.addEventListener('change', applyFilter);
        }

        applyFilter();
    }

    var player = document.querySelector('[data-player]');

    if (player) {
        var video = player.querySelector('video');
        var overlay = player.querySelector('.player-overlay');
        var source = player.getAttribute('data-source');
        var hlsInstance = null;
        var isReady = false;

        var prepareVideo = function () {
            if (!video || !source || isReady) {
                return;
            }

            isReady = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        };

        var startPlayback = function () {
            prepareVideo();

            if (overlay) {
                overlay.classList.add('is-hidden');
            }

            if (video) {
                var playPromise = video.play();

                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {});
                }
            }
        };

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!isReady || video.paused) {
                    startPlayback();
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();
