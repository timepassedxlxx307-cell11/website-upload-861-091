(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupSearchForms() {
    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        var root = form.getAttribute('data-root') || './';
        var target = root + 'search.html';
        if (query) {
          target += '?q=' + encodeURIComponent(query);
        }
        window.location.href = target;
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
    if (slides.length <= 1) {
      return;
    }

    var current = 0;
    var timer = null;

    function activate(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        activate(current + 1);
      }, 5200);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        activate(index);
        restart();
      });
    });

    start();
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase();
  }

  function setupSearchPage() {
    var page = document.querySelector('[data-page="search"]');
    if (!page) {
      return;
    }

    var input = page.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(page.querySelectorAll('.movie-card'));
    var empty = page.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    function filter() {
      var query = normalize(input.value.trim());
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var matched = !query || haystack.indexOf(query) !== -1;
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.value = initial;
      input.addEventListener('input', filter);
      filter();
    }
  }

  function setupCategoryPage() {
    var page = document.querySelector('[data-page="category"]');
    if (!page) {
      return;
    }

    var input = page.querySelector('[data-category-filter]');
    var grid = page.querySelector('[data-category-grid]');
    var buttons = Array.prototype.slice.call(page.querySelectorAll('[data-sort]'));
    var empty = page.querySelector('[data-empty-state]');
    if (!grid) {
      return;
    }

    function cards() {
      return Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    }

    function applyFilter() {
      var query = input ? normalize(input.value.trim()) : '';
      var visible = 0;
      cards().forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var matched = !query || haystack.indexOf(query) !== -1;
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    function sortCards(mode) {
      var sorted = cards().sort(function (a, b) {
        if (mode === 'views') {
          return Number(b.getAttribute('data-views')) - Number(a.getAttribute('data-views'));
        }
        if (mode === 'year') {
          return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
        }
        return normalize(a.getAttribute('data-title')).localeCompare(normalize(b.getAttribute('data-title')), 'zh-Hans-CN');
      });
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        sortCards(button.getAttribute('data-sort'));
        applyFilter();
      });
    });

    applyFilter();
  }

  ready(function () {
    setupMenu();
    setupSearchForms();
    setupHero();
    setupSearchPage();
    setupCategoryPage();
  });
})();
