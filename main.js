document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector("video");
    const src = video.getElementsByTagName("source")[0].src;
    const options = {};

    if (Hls.isSupported()) {
        const hlsConfig = {
            maxMaxBufferLength: 100,
        };
        const hls = new Hls(hlsConfig);
        hls.loadSource(src);
        hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
            const levels = hls.levels.map(level => level.height);
            options.quality = {
                default: levels[0],
                options: levels,
                forced: true,
                onChange: (selected) => {
                    hls.levels.forEach((level, i) => {
                        if (level.height === selected) {
                            hls.currentLevel = i;
                        }
                    });
                },
            };
            options.previewThumbnails = {
                enabled: false,
                src: '#'
            };
            options.tooltips = {
                controls: true,
                seek: true
            };
            options.speed = {
                selected: 1,
                options: [1, 1.25, 1.5, 2, 2.25, 2.5, 3, 3.5, 4],
            };
            options.listeners = {
                seeking: function(event) {
                    const currentTime = video.currentTime;
                    const seekTime = 10;
                    if (event.detail.interaction == "doubletap") {
                        video.currentTime = Math.min(currentTime + seekTime, video.duration);
                    }
                },
                pause: function(event) {
                    if (event.detail.interaction == "tap" && !video.paused) {
                        video.pause();
                    }
                }
            };
            const bodyElement = document.querySelector("body");
            const loadingElement = document.getElementById("loading");
            loadingElement.style.display = "none";
            bodyElement.style.visibility = "visible";
            new Plyr(video, options);
        });
        hls.attachMedia(video);
        window.hls = hls;
    } else {
        options.speed = {
            selected: 1,
            options: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
        };
        const bodyElement = document.querySelector("body");
        const loadingElement = document.getElementById("loading");
        loadingElement.style.display = "none";
        bodyElement.style.visibility = "visible";
        new Plyr(video, options);
    }

    // Telegram popup script
    const popup = document.getElementById("telegram-popup");
    const closeButton = document.getElementById("close-popup");

    // Show the popup after a delay (e.g., 3 seconds)
    setTimeout(() => {
        popup.classList.add("show");
    }, 3000);

    // Close the popup when the close button is clicked
    closeButton.addEventListener("click", () => {
        popup.classList.remove("show");
    });
});
