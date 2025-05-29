console.log('allow pasting');
console.log('_legacyUndefinedCheck: true');
let audioNode = null;
let lastDateText = 'Streaming dimulai baru saja';
let latestFetchedData = null;
let lastLoggedViewCount = null;

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getVideoId = async (url) => new URL(url).searchParams.get('v');

function waitForUrlChange() {
  return new Promise((resolve) => {
    let lastUrl = location.href;

    const checkUrl = () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        resolve(lastUrl);
      } else {
        requestAnimationFrame(checkUrl);
      }
    };

    checkUrl();
  });
}

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

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  window.trustedTypes.createPolicy('default', {
    createHTML: (string) => string,
    createScriptURL: (string) => string,
    createScript: (string) => string,
  });
}

async function main() {
  if (!document.body) return requestAnimationFrame(main);
  
  // Header Update
  function updateHeader() {
    $$('#logo-icon > span').forEach((el) => {
      // Cek apakah Shadow DOM sudah dibuat
      if (!el.shadowRoot) {
        // Buat Shadow DOM jika belum ada
        const shadow = el.attachShadow({ mode: 'open' });

        // Tambahkan elemen ke dalam Shadow DOM
        shadow.innerHTML = `
          <div injected style="width: 100%; height: 100%; display: block; fill: currentcolor;">
            <?xml version="1.0" encoding="UTF-8"?>
            <svg class="external-icon" display="inherit" pointer-events="none" style="height:100%;width:100%" focusable="false" viewBox="0 0 90 20" xmlns="http://www.w3.org/2000/svg">
              <svg viewBox="0 0 97 20" xmlns="http://www.w3.org/2000/svg">
                <path d="m27.97 3.1232c-0.3293-1.23-1.2959-2.1966-2.5259-2.5259-2.2272-0.59737-11.162-0.59737-11.162-0.59737s-8.9346 2.2429e-7 -11.162 0.59737c-1.2276 0.32926-2.1966 1.2959-2.5259 2.5259-0.59501 2.2272-0.59501 6.8768-0.59501 6.8768s-1.57e-6 4.6496 0.59736 6.8768c0.32926 1.23 1.2959 2.1966 2.5259 2.5258 2.2272 0.5974 11.162 0.5974 11.162 0.5974s8.9347 0 11.162-0.5974c1.2301-0.3292 2.1967-1.2958 2.5259-2.5258 0.5974-2.2272 0.5974-6.8768 0.5974-6.8768s-0.0024-4.6496-0.5997-6.8768z" fill="#f00"/>
                <path d="m11.428 14.285 7.42-4.285-7.42-4.2851v8.5701z" fill="#fff"/>
                <path d="m40.057 6.3452v0.69144c0 3.4548-1.5311 5.4751-4.8824 5.4751h-0.5104v6.0465h-2.7375v-17.135h3.4877c3.1938 0 4.6426 1.35 4.6426 4.9224zm-2.8787 0.24694c0-2.4929-0.4492-3.0856-2.0014-3.0856h-0.5103v6.9661h0.4703c1.4699 0 2.0438-1.063 2.0438-3.3702l-0.0024-0.51035z"/>
                <path d="m46.534 5.8345-0.1435 3.2479c-1.1642-0.24459-2.1261-0.06115-2.5541 0.69144v8.7841h-2.7164v-12.519h2.1661l0.2446 2.714h0.1034c0.2846-1.9802 1.2042-2.9821 2.3895-2.9821 0.1717 0.0047 0.3434 0.02587 0.5104 0.0635z"/>
                <path d="m49.657 13.246v0.6326c0 2.206 0.1223 2.9633 1.0631 2.9633 0.8984 0 1.103-0.6914 1.1241-2.1237l2.4295 0.1435c0.1834 2.6952-1.2253 3.9017-3.6148 3.9017-2.8998 0-3.7582-1.9003-3.7582-5.3504v-2.1896c0-3.6359 0.9595-5.4139 3.8405-5.4139 2.8998 0 3.636 1.5122 3.636 5.2893v2.1472h-4.7202zm0-2.5753v0.8984h2.0626v-0.8937c0-2.3024-0.1646-2.9633-1.0372-2.9633-0.8725 0-1.0254 0.67497-1.0254 2.9633v-0.0047z"/>
                <path d="m68.41 9.099v9.4567h-2.8175v-9.2474c0-1.0207-0.2658-1.531-0.8796-1.531-0.4916 0-0.9408 0.28457-1.2465 0.81609 0.0165 0.16933 0.0235 0.34101 0.0212 0.51035v9.4568h-2.8199v-9.2522c0-1.0207-0.2658-1.531-0.8796-1.531-0.4915 0-0.9219 0.28457-1.2253 0.79727v9.9882h-2.8175v-12.524h2.2272l0.2493 1.5945h0.04c0.6326-1.2041 1.6557-1.858 2.8598-1.858 1.1853 0 1.858 0.59266 2.1661 1.6557 0.6538-1.0818 1.6345-1.6557 2.7563-1.6557 1.7121 0 2.366 1.2253 2.366 3.3231z"/>
                <path d="m69.819 2.8338c0-1.3476 0.4915-1.7357 1.531-1.7357 1.0631 0 1.5311 0.4492 1.5311 1.7357 0 1.3899-0.4704 1.738-1.5311 1.738-1.0395-0.00236-1.531-0.35043-1.531-1.738zm0.1646 3.2056h2.6952v12.524h-2.6952v-12.524z"/>
                <path d="m81.891 6.0396v12.524h-2.2061l-0.2446-1.5311h-0.0611c-0.6326 1.2253-1.5522 1.7357-2.6952 1.7357-1.6745 0-2.4318-1.0631-2.4318-3.3702v-9.3556h2.8175v9.1933c0 1.103 0.2305 1.5522 0.7973 1.5522 0.5174-0.0211 0.9807-0.3292 1.2018-0.7972v-9.9483h2.8222v-0.00235z"/>
                <path d="m96.19 9.0989v9.4568h-2.8175v-9.2474c0-1.0207-0.2658-1.531-0.8796-1.531-0.4915 0-0.9407 0.28457-1.2465 0.81609 0.0165 0.16698 0.0236 0.33631 0.0212 0.50564v9.4568h-2.8175v-9.2474c0-1.0207-0.2657-1.531-0.8796-1.531-0.4915 0-0.9219 0.28457-1.2253 0.79727v9.9882h-2.8175v-12.524h2.2249l0.2446 1.5922h0.0399c0.6327-1.2041 1.6557-1.858 2.8599-1.858 1.1853 0 1.8579 0.59266 2.166 1.6557 0.6538-1.0818 1.6345-1.6557 2.7563-1.6557 1.7216 0.00235 2.3707 1.2277 2.3707 3.3255z"/>
                <path d="m40.057 6.3452v0.69144c0 3.4548-1.5311 5.4751-4.8824 5.4751h-0.5104v6.0465h-2.7375v-17.135h3.4877c3.1938 0 4.6426 1.35 4.6426 4.9224zm-2.8787 0.24694c0-2.4929-0.4492-3.0856-2.0014-3.0856h-0.5103v6.9661h0.4703c1.4699 0 2.0438-1.063 2.0438-3.3702l-0.0024-0.51035z"/>
              </svg>
            </svg>
          </div>
        `;
      }
    });

    // Tetap lakukan perubahan pada elemen lain yang tidak memerlukan Shadow DOM
    $$('a.ytd-topbar-logo-renderer').forEach((el) => {
      el.removeAttribute('href');
    });
    $$('ytd-topbar-logo-renderer#logo').forEach((el) => {
      el.removeAttribute('show-yoodle');
    });
    $$('a#logo.ytd-topbar-logo-renderer>div.ytd-topbar-logo-renderer').forEach((el) => {
      el.removeAttribute('hidden');
    });
    $$('#country-code.ytd-topbar-logo-renderer').forEach((el) => {
      el.removeAttribute('hidden');
    });
    $$('#logo.ytd-topbar-logo-renderer').forEach((el) => {
      el.setAttribute('title', 'Beranda YouTube Premium');
    });
  }

  function setupFetchToggle() {
    const endElement = $('#end');
    if (!endElement) return;
    if ($('#toggle-fetch-input') || $('#fetch-popup')) return;
  
    const fetchToggleButton = document.createElement('button');
    fetchToggleButton.id = 'toggle-fetch-input';
    fetchToggleButton.className = 'style-scope toggle-fetch';
    fetchToggleButton.setAttribute('alt', 'Toggle Fetch Input');
    fetchToggleButton.setAttribute('title', 'Spam Web Request');
    fetchToggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 14 14">
        <path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" d="m.5 10.5l10-10H6m7.5 3l-10 10H8" />
      </svg>
    `;
    endElement.insertAdjacentElement('afterbegin', fetchToggleButton);
  
    const popupDialog = document.createElement('div');
    popupDialog.id = 'fetch-popup';
    popupDialog.className = 'fetch-popup';
    popupDialog.style.display = 'none';
    popupDialog.innerHTML = `
      <div class="fetch-popup-content">
        <h3>Custom Fetch Configuration</h3>
        <div class="fetch-input-group">
          <label for="fetch-input">Fetch URL<span id="url-validation-message">*Invalid Fetch</span></label>
          <input type="text" id="fetch-input" placeholder="Enter fetch URL..." autocomplete="off">
        </div>
        <div class="fetch-input-group">
          <label for="fetch-interval">Interval (ms)<span id="interval-validation-message">*Invalid number</span></label>
          <input type="number" id="fetch-interval" placeholder="Enter interval..." value="${localStorage.getItem('fetchInterval') || ''}">
        </div>
        <div class="fetch-buttons">
          <button id="submit-fetch">Start Fetch</button>
          <button id="stop-fetch" style="display: none;">Stop Fetch</button>
          <button id="close-popup">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(popupDialog);
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $('#fetch-popup').style.display === 'block') {
        $('#fetch-popup').style.display = 'none';
      } else if (e.key === "Enter" && $('#fetch-popup').style.display === 'block') {
        $('#submit-fetch').click();
      }
    });
  
    setupFetchPopupListeners();
  }

  function setupFetchPopupListeners() {
    const fetchPopup = $('#fetch-popup');
    const fetchInput = $('#fetch-input');
    const fetchIntervalInput = $('#fetch-interval');
    const submitFetchButton = $('#submit-fetch');
    const stopFetchButton = $('#stop-fetch');
    const closePopupButton = $('#close-popup');
  
    let fetchIntervalId = null;
  
    $('#toggle-fetch-input').addEventListener('click', () => {
      fetchPopup.style.display = 'block';
    });
  
    closePopupButton.addEventListener('click', () => {
      fetchPopup.style.display = 'none';
    });
  
    fetchPopup.addEventListener('click', (e) => {
      if (e.target === fetchPopup) {
        fetchPopup.style.display = 'none';
      }
    });
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fetchPopup.style.display === 'block') {
        fetchPopup.style.display = 'none';
      } else if (e.key === "Enter" && fetchPopup.style.display === 'block') {
        submitFetchButton.click();
      }
    });
  
    submitFetchButton.addEventListener('click', () => {
      const fetchCode = fetchInput.value.trim();
      const intervalValue = fetchIntervalInput.value;
      const urlMessage = $('#url-validation-message');
      const intervalMessage = $('#interval-validation-message');
  
      const urlRegex = /^fetch.*https:\/\//;
      const isIntervalValid = /^\d+$/.test(intervalValue) && parseInt(intervalValue, 10) > 0;
  
      if (!urlRegex.test(fetchCode) || !isIntervalValid) {
        urlMessage.style.display = !urlRegex.test(fetchCode) ? 'block' : 'none';
        intervalMessage.style.display = !isIntervalValid ? 'block' : 'none';
        return;
      }
  
      urlMessage.style.display = 'none';
      intervalMessage.style.display = 'none';
  
      localStorage.setItem('spamInterval', intervalValue);
  
      if (fetchIntervalId) {
        clearInterval(fetchIntervalId);
      }
  
      fetchIntervalId = setInterval(() => {
        try {
          new Function(fetchCode)();
        } catch (error) {
          console.error('Error executing fetch code:', error);
        }
      }, parseInt(intervalValue));
  
      stopFetchButton.style.display = 'inline-block';
      submitFetchButton.style.display = 'none';
    });
  
    stopFetchButton.addEventListener('click', () => {
      if (fetchIntervalId) {
        clearInterval(fetchIntervalId);
        fetchIntervalId = null;
        console.info('Fetch interval stopped');
  
        submitFetchButton.style.display = 'inline-block';
        stopFetchButton.style.display = 'none';
      }
    });
  
    const savedInterval = localStorage.getItem('spamInterval');
    if (savedInterval) {
      fetchIntervalInput.value = savedInterval;
    }
  }  

  function renderClock() {
    return new Promise((resolve) => {
      const topbarButtons = $('#end');
      if (!topbarButtons) return resolve();
  
      const header_clock = $('div.header-clock');
      header_clock?.remove();
  
      const time = new Date();
  
      const clockContainer = document.createElement('div');
      clockContainer.className = 'header-clock';
  
      const hours = document.createElement('div');
      hours.className = 'clock-digits';
      hours.innerHTML = time.getHours().toString().padStart(2, '0');
      const minutes = document.createElement('div');
      minutes.className = 'clock-digits';
      minutes.innerHTML = time.getMinutes().toString().padStart(2, '0');
  
      const separator1 = document.createElement('span');
      separator1.textContent = ':';
  
      clockContainer.appendChild(hours);
      clockContainer.appendChild(separator1);
      clockContainer.appendChild(minutes);
  
      topbarButtons.insertAdjacentElement('afterbegin', clockContainer);
  
      const updateClock = () => {
        const now = new Date();
        hours.innerHTML = now.getHours().toString().padStart(2, '0');
        minutes.innerHTML = now.getMinutes().toString().padStart(2, '0');
        setTimeout(updateClock, 1000);
      };
  
      updateClock();
      resolve();
    });
  }

  await waitForElement('#logo-icon > span').then(updateHeader);
  await waitForElement('#logo-icon > span > div').then(setupFetchToggle);
  await waitForElement('#end').then(renderClock);
}

