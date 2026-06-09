(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var source = video ? video.getAttribute('data-video') : '';
    var centerButton = shell.querySelector('[data-player-center]');
    var playButton = shell.querySelector('[data-action="toggle-play"]');
    var muteButton = shell.querySelector('[data-action="toggle-muted"]');
    var fullButton = shell.querySelector('[data-action="fullscreen"]');
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    }

    function sync() {
      shell.classList.toggle('is-playing', !video.paused);
      if (playButton) {
        playButton.textContent = video.paused ? '播放' : '暂停';
      }
      if (muteButton) {
        muteButton.textContent = video.muted ? '取消静音' : '静音';
      }
    }

    function togglePlay() {
      if (video.paused) {
        var result = video.play();
        if (result && typeof result.catch === 'function') {
          result.catch(function () {
            sync();
          });
        }
      } else {
        video.pause();
      }
      sync();
    }

    function toggleMuted() {
      video.muted = !video.muted;
      sync();
    }

    function fullscreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (shell.requestFullscreen) {
        shell.requestFullscreen();
      }
    }

    video.addEventListener('click', togglePlay);
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('volumechange', sync);

    if (centerButton) {
      centerButton.addEventListener('click', togglePlay);
    }
    if (playButton) {
      playButton.addEventListener('click', togglePlay);
    }
    if (muteButton) {
      muteButton.addEventListener('click', toggleMuted);
    }
    if (fullButton) {
      fullButton.addEventListener('click', fullscreen);
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });

    sync();
  }

  ready(function () {
    document.querySelectorAll('[data-player]').forEach(setupPlayer);
  });
})();
