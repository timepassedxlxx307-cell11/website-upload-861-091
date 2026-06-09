(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var current = 0;

      function showSlide(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-slide")) || 0);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }
    }

    var searchInput = document.querySelector("[data-search-input]");

    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";
      searchInput.value = query;

      function normalize(value) {
        return String(value || "").trim().toLowerCase();
      }

      function filterCards() {
        var value = normalize(searchInput.value);
        var cards = document.querySelectorAll("[data-search-card]");

        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-search"));
          card.hidden = value && text.indexOf(value) === -1;
        });
      }

      searchInput.addEventListener("input", filterCards);
      filterCards();
    }

    function setupPlayer(player) {
      var video = player.querySelector("video");
      var cover = player.querySelector(".player-cover");
      var stream = player.getAttribute("data-stream");
      var hlsInstance = null;

      if (!video || !stream || !cover) {
        return;
      }

      function attachStream() {
        if (player.getAttribute("data-ready") === "1") {
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        } else {
          video.src = stream;
        }

        player.setAttribute("data-ready", "1");
      }

      function startPlayback() {
        attachStream();
        cover.classList.add("is-hidden");
        video.controls = true;

        var playTask = video.play();

        if (playTask && typeof playTask.catch === "function") {
          playTask.catch(function () {
            video.controls = true;
          });
        }
      }

      cover.addEventListener("click", startPlayback);

      video.addEventListener("click", function () {
        if (player.getAttribute("data-ready") !== "1") {
          startPlayback();
        }
      });

      window.addEventListener("pagehide", function () {
        if (hlsInstance && typeof hlsInstance.destroy === "function") {
          hlsInstance.destroy();
        }
      });
    }

    document.querySelectorAll(".js-player").forEach(setupPlayer);
  });
})();