async function watch() {
  if (!document.body) return requestAnimationFrame(watch);
  const currentVideoId = await getVideoId(location.href);

  async function handleWatchPage(currentVideoId) {
    lastLoggedViewCount = null;
    fetchData(currentVideoId);
    await waitForElement('video');
    handleVideoElement();
    
    console.log(`Fetching new data for [${currentVideoId}]`);
    interceptFetch();
  }

  async function handleVideoElement() {
    await checkAndResumePlayback();
    const player = await waitForElement('#movie_player');
    const video = await waitForElement('video');
    let hasPlayedOnce = false;
    resolutionChange();
  
    video.addEventListener('play', () => {
      if (!hasPlayedOnce) {
        console.log('video is playing');
        hasPlayedOnce = true;
        setHighestResolution();
        player.setLoop(true);
        player.setLoopVideo(true);
        player.toggleSubtitles();
        audioNode = createAudioNode(video);
      }
    });
  }

  function createAudioNode(videoElement) {
    if (audioNode) return;
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
      16000: { frequency: 16000, gain: 1 },
    };

    Object.values(equalizer).forEach(({ frequency, gain }) => {
      biquadFilter.frequency.value = frequency;
      biquadFilter.Q.value = 4.0;
      biquadFilter.gain.value = gain;
    });

    inGain.gain.value = 0.2;
    outGain.gain.value = 6.5;

    audioStream.connect(inGain).connect(biquadFilter).connect(outGain).connect(audioContext.destination);
    console.log('Bass Boosted!');
    return true;
  }

  async function fetchData(videoId, inputType) {
    try {
      const response = await fetch(window.location.href);
      const text = await response.text();

      const ytInitialDataMatch = text.match(/var ytInitialData = ({.*?});<\/script>/s);
      if (ytInitialDataMatch && ytInitialDataMatch[1]) {
        const ytInitialData = JSON.parse(ytInitialDataMatch[1]);
        const targetData = ytInitialData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer;
        const isLiveContent = ytInitialData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer?.viewCount?.videoViewCountRenderer?.isLive || false;
        
        if (targetData) {
          console.log('📋 ytInitialData > contents > twoColumnWatchNextResults > results > results > contents[0]:', targetData);

          // Modifikasi: Ambil viewCount dari originalViewCount, jika 0 ambil dari simpleText
          let viewCount = targetData.viewCount?.videoViewCountRenderer?.originalViewCount || '0';
          if (viewCount === '0' && targetData.viewCount?.videoViewCountRenderer?.viewCount?.simpleText) {
            viewCount = targetData.viewCount.videoViewCountRenderer.viewCount.simpleText.split(' ')[0].replace(/[,.]/g, '');
          }
          
          const channelTitle = ytInitialData?.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[1]?.videoSecondaryInfoRenderer?.owner?.videoOwnerRenderer?.title?.runs?.[0]?.text || '';
          const dateText = isLiveContent ? (targetData.dateText?.simpleText || 'Streaming dimulai baru saja') : (targetData.relativeDateText?.simpleText || targetData.dateText?.simpleText || 'Dipublikasikan baru saja');

          const data = {
            items: [{
              snippet: {
                liveBroadcastContent: isLiveContent ? 'live' : 'none',
                channelTitle: channelTitle,
                publishedAt: isLiveContent ? null : dateText
              },
              statistics: isLiveContent ? {} : { viewCount },
              liveStreamingDetails: isLiveContent ? { concurrentViewers: viewCount, actualStartTime: dateText } : {}
            }],
            timestamp: new Date().getTime()
          };

          console.log(`Data fetched for [${videoId}]`);
          latestFetchedData = data;
          displayData(data, videoId, inputType);
        } else {
          console.warn('⚠️ Specified ytInitialData property not found');
          throw new Error('Target data not found');
        }
      } else {
        console.warn('⚠️ ytInitialData not found in watch page response');
        throw new Error('ytInitialData not found');
      }
    } catch (error) {
      console.error(`There has been an error when fetching [${videoId}]:`, error);
    }
  }

  async function displayData(data, videoId, inputType) {
    if (data && data.items && data.items.length > 0) {
      latestFetchedData = data;
      const isLive = data.items[0].snippet.liveBroadcastContent === 'live';
      if (isLive) console.log(`Live video detected! for [${videoId}]`);
      let viewCountValue = isLive ? data.items[0].liveStreamingDetails.concurrentViewers : data.items[0].statistics.viewCount;
      let dateText = isLive ? data.items[0].liveStreamingDetails.actualStartTime : data.items[0].snippet.publishedAt;
      
      if (lastLoggedViewCount !== viewCountValue) {
        console.log(`Views for [${videoId}]: ${viewCountValue}, ${dateText}`);
        lastLoggedViewCount = viewCountValue;
      }
    
      const compressedData = {
        viewCount: viewCountValue,
        date: dateText,
        channelTitle: data.items[0].snippet.channelTitle,
        isLive: isLive,
        videoId: videoId,
      };
    
      if (inputType === undefined) {
        await addVideoIdAndViews(compressedData);
      } else if (inputType === 'refresh') {
        updateViewDisplay(viewCountValue, isLive, dateText);
        console.log(`Refreshed views for [${videoId}]`);
      }
    } else {
      console.error(`Invalid data structure in displayData for [${videoId}]`);
    }
  }

  async function addVideoIdAndViews(compressedData) {
    const { viewCount, date, channelTitle, isLive, videoId } = compressedData;
  
    try {
      await new Promise((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve);
      });
  
      const titleH1Element = await waitForElement('#title > h1');
      if ($('.view-count-info')) $('.view-count-info').remove();
      if ($('.channelBy2')) $('.channelBy2').remove();
      if ($('.ytp-view-big-mode')) $('.ytp-view-big-mode').remove();
  
      const formattedViewCount = formatViewCount(viewCount, isLive);
      const titleElement = titleH1Element.parentElement;
      const viewCountElement = document.createElement('div');
      viewCountElement.className = 'style-scope view-count-info';
      viewCountElement.innerHTML = `
      <h1 class="style-scope ytd-viewRenderer">
        <span class="odometer" data-value="${viewCount}" data-live="${isLive}"></span>
        <span class="odometer-suffix">${formattedViewCount.substring(formattedViewCount.indexOf(' '))}</span>
        <strong class="separator"> • </strong><span id="date_text" class="style-scope ytd-watch-metadata">${date}</span>
      </h1>
      <button id="refresh-viewCount" class="style-scope refresh-vc" alt="Refresh viewCount" title="Refresh Viewcount">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24">
          <path fill="white" d="M17.65 6.35A7.96 7.96 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"></path>
        </svg>
      </button>`;
      titleElement.insertAdjacentElement('afterend', viewCountElement);
  
      new Odometer({
        el: viewCountElement.querySelector('.odometer'),
        value: parseInt(viewCountElement.querySelector('.odometer').getAttribute('data-value')),
        theme: 'minimal',
      });
  
      $('#refresh-viewCount').addEventListener('click', () => {
        const inputType = 'refresh';
        fetchData(videoId, inputType);
      });
  
      const videoTitleElement = await waitForElement('div.ytp-title>div');
      if (videoTitleElement) {
        const videoIdSpan = document.createElement('strong');
        videoIdSpan.className = 'channelBy2';
        videoIdSpan.textContent = `- ${channelTitle}`;
        videoTitleElement.appendChild(videoIdSpan);
  
        const topButtonsContainer = await waitForElement('#movie_player > div.ytp-chrome-top > div.ytp-chrome-top-buttons');
        if (topButtonsContainer) {
          const odometerElement = document.createElement('div');
          odometerElement.className = 'ytp-view-big-mode';
          odometerElement.setAttribute('aria-haspopup', 'true');
          odometerElement.setAttribute('data-tooltip-opaque', 'true');
          odometerElement.innerHTML = `
            <div class="odometer" data-value="${viewCount}" data-live="${isLive}"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="white" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4"/></svg>
          `;
          topButtonsContainer.insertAdjacentElement('beforebegin', odometerElement);
  
          new Odometer({
            el: odometerElement.querySelector('.odometer'),
            value: parseInt(odometerElement.querySelector('.odometer').getAttribute('data-value')),
            theme: 'minimal',
          });
        }
      }
      console.log(`Video ID and views for [${videoId}] added!`);
    } catch (error) {
      console.error(`Error in addVideoIdAndViews for [${videoId}]:`, error);
    }
  }

  function updateViewDisplay(viewCountValue, isLive, dateText) {
    const viewElement = $('h1.ytd-viewRenderer .odometer');
    const suffixElement = $('h1.ytd-viewRenderer .odometer-suffix');
    const dateTextElement = $('#date_text');
    const viewElementBigMode = $('#movie_player > div.ytp-chrome-top > div.ytp-view-big-mode .odometer');
    
    if (viewElement) {
      viewElement.odometer.update(viewCountValue);
      viewElement.setAttribute('data-value', viewCountValue);
    
      if (suffixElement) {
        const formattedViewCount = formatViewCount(viewCountValue, isLive);
        suffixElement.textContent = formattedViewCount.substring(formattedViewCount.indexOf(' '));
      }
    
      if (dateTextElement) {
        dateTextElement.textContent = dateText;
      }
    }
    
    if (viewElementBigMode) {
      viewElementBigMode.odometer.update(viewCountValue);
      viewElementBigMode.setAttribute('data-value', viewCountValue);
    }
  }

  async function resolutionChange() {
    await waitForElement('.ytp-quality-menu .ytp-menuitem');
    $$('.ytp-quality-menu .ytp-menuitem').forEach((el) => {
      el.addEventListener('click', () => {
          let qualityText = el.querySelector('div > div > span').textContent;
          let cleanedQuality = qualityText.match(/\d+p/)?.[0] || qualityText;

          const qualityLabels = {
            '4320p (8K)': 'highres',
            '2880p (5K)': 'hd2880',
            '2160p (4K)': 'hd2160',
            '1440p': 'hd1440',
            '1080p': 'hd1080',
            '720p': 'hd720',
            '480p': 'large',
            '360p': 'medium',
            '240p': 'small',
            '144p': 'tiny'
          };

          const qualityKey = qualityLabels[cleanedQuality];
          localStorage.setItem('resolution', qualityKey);
          console.log(`Quality set to ${qualityKey}`);
      });
    });
  }

  const setHighestResolution = async() => {
    const player = $('#movie_player');
    if (!player) return requestAnimationFrame(setHighestResolution);
    await new Promise((resolve) => setTimeout(resolve, 200));
  
    const targetQuality = localStorage.getItem('resolution');
    const qualities = player.getAvailableQualityLevels();
    const quality = qualities.includes(targetQuality) ? targetQuality : qualities[0];
    player.setPlaybackQualityRange(quality);
    player.setPlaybackQuality(quality);

    console.log(`Quality set to ${quality}`);
  };

  function formatViewCount(viewCount, isLive) {
    viewCount = parseInt(viewCount, 10);
    const formattedViewCount = viewCount.toLocaleString('en-US');
    const units = [
      { value: 1e12, suffix: ' B' },
      { value: 1e9, suffix: ' M' },
      { value: 1e6, suffix: ' jt' },
      { value: 1e3, suffix: ' rb' },
    ];
  
    let displayViewCount = formattedViewCount;
    for (const { value, suffix } of units) {
      if (viewCount >= value) {
        let count = Math.floor((viewCount / value) * 10) / 10;
        count = count.toString().replace('.', ',');
        displayViewCount += ` (${count.replace(/,0$/, '')}${suffix})`;
        break;
      }
    }
    displayViewCount += isLive ? ' sedang menonton' : ' x ditonton';
    return displayViewCount;
  }

  await handleWatchPage(currentVideoId);

  function handleUpdatedMetadataRequest(url, payload, isInitial = false) {
    if (isInitial) {
      if (url.includes('https://www.youtube.com/watch?v=')) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(payload, 'text/html');
          const viewCountElement = doc.querySelector('span.view-count');
          const isLive = !!doc.querySelector('span.live-indicator');
          
          const viewCountText = viewCountElement?.textContent || '';
          const viewCountMatch = viewCountText.match(/([\d,.]+)\s*(sedang menonton|x ditonton)/);
          const viewCount = viewCountMatch ? viewCountMatch[1].replace(/[,.]/g, '') : null;
          const dateText = doc.querySelector('span.date')?.textContent || (isLive ? 'Streaming dimulai baru saja' : 'Dipublikasikan baru saja');
          
          lastDateText = dateText;

          const fetchedData = {
            items: [{
              snippet: {
                liveBroadcastContent: isLive ? 'live' : 'none',
                channelTitle: doc.querySelector('ytd-channel-name')?.textContent || '',
                publishedAt: isLive ? null : dateText
              },
              statistics: isLive ? {} : { viewCount },
              liveStreamingDetails: isLive ? { concurrentViewers: viewCount, actualStartTime: dateText } : {}
            }],
            timestamp: new Date().getTime()
          };
          latestFetchedData = fetchedData;

          return {
            viewership: {
              displayText: viewCount ? formatViewCount(viewCount, isLive) : null,
              rawCount: viewCount
            },
            dateText,
            isLive
          };
        } catch (e) {
          console.error('❌ Failed to parse initial watch page:', e.message);
          return null;
        }
      }
      return null;
    }

    if (url.includes('https://www.youtube.com/youtubei/v1/updated_metadata')) {
      try {
        const json = typeof payload === 'string' ? JSON.parse(payload) : payload;

        if (!json.actions || !Array.isArray(json.actions)) return null;

        let result = {
          viewership: null,
          dateText: null,
          isLive: false
        };

        json.actions.forEach(action => {
          if (action.updateViewershipAction) {
            const v = action.updateViewershipAction.viewCount?.videoViewCountRenderer;
            result.isLive = !!v?.isLive;
            if (v) {
              const mainText = v?.viewCount?.simpleText || null;
              const shortText = v?.extraShortViewCount?.simpleText || null;
              const viewCount = mainText ? mainText.split(' ')[0].replace(/[,.]/g, '') : null;
              result.viewership = {
                raw: action.updateViewershipAction,
                displayText: viewCount ? formatViewCount(viewCount, result.isLive) : null,
                rawCount: viewCount
              };
            }
          }
          if (action.updateDateTextAction) {
            const newDateText = action.updateDateTextAction.dateText?.simpleText;
            if (newDateText) {
              result.dateText = newDateText;
              lastDateText = newDateText;
            }
          }
        });

        if (result.viewership) {
          const fetchedData = {
            items: [{
              snippet: {
                liveBroadcastContent: result.isLive ? 'live' : 'none',
                channelTitle: latestFetchedData?.items[0]?.snippet.channelTitle || '',
                publishedAt: result.isLive ? null : (result.dateText || lastDateText)
              },
              statistics: result.isLive ? {} : { viewCount: result.viewership.rawCount },
              liveStreamingDetails: result.isLive ? { concurrentViewers: result.viewership.rawCount, actualStartTime: result.dateText || lastDateText } : {}
            }],
            timestamp: new Date().getTime()
          };
          latestFetchedData = fetchedData;
        }

        if (!result.dateText) {
          result.dateText = lastDateText;
        }

        return result.viewership ? result : null;
      } catch (e) {
        console.error('❌ Failed to parse updated_metadata subclause:', e.message);
        return null;
      }
    }
    return null;
  }

  function interceptFetch() {
    const originalFetch = window.fetch;

    window.fetch = async function(input, init) {
      const url = typeof input === 'string' ? input : input.url;
      const response = await originalFetch(input, init);

      try {
        if (url.includes('https://www.youtube.com/watch?v=')) {
          const cloned = response.clone();
          const text = await cloned.text();
          const result = handleUpdatedMetadataRequest(url, text, true);
          if (result && result.viewership?.rawCount) {
            if (lastLoggedViewCount !== result.viewership.rawCount) {
              console.log('📊 Initial Video Data:', {
                ...(result.viewership?.displayText && { viewerCount: result.viewership.displayText }),
                ...(result.dateText && { startedAt: result.dateText }),
                isLive: result.isLive
              });
              lastLoggedViewCount = result.viewership.rawCount;
            }
            updateViewDisplay(result.viewership.rawCount, result.isLive, result.dateText);
          }
        }

        if (url.includes('/youtubei/v1/updated_metadata')) {
          const cloned = response.clone();
          const json = await cloned.json();
          const result = handleUpdatedMetadataRequest(url, json);
          if (result && result.viewership?.rawCount) {
            if (lastLoggedViewCount !== result.viewership.rawCount) {
              console.log('📊 Video Data Update:', {
                ...(result.viewership?.displayText && { viewerCount: result.viewership.displayText }),
                ...(result.dateText && { startedAt: result.dateText }),
                isLive: result.isLive
              });
              lastLoggedViewCount = result.viewership.rawCount;
            }
            updateViewDisplay(result.viewership.rawCount, result.isLive, result.dateText);
          }
        }
      } catch (e) {
        console.error('❌ Error in fetch intercept:', e.message);
      }

      return response;
    };
  }
}

