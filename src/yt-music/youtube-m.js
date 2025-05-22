console.log("allow pasting");
const stateManager = {
    audioNode: null,
    previousVideoURL: null,
    looped: null,
    looping: JSON.parse(localStorage.getItem('looping') || 'false'),
    bassBoost: JSON.parse(localStorage.getItem('bassBoost') || 'false'),
    
    // Method untuk reset state
    reset() {
        this.audioNode = null;
        this.previousVideoURL = null;
        this.looped = null;
    },
    
    // Method untuk menyimpan setting ke localStorage
    saveSetting(key, value) {
        this[key] = value;
        localStorage.setItem(key, JSON.stringify(value));
    }
};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  window.trustedTypes.createPolicy('default', {
    createHTML: (string) => string,
    createScriptURL: (string) => string,
    createScript: (string) => string
  });
}

  (async () => {
    while (true) {
        const currentVideoURL = window.location.href;
        await waitForElement('#right-content').then((topSetting) => injectSettings(topSetting));

        if (stateManager.previousVideoURL !== currentVideoURL) {
            if (location.pathname.includes('/watch')) {
                // Aktifkan loop jika diaktifkan
                if (stateManager.looping === true) {
                    loopedIn();
                }
    
                if (stateManager.bassBoost === true && stateManager.audioNode !== true) {
                    await waitForElement('video').then((video) => {
                        stateManager.audioNode = createAudioNode(video);
                    });
                }
            }
            stateManager.previousVideoURL = currentVideoURL;
        }
        await wait(100);
    }
})();

function resetGlobalVariables() {
    stateManager.reset();
}

// Wait for Element
function waitForElement(selector) {
    return new Promise((resolve) => {
      const checkElement = () => {
        const element = $(selector);
        if (element) {
          resolve(element);
        } else {
          requestAnimationFrame(checkElement);
        }
      };
      checkElement();
    });
  }

function injectSettings(topSetting) {
    if ($('.injector-settings')) return;

    // Inject settings HTML
    const settingsHTML = `
        <button class="injector-settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zM11 20h1.975l.35-2.65q.775-.2 1.438-.587t1.212-.938l2.475 1.025l.975-1.7l-2.15-1.625q.125-.35.175-.737T17.5 12t-.05-.787t-.175-.738l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.212-.962t-1.438-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.55.575 1.213.963t1.437.587zm1.05-4.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5M12 12"/></svg>
            <div class="settings-dropdown">
                <div class="injector-settings-menu">
                    <input type="checkbox" id="looping" data-setting="looping" ${stateManager.looping ? 'checked' : ''}>
                    <label for="looping">Looping</label>
                </div>
                <div class="injector-settings-menu">
                    <input type="checkbox" id="bassBoost" data-setting="bassBoost" ${stateManager.bassBoost ? 'checked' : ''}>
                    <label for="bassBoost">Bass Boost</label>
                </div>
            </div>
        </button>
        `;

    // Append settings to the DOM
    topSetting.insertAdjacentHTML('beforeend', settingsHTML);

    // Handle settings changes
    const checkboxes = $$('.injector-settings-menu');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', event => {
            const setting = event.target.dataset.setting;
            const value = event.target.checked;
            localStorage.setItem(setting, value);
        });
    });
}

async function loopedIn() {
    await waitForElement('#right-controls > div > tp-yt-paper-icon-button.repeat.style-scope.ytmusic-player-bar').then((element) => {
        const title = element.getAttribute('title');
        if (title === "Ulangi nonaktif" || title === "Ulangi semua") {
            for (let x = 0; x < 2; x++) {
                element.click();
            }
            stateManager.looped = true;
            console.log('Looping activated!');
        }
    });
}

function createAudioNode(videoElement) {
    const audioContext = new AudioContext();
  
    const audioStream = audioContext.createMediaElementSource(videoElement);
  
    const inGain = audioContext.createGain();
    const biquadFilter = audioContext.createBiquadFilter();
    const outGain = audioContext.createGain();
  
    const equalizer = {
      31: { frequency: 31, gain: 15 },
      62: { frequency: 62, gain: 10 },
      125: { frequency: 125, gain: 5 },
      250: { frequency: 250, gain: 0 },
      500: { frequency: 500, gain: -5 },
      1000: { frequency: 1000, gain: -5 },
      2000: { frequency: 2000, gain: 0 },
      4000: { frequency: 4000, gain: 5 },
      8000: { frequency: 8000, gain: 10 },
      16000: { frequency: 16000, gain: 1 }
    };
  
    for (const frequency in equalizer) {
      const filterSettings = equalizer[frequency];
      biquadFilter.frequency.value = filterSettings.frequency;
      biquadFilter.Q.value = 4.0;
      biquadFilter.gain.value = filterSettings.gain;
    }
  
    inGain.gain.value = 0.2;
    outGain.gain.value = 4.7;
  
    audioStream.connect(inGain);
    inGain.connect(biquadFilter);
    biquadFilter.connect(outGain);
    outGain.connect(audioContext.destination);
    console.log('Bass Boosted!');
    return true;
  }