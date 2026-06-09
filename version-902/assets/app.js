(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function text(value) {
    return (value || "").toString().toLowerCase();
  }

  function initNavigation() {
    var button = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".mobile-nav");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      var open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      button.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initBackTop() {
    var button = document.querySelector(".back-top");
    if (!button) {
      return;
    }
    window.addEventListener("scroll", function () {
      button.classList.toggle("show", window.scrollY > 420);
    });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }
    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });
    show(0);
    start();
  }

  function initMovieSearch() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-movie-search]"));
    panels.forEach(function (panel) {
      var scopeSelector = panel.getAttribute("data-scope");
      var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
      if (!scope) {
        return;
      }
      var input = panel.querySelector("[data-search-input]");
      var category = panel.querySelector("[data-filter-category]");
      var year = panel.querySelector("[data-filter-year]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
      function apply() {
        var keyword = text(input && input.value);
        var cat = category ? category.value : "";
        var yr = year ? year.value : "";
        cards.forEach(function (card) {
          var haystack = text([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags")
          ].join(" "));
          var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchCategory = !cat || card.getAttribute("data-category") === cat;
          var matchYear = !yr || card.getAttribute("data-year") === yr;
          card.style.display = matchKeyword && matchCategory && matchYear ? "" : "none";
        });
      }
      if (input) {
        input.addEventListener("input", apply);
      }
      if (category) {
        category.addEventListener("change", apply);
      }
      if (year) {
        year.addEventListener("change", apply);
      }
      apply();
    });
  }

  window.initMoviePlayer = function (videoId, sourceUrl) {
    var video = document.getElementById(videoId);
    if (!video) {
      return;
    }
    var box = video.closest(".player-box");
    var button = box ? box.querySelector(".play-trigger") : null;
    var mask = box ? box.querySelector(".player-mask") : null;
    var loaded = false;
    var instance = null;
    function load() {
      if (loaded) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        instance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        instance.loadSource(sourceUrl);
        instance.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
      loaded = true;
    }
    function play() {
      load();
      if (box) {
        box.classList.add("is-playing");
      }
      video.controls = true;
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {});
      }
    }
    if (button) {
      button.addEventListener("click", play);
    }
    if (mask) {
      mask.addEventListener("click", function (event) {
        if (event.target === mask) {
          play();
        }
      });
    }
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        play();
      }
    });
    video.addEventListener("play", function () {
      if (box) {
        box.classList.add("is-playing");
      }
    });
    video.addEventListener("ended", function () {
      if (instance && typeof instance.stopLoad === "function") {
        instance.stopLoad();
      }
    });
  };

  ready(function () {
    initNavigation();
    initBackTop();
    initHero();
    initMovieSearch();
  });
})();
