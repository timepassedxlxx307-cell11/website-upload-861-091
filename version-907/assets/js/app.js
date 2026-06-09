(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('open');
      button.textContent = menu.classList.contains('open') ? '×' : '☰';
    });
  }

  function setupSearchForms() {
    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        window.location.href = './search.html?q=' + encodeURIComponent(input.value.trim());
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5600);
  }

  function setupListingFilters() {
    var grid = document.querySelector('[data-listing-grid]');
    if (!grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var filter = document.querySelector('[data-local-filter]');
    var sort = document.querySelector('[data-sort-select]');
    var empty = document.querySelector('[data-empty-state]');
    var url = new URL(window.location.href);
    var query = url.searchParams.get('q') || '';
    var heroInput = document.querySelector('[data-search-input]');
    if (heroInput) {
      heroInput.value = query;
    }
    if (filter && query) {
      filter.value = query;
    }

    function apply() {
      var q = normalize(filter ? filter.value : '');
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var ok = !q || text.indexOf(q) !== -1;
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    function sortCards(mode) {
      var sorted = cards.slice();
      if (mode === 'year') {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        });
      }
      if (mode === 'score') {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute('data-score')) - Number(a.getAttribute('data-score'));
        });
      }
      if (mode === 'heat') {
        sorted.sort(function (a, b) {
          return Number(b.getAttribute('data-heat')) - Number(a.getAttribute('data-heat'));
        });
      }
      if (mode === 'default') {
        sorted.sort(function (a, b) {
          return Number(a.getAttribute('data-heat')) - Number(b.getAttribute('data-heat'));
        });
      }
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
      apply();
    }

    if (filter) {
      filter.addEventListener('input', apply);
    }
    if (sort) {
      sort.addEventListener('change', function () {
        sortCards(sort.value);
      });
    }
    apply();
  }

  ready(function () {
    setupMobileMenu();
    setupSearchForms();
    setupHero();
    setupListingFilters();
  });
})();
