let options = DEFAULT_OPTIONS;
let statusIcons = {};
let reverseKeyMap = getReverseKeyMap(options);
let episodeId = document.referrer.split("/")[4];

let playerDefaults = {
    playbackRate: options.defaultSpeed,
    volume: parseFloat(options.defaultVolume / 100),
    muted: options.muteByDefault,
}

window.addEventListener(
    'message',
    (event) => {
        if (event.data.sender && event.data.sender === "bvrv") {
            if (event.data.content === "chromeOptions") {
                options = event.data.options;
                statusIcons = event.data.statusIcons;
                reverseKeyMap = getReverseKeyMap(options);
                playerDefaults = {
                    playbackRate: options.defaultSpeed,
                    volume: parseFloat(options.defaultVolume / 100),
                    muted: options.muteByDefault,
                }
            } else if (event.data.content === "episodeId") {
                episodeId = event.data.episodeId;
            }
        }
    },
    false
);



function cleanUpPreviousUI() {
    let skipIntroButton = document.getElementById("bvrv-skip-intro-button");
    if (skipIntroButton) {
        skipIntroButton.classList.add("bvrv-display-none");
    }

    let skipOutroButton = document.getElementById("bvrv-skip-outro-button");
    if (skipOutroButton) {
        skipOutroButton.classList.add("bvrv-display-none");
    }

    let nextEpisodeButton = document.getElementById("bvrv-next-episode-button");
    if (nextEpisodeButton) {
        nextEpisodeButton.classList.add("bvrv-display-none");
    }
}

function setUp() {
    window.postMessage(
        {
            sender: "bvrv",
            content: "requestEpisodeId"
        },
        "*"
    );

    cleanUpPreviousUI();

    let player = videojs("player_html5_api", {"poster": ""});
    player.poster("");

    if (player.src() !== "") {
        player.ready(() => initBVRV(player));
    } else {
        console.log("no source");
    }
}

function observerCallback(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type == 'attributes') {
            if (mutation.attributeName === "src") {
                setUp();

                observer.disconnect();
                createObserver(document.getElementById("player_html5_api"), observerCallback);
            }
        }
    }
}

function createObserver(element, callback) {
    let observer = new MutationObserver(callback);
    observer.observe(
        element,
        { attributes: true, childList: true, subtree: true }
    );
}

setUp();
createObserver(document.getElementById("player_html5_api"), observerCallback);
