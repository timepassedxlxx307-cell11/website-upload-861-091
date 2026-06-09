(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var sliders = document.querySelectorAll('[data-hero-slider]');
  sliders.forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      if (slides.length > 1) {
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(index);
        start();
      });
    });

    show(0);
    start();
  });

  var heroForms = document.querySelectorAll('[data-hero-search]');
  heroForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var keyword = input ? input.value.trim() : '';
      var target = form.getAttribute('data-target') || 'search.html';
      if (keyword) {
        window.location.href = target + '?q=' + encodeURIComponent(keyword);
      } else {
        window.location.href = target;
      }
    });
  });

  var searchPanel = document.querySelector('[data-filter-panel]');
  if (searchPanel) {
    var input = searchPanel.querySelector('[data-filter-keyword]');
    var category = searchPanel.querySelector('[data-filter-category]');
    var year = searchPanel.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var empty = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var initialKeyword = params.get('q');

    if (initialKeyword && input) {
      input.value = initialKeyword;
    }

    function normalize(value) {
      return String(value || '').toLowerCase();
    }

    function applyFilter() {
      var keyword = normalize(input && input.value);
      var selectedCategory = category ? category.value : '';
      var selectedYear = year ? year.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-category')
        ].join(' ');
        var okKeyword = !keyword || normalize(text).indexOf(keyword) >= 0;
        var okCategory = !selectedCategory || card.getAttribute('data-category') === selectedCategory;
        var okYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
        var ok = okKeyword && okCategory && okYear;
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    ['input', 'change'].forEach(function (eventName) {
      if (input) {
        input.addEventListener(eventName, applyFilter);
      }
      if (category) {
        category.addEventListener(eventName, applyFilter);
      }
      if (year) {
        year.addEventListener(eventName, applyFilter);
      }
    });

    applyFilter();
  }
})();
