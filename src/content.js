import 'canvas-toBlob';
import { handleScreenshot, handleText, handleVideo } from './noteActions';

let userIsAuthenticated = false;

chrome.storage.sync.get(['userToken'], function (result) {
  if (result.userToken === 'hell yes') {
    userIsAuthenticated = true;
    main();
    console.log('User token is ' + result.userToken);
    chrome.runtime.sendMessage({ authenticated: "yes" }, function (response) {
      console.log('Answer: ', response.token);
    });
  } else {
    console.log('User is not authenticated');
  }
});

window.onload = () => {

  if (userIsAuthenticated) {
    main();
  }
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension, token: ", request.token);
    if (request.token == "hello") {
      sendResponse({ farewell: "goodbye" });
      chrome.runtime.sendMessage({ loggedIn: "yes" }, function (response) {
        console.log('Answer: ', response.token);
        chrome.storage.sync.set({ userToken: 'hell yes', limit: Date.now() + 86400000}, function () {
          console.log('User token set as ' + 'hell yes');
        })
      });
      userIsAuthenticated = true;
      main();
    } else if (request.token == "check") {
      console.log('checking')
      chrome.storage.sync.get(['userToken', 'limit'], function (result) {
        console.log(result.limit, typeof result.limit)
        if (result.limit < Date.now()) {
          console.log('Expired token');
          chrome.storage.sync.remove(['userToken', 'limit'], () => {
            console.log('Invalid token');
          });
          chrome.runtime.sendMessage({ loggedOut: "yes" }, function (response) {
            console.log('Answer: ', response.token);
          });
        }

        if (result.userToken && result.userToken === 'hell yes') {
          userIsAuthenticated = true;
          main();
          console.log('Still logged in');
          chrome.runtime.sendMessage({ loggedIn: "yes" }, function (response) {
            console.log('Answer: ', response.token);
          });
        } else {
          console.log('User is not loggedin');
          chrome.storage.sync.remove(['userToken', 'limit'], () => {
            console.log('Invalid token');
          });
          chrome.runtime.sendMessage({ loggedIn: "loggedOut" }, function (response) {
            console.log('Answer: ', response.token);
          });
        }
      });
    } else {
      chrome.storage.sync.remove(['userToken', 'limit'], () => {
        console.log('Invalid token');
      });
      chrome.runtime.sendMessage({ loggedIn: "loggedOut" }, function (response) {
        console.log('Answer: ', response.token);
      });
  }
  });