async function checkAndResumePlayback() {
  if (location.pathname === "/watch") {
    const videoId = await getVideoId(location.href);
    const savedTime = localStorage.getItem(`yt_time_${videoId}`);
    
    if (savedTime) {
      const videoElement = await waitForElement('video');
      const player = await waitForElement('#movie_player');
      
      videoElement.addEventListener('loadedmetadata', () => {
        let timeToSeek = parseFloat(savedTime);
        const duration = videoElement.duration;
        
        if (!isNaN(timeToSeek)) {
          timeToSeek = Math.max(0, timeToSeek - 2);
          
          if (timeToSeek < duration - 5) {
            player.seekTo(timeToSeek, true);
            const formattedTime = formatTime(timeToSeek);
            console.log(`Resuming playback at ${formattedTime} (original: ${formatTime(parseFloat(savedTime))})`);
          } else {
            console.log('Saved position too close to end, starting from beginning');
          }
        }
      });
    }
  }
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  const pad = (num) => num.toString().padStart(2, '0');
  
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

async function initYouTubeScript() {
  await main();
  if (location.pathname === "/watch") {
    await watch();
  }

  waitForUrlChange().then(() => {
    console.log("URL berubah, menjalankan ulang skrip...");
    initYouTubeScript();
  });
}

function handlePageUnload() {
  function resetGlobalVariables() {
    audioNode = null;
    lastLoggedViewCount = null;
    console.log('Global variables reset');
  }

  async function saveCurrentVideoTime() {
    try {
      if (location.pathname === "/watch") {
        const videoId = await getVideoId(location.href);
        const videoElement = await waitForElement('video');
        
        if (videoElement && !isNaN(videoElement.currentTime)) {
          const currentTime = videoElement.currentTime;
          const duration = videoElement.duration;
          
          if (currentTime > 5 && currentTime < duration - 5) {
            localStorage.setItem(`yt_time_${videoId}`, currentTime.toString());
            const formattedTime = formatTime(currentTime);
            console.log(`Saved playback position (${formattedTime}) for video ${videoId}`);
          }
        }
      }
    } catch (error) {
      console.error('Error saving video time:', error);
    }
  }

  resetGlobalVariables();
  saveCurrentVideoTime();
}

window.addEventListener('beforeunload', handlePageUnload);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    handlePageUnload();
  }
});

initYouTubeScript();