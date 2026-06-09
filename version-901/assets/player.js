(function () {
  function playVideo(shell) {
    var video = shell.querySelector('video');
    var url = video ? video.getAttribute('data-hls') : '';
    if (!video || !url) {
      return;
    }

    shell.classList.add('is-playing');

    if (video.getAttribute('data-ready') !== '1') {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        video._hlsInstance = hls;
      } else {
        video.src = url;
      }
      video.setAttribute('data-ready', '1');
    }

    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {
        video.setAttribute('controls', 'controls');
      });
    }
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-play-trigger]');
    if (!trigger) {
      return;
    }
    var shell = trigger.closest('.video-shell');
    if (shell) {
      playVideo(shell);
    }
  });

  document.querySelectorAll('.video-shell video').forEach(function (video) {
    video.addEventListener('click', function () {
      var shell = video.closest('.video-shell');
      if (shell && video.paused) {
        playVideo(shell);
      }
    });
  });
})();