// Only execute content script if user is logged in
const main = () => {

  const addNoteBtnContainer = document.createElement('div');
  const noteTypeRow = document.createElement('div');
  const videoRangeContainer = document.createElement('div');
  const textInputContainerElement = document.createElement('div');
  const videoInputElement = document.createElement('div');

  addNoteBtnContainer.classList = 'btnContainer--hidden';
  addNoteBtnContainer.setAttribute('id', 'addNoteBtnContainer');

  noteTypeRow.classList = 'note-btn-list row--hidden';
  noteTypeRow.setAttribute('id', 'noteTypes');

  videoRangeContainer.classList = 'range-controll-group video-range--hidden';
  videoRangeContainer.setAttribute('id', 'rangeControllGroup');

  textInputContainerElement.classList = 'input-text--hidden input-text';
  textInputContainerElement.setAttribute('id', 'textInputContainer');

  videoInputElement.classList = 'input-video--hidden input-video';
  videoInputElement.setAttribute('id', 'videoInputContainer');

  addNoteBtnContainer.innerHTML = `
<button type="button" class="btn-default modal-test" id="addNoteBtn">
  Add Note
</button>
`;

  noteTypeRow.innerHTML = `
<button type="button" data-type="text" class="btn-default noteTypeBtn">
  Plain/Text
</button>
<button type="button" data-type="image" class="btn-default noteTypeBtn">
  Screenshot
</button>
<button type="button" data-type="video" class="btn-default noteTypeBtn">
  Video
</button>
`;

  videoRangeContainer.innerHTML = `
  <input type="number" class="range-input" id="dataRangeMin"/>
  <input type="number" class="range-input" id="dataRangeMax"/>
`;

  textInputContainerElement.innerHTML = `
  <textarea maxlength="50" class="text-input" id="textInput"></textarea> 
  <button type="button" class="btn-default text-input-btn" id="textInputBtn">
    Add
  </button>
  `;

  videoInputElement.innerHTML = `
  <video id="player" class="video-player" controls></video>
  <button id="stop">Stop</button>
  <a id="download" class="btn btn-default">Download</a>
  `;

  addNoteBtnContainer.appendChild(noteTypeRow);
  addNoteBtnContainer.prepend(videoRangeContainer);
  addNoteBtnContainer.appendChild(textInputContainerElement);
  addNoteBtnContainer.appendChild(videoInputElement);

  // add mouse move event listener to mouse to make button appear near it
  let addNoteBtnCont;
  let addNoteBtn;
  let noteTypeBtns;
  let noteTypeBtnList;
  let videoPlayers;
  let overVideo;
  let overElement;
  let videoRangeInputs;
  let textInputContainer;
  let videoInputContainer;

  const videoPlayersLocation = [];
  const coords = [0, 0];

  // window events
  window.addEventListener('mousemove', e => {
    coords[0] = e.clientX;
    coords[1] = e.clientY;
    if (e.target.nodeName === 'VIDEO') {
      overVideo = e.target;
    } else {
      let nothingFound = true;
      Array.from(videoPlayersLocation).forEach((video, i) => {
        if (e.clientX > video.x.start && e.clientX < video.x.end
          && e.clientY > video.y.start && e.clientY < video.y.end) {
            console.log('pass?');
          overVideo = videoPlayers[i];
          nothingFound = false;
        }
      });

      if (nothingFound) {
        overVideo = false;
        overElement = e.target;
      }
    };
  });

  // Startget key commands to get button
  const keys = []

  const checkRangeChange = (videoElement, videoRangeInputs) => {
    // Advance video when changing range max
    if (videoRangeInputs) {
      videoRangeInputs[1].addEventListener('change', e => {
        videoElement.currentTime = Number.parseInt(e.target.value, 10) * 60;
      });
    }
  }

  const noteTypeEvents = (overVideo, overElement) => {
    Array.from(noteTypeBtnList).forEach(button => {
      button.addEventListener('click', e => {
        const type = e.target.dataset.type;
        console.log(`Handle note of type: ${type}`);
        textInputContainer.classList.add('input-text--hidden');
        videoInputContainer.classList.add('input-video--hidden');

        if (type === 'image') {
          handleScreenshot(overVideo, overElement);
        } else if (type === 'text') {
          document.getElementsByClassName('note-btn-list')[0].classList.add('hidden');
          textInputContainer.classList.remove('input-text--hidden');
          handleText(overVideo ? videoRangeInputs : false, textInputContainer);
        } else if (type === 'video') {
          document.getElementsByClassName('note-btn-list')[0].classList.add('hidden');
          videoInputContainer.classList.remove('input-video--hidden');
          handleVideo(overVideo ? videoRangeInputs : false, overElement);
        }
      });
    });
  }

  window.onkeydown = async function (e) {
    if (!keys.includes(e.key)) {
      keys.push(e.key);
      if (keys.includes('W') && keys.includes('Shift')) {
        if (addNoteBtnCont) {
          videoRangeContainer.classList.add('video-range--hidden');
          addNoteBtnCont.classList.toggle('btnContainer--hidden');

          noteTypeEvents(overVideo, overElement);

          // if cursor on video show note options under video play controls
          if (overVideo) {
            console.log(`Video at ${overVideo.currentTime} and with total duration of ${overVideo.duration}`);
            console.log(`Video currently ${overVideo.paused ? 'paused' : 'playing'}`);
            
            videoRangeContainer.classList.remove('video-range--hidden');
            const youtubeProgressBar = document.getElementsByClassName('ytp-progress-bar')[0];

            // Pause video
            if (addNoteBtnCont.classList.contains('btnContainer--hidden')) {
              // Go back to start of time range and resume playing
              overVideo.currentTime = Number.parseInt(videoRangeInputs[0].value, 10) * 60;

              overVideo.play();
            } else {
              overVideo.pause();

              checkRangeChange(overVideo, videoRangeInputs);
            }

            // Show video control input
            videoRangeContainer.classList.remove('video-range--hidden');

            // Set video range values as current video position
            videoRangeInputs = document.getElementsByClassName('range-input');
            Array.from(videoRangeInputs).forEach(input => {
              input.value = Number.parseInt(overVideo.currentTime / 60, 10) + Number.parseFloat((((overVideo.currentTime / 60) % 1) * 0.6).toFixed(2)); // value in minutes
            });

            let position;
            // if video is an youtube video
            if (youtubeProgressBar) {
              position = await youtubeProgressBar.getBoundingClientRect();

              console.log(youtubeProgressBar.attributes['aria-valuetext']);
              const videoPercentage = youtubeProgressBar.attributes['aria-valuenow'].nodeValue / youtubeProgressBar.attributes['aria-valuemax'].nodeValue;

              addNoteBtnCont.style.transform = `translate(${position.x + (position.width * videoPercentage)}px, ${position.y + position.height}px)`;
              // other videos
            } else {
              position = await overVideo.getBoundingClientRect();

              const videoPercentage = ((overVideo.currentTime * 100) / overVideo.duration) / 100;

              addNoteBtnCont.style.transform = `translate(${position.x + (position.width * videoPercentage) - ((position.x + (position.width * videoPercentage)) <= 350 ? 0 : 175)}px, ${position.y + position.height}px)`;
            }
          } else {
            addNoteBtnCont.style.transform = `translate(${coords[0]}px, ${coords[1]}px)`;
          }
        }
      }
    }
  }

  window.onkeyup = function (e) {
    if (keys.includes(e.key)) {
      if (keys.length) {
        keys.pop();
      }
    }
  }

  function clearKeys() {
    keys.length = 0;
  }

  window.onblur = clearKeys;
  // End get key commands to show button

  // getting elements from the DOM
  const div = document.createElement("div");
  div.className = 'className';
  div.appendChild(addNoteBtnContainer);
  // always use appendChild and not innerHTML directly in existing page elements, 
  // otherwise it can make the page stop working
  document.body.appendChild(div);

  addNoteBtnCont = document.getElementById('addNoteBtnContainer');
  addNoteBtn = document.getElementById('addNoteBtn');
  noteTypeBtns = document.getElementById('noteTypes');
  noteTypeBtnList = document.getElementsByClassName('noteTypeBtn');
  videoRangeInputs = document.getElementsByClassName('range-input');
  textInputContainer = document.getElementById('textInputContainer');
  videoInputContainer = document.getElementById('videoInputContainer');
  
  addNoteBtn.addEventListener('click', e => {
    if (noteTypeBtns) {
      document.getElementsByClassName('note-btn-list')[0].classList.remove('remove');
      noteTypeBtns.classList.remove('row--hidden');
      noteTypeBtns.classList.remove('hidden');
    };
  });

  // Check if there's video at the page
  videoPlayers = document.getElementsByTagName('video');
  Array.from(videoPlayers).forEach(videoPlayer => {
    const position = videoPlayer.getBoundingClientRect();

    videoPlayersLocation.push({
      x: {
        start: position.x,
        end: position.x + position.width,
      },
      y: {
        start: position.y,
        end: position.y + position.height,
      }
    });
  });

}

// @sourceURL=contentScript.js 