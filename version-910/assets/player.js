import { H as Hls } from './hls-dru42stk.js';

export function setupPlayer(videoId, sourceUrl, playButtonId, coverId) {
    const video = document.getElementById(videoId);
    const playButton = document.getElementById(playButtonId);
    const cover = document.getElementById(coverId);

    if (!video || !sourceUrl) {
        return;
    }

    let attached = false;
    let hlsInstance = null;

    const attachSource = () => {
        if (attached) {
            return;
        }

        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
            return;
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
            return;
        }

        video.src = sourceUrl;
    };

    const startPlayback = () => {
        attachSource();

        if (cover) {
            cover.classList.add('is-hidden');
        }

        const attempt = video.play();

        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(() => {
                if (cover) {
                    cover.classList.remove('is-hidden');
                }
            });
        }
    };

    if (cover) {
        cover.addEventListener('click', startPlayback);
    }

    if (playButton && playButton !== cover) {
        playButton.addEventListener('click', startPlayback);
    }

    video.addEventListener('play', () => {
        if (cover) {
            cover.classList.add('is-hidden');
        }
    });

    video.addEventListener('click', () => {
        if (!attached) {
            startPlayback();
        }
    });

    window.addEventListener('beforeunload', () => {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
