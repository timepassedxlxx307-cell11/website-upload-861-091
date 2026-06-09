(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var shell = document.querySelector('[data-player]');
    if (!shell) {
      return;
    }
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('[data-player-overlay]');
    var toggle = shell.querySelector('[data-player-toggle]');
    var mute = shell.querySelector('[data-player-mute]');
    var fullscreen = shell.querySelector('[data-player-fullscreen]');
    var stream = shell.getAttribute('data-stream');
    var loaded = false;
    var hls = null;

    function prepare() {
      if (loaded || !video || !stream) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function play() {
      prepare();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function pause() {
      video.pause();
    }

    function refresh() {
      if (!toggle) {
        return;
      }
      toggle.textContent = video.paused ? '播放' : '暂停';
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }
    if (toggle) {
      toggle.addEventListener('click', function () {
        if (video.paused) {
          play();
        } else {
          pause();
        }
      });
    }
    if (mute) {
      mute.addEventListener('click', function () {
        video.muted = !video.muted;
        mute.textContent = video.muted ? '有声' : '静音';
      });
    }
    if (fullscreen) {
      fullscreen.addEventListener('click', function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (shell.requestFullscreen) {
          shell.requestFullscreen();
        }
      });
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        pause();
      }
    });
    video.addEventListener('play', refresh);
    video.addEventListener('pause', refresh);
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
    refresh();
  });
})();
