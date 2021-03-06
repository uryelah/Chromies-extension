import 'canvas-toBlob';
import { handleScreenshot, handleText, handleVideo } from './noteActions';
import { currentPageNotes } from './getNotes';

const noteFactory = (note) => {
  const start = note.videoTimeStamp ? JSON.parse(note.videoTimeStamp)[0] :  '';
  const end = note.videoTimeStamp ? JSON.parse(note.videoTimeStamp)[1] :  '';
  return(`
  <div data-start=${start} data-end=${end} class="previous-note note ${note.videoTimeStamp ? 'video-note-line' : ''}" id="${note.id}">
    <p><strong>Create at: ${new Date(note.createdAt).toLocaleDateString()}</strong></p>
    ${
      note.body && `<p>${note.body}</p>`
    }
    ${
      note.imgLink && `<img src="${note.imgLink}" width="320" />`
    }
    ${
      note.videoLink && (`
      <video controls width="200px" class="video-player-video" controlslist="nodownload" playsinline="" preload="auto" tabindex="-1" src="https://cdn.loom.com/sessions/raw/9e01b7dd86034d0da7064551ee210c9b.webm?Expires=1598531357&amp;Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9jZG4ubG9vbS5jb20vc2Vzc2lvbnMvcmF3LzllMDFiN2RkODYwMzRkMGRhNzA2NDU1MWVlMjEwYzliLndlYm0iLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1OTg1MzEzNTd9fX1dfQ__&amp;Signature=NiQVAAJkCFWMoxjeR14jCBSapd6sdEFKmOr9bw6Rm419PRelJGXoiukQDmnU0rEPkts6Sa3htX26Kpl7~~zA6pV7wPDNdjgQ1ULIaGqD93nkpt5y~z~jVdJEcyB0LMWqKpUmEONaQsjmhr~V2EyzEZPGmR~Iv~DDk00hIc0X3cl0Zby8z3lXR6t0QxrG-mF6NOQWOz4fxc7mqnu~0Jp~JyLbt~Ymi0nUG0QxacnMGyxlrSj5BKRpHhpZuQ6M9q8GqaU70Gf8glBIlNcr~Tel2xEFXlv4~21fUXmXgd0OfeKbRcP7xotkTBYzvCyMBOMuUiKzjrMISnVjsUIIQ4S0jQ__&amp;Key-Pair-Id=APKAJQIC5BGSW7XXK7FQ"></video>
      `)
    }
    ${
      note.videoTimeStamp && (`
<p>Video time stamps: <em>${start} ${end}</em></p>
      `)
    }
  </div>
`)};

let userIsAuthenticated = false;
let previousNotesContainer;

chrome.storage.sync.get(['userToken'], function (result) {
  if (result.userToken) {
    userIsAuthenticated = true;
    //main();
    chrome.runtime.sendMessage({ authenticated: "yes" }, function (response) {
      console.log('Answer: ', response && response.token);
    });
  } else {
    if (localStorage.getItem('userToken')) {
      chrome.storage.sync.set({ userToken:localStorage.getItem('userToken'), limit: Date.now() + 86400000 }, function () {
        console.log('User token set as ' +localStorage.getItem('userToken'));
        if (localStorage) {
          localStorage.setItem('userToken',localStorage.getItem('userToken'));
        } 
        if (previousNotesContainer) {
          previousNotesContainer.style.display = 'block';
        }
      })
      userIsAuthenticated = true;
    }
    console.log('User is not authenticated');
  }
});

window.onload = () => {

  if (userIsAuthenticated) {
    //main();
  }
}

// Verifying if user is authenticated
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension, token: ", request && request.token);
    if (request && request.token == "hello") {
      sendResponse({ farewell: localStorage.getItem('userToken') });
      chrome.runtime.sendMessage({ loggedIn: "yes" }, function (response) {
        console.log('Answer: ', response && response.token);
        chrome.storage.sync.set({ userToken: request.userToken, limit: Date.now() + 86400000 }, function () {
          console.log('User token set as ' + request.userToken);
          localStorage && localStorage.setItem('userToken', request.userToken);
          if (previousNotesContainer) {
            previousNotesContainer.style.display = 'block';
          } 
        })
      });
      userIsAuthenticated = true;
      main();
    } else if (request && request.token == "check") {
      chrome.storage.sync.get(['userToken', 'limit'], function (result) {
        if (result.limit < Date.now()) {
          console.log('Expired token');
          chrome.storage.sync.remove(['userToken', 'limit'], () => {
            console.log('Invalid token');
          });
          chrome.runtime.sendMessage({ loggedOut: "yes" }, function (response) {
            console.log('Answer: ', response && response.token);
          });
        }

        if (result.userToken && result.limit > Date.now()) {
          userIsAuthenticated = true;
          main();
          chrome.runtime.sendMessage({ loggedIn: "yeresponses" }, function (response) {
            console.log('Answer: ', response && response.userToken);
          });
        } else {
          console.log('User is not loggedin');
          chrome.storage.sync.remove(['userToken', 'limit'], () => {
            console.log('Invalid token');
          });
          chrome.runtime.sendMessage({ loggedIn: "loggedOut" }, function (response) {
            console.log('Answer: ', response && response.token);
          });
        }
      });
    } else {
      chrome.storage.sync.remove(['userToken', 'limit'], () => {
        console.log('Invalid token');
      });
      chrome.runtime.sendMessage({ loggedIn: "loggedOut" }, function (response) {
        console.log('Answer: ', response && response.token);
      });
    }
  });

// Only execute content script if user is logged in
const main = () => {
  // Add existent page nodes to document
  const pageVideo = document.querySelector('video');
  const addNoteBtnContainer = document.createElement('div');
  const noteTypeRow = document.createElement('div');
  const videoRangeContainer = document.createElement('div');
  const textInputContainerElement = document.createElement('div');
  const videoInputElement = document.createElement('div');
  const pagesNotes = document.createElement('div');

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

  pagesNotes.setAttribute('id', 'previouslyAddedNotes');
  pagesNotes.classList = 'notes-notice notes-notice--hide';

  addNoteBtnContainer.innerHTML = `
<button type="button" class="buttao-default modal-test" id="addNoteBtn">
  Add Note
</button>
`;

  noteTypeRow.innerHTML = `
<button type="button" data-type="text" class="buttao-default noteTypeBtn">
✏️ Plain/Text
</button>
<button type="button" data-type="image" class="buttao-default noteTypeBtn">
📷 Screenshot
</button>
<button type="button" data-type="video" class="buttao-default noteTypeBtn">
🎥 Video
</button>
`;

  videoRangeContainer.innerHTML = `
  <input type="number" class="range-input" id="dataRangeMin"/>
  <input type="number" class="range-input" id="dataRangeMax"/>
`;

  textInputContainerElement.innerHTML = `
  <textarea maxlength="500" class="text-input" id="textInput"></textarea> 
  <button type="button" class="buttao-default text-input-btn" id="textInputBtn">
    Add
  </button>
  `;

  videoInputElement.innerHTML = `
  <video id="player" class="video-player" controls></video>
  <button class="buttao-default" id="stop">Stop</button>
  <a id="download" class="btn buttao-default">Download</a>
  `;

  pagesNotes.innerHTML = (`
  <button type="button" class="close-ico" id="closePagesNotes">❌</button>
  <button type="button" class="open-ico" id="normalPagesNotes">💡</button>
  <p>This page has notes...</p>
  <button class="btn buttao-default" id="showPreviousNotes">💡  Show notes</button>
  <button class="btn buttao-default buttao-secondario" id="hidePreviousNotes" type="button">Hide notes</button>
  `);

  const noteList = currentPageNotes();
  const noteItems = document.createElement('div');
  const videoNoteItems = document.createElement('div');
  videoNoteItems.setAttribute('id', 'underVideoNotes');

  noteItems.classList = 'noteItems';
  noteItems.setAttribute('id', 'noteItems');

  noteList.forEach(note => {
    // if note has video time stamp
    if (note.videoTimeStamp && pageVideo) {
      videoNoteItems.innerHTML += noteFactory(note);
    } else {
      noteItems.innerHTML += noteFactory(note);
    }
  });

  pagesNotes.appendChild(noteItems);
  
  addNoteBtnContainer.appendChild(noteTypeRow);
  addNoteBtnContainer.prepend(videoRangeContainer);
  addNoteBtnContainer.appendChild(textInputContainerElement);
  addNoteBtnContainer.appendChild(videoInputElement);
  document.body.appendChild(videoNoteItems);
  document.body.appendChild(pagesNotes);
  // getting elements from the DOM
  const div = document.createElement("div");
  div.className = 'className';
  div.appendChild(addNoteBtnContainer);
  document.body.appendChild(div);


  Array.from(videoNoteItems.children).forEach(videoNote => {
    // time in seconds
    if (window.location.host !== 'www.youtube.com') { return }

    const videoDimensions = videoNote.getBoundingClientRect();
    const fullSize = pageVideo.duration;
    const timeStamps = [videoNote.dataset.start, videoNote.dataset.end];
    const startPercentage = Number.parseInt(180, 10) / fullSize;
    console.log(videoDimensions);
    console.log(fullSize, pageVideo);
    console.log(videoNote.dataset.start)
    videoNote.style.position = 'absolute';
    videoNote.style.left = `${(startPercentage * videoDimensions.width) + videoDimensions.x <= (videoDimensions.width - 100) ? (startPercentage * videoDimensions.width) + videoDimensions.x  : (videoDimensions.width - 100)}px`;
    videoNote.style.top = `${380}px`;
    videoNote.style.display = 'block !important';
    videoNote.style.backgroundImage = 'linear-gradient(to top, #ff105f99, #ffad0699)';
    videoNote.style.padding = '3px 5px';
    videoNote.style.width = '100px';
    videoNote.style.height = '33px';
    videoNote.style.overflow = 'hidden';
    videoNote.style.textOverflow = 'ellipsis';
    console.log(`At ${startPercentage}% of the video of ${fullSize}`);
  });

  // always use appendChild and not innerHTML directly in existing page elements, 
  // otherwise it can make the page stop working

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
  let showPreviousNotes;
  let hidePreviousNotes;
  let closePagesNotes;
  let openPagesNotes;

  const videoPlayersLocation = [];
  const coords = [0, 0];

  addNoteBtnCont = document.getElementById('addNoteBtnContainer');
  addNoteBtn = document.querySelectorAll('#addNoteBtn')[1];
  noteTypeBtns = document.getElementById('noteTypes');
  noteTypeBtnList = document.getElementsByClassName('noteTypeBtn');
  videoRangeInputs = document.getElementsByClassName('range-input');
  textInputContainer = document.getElementById('textInputContainer');
  videoInputContainer = document.getElementById('videoInputContainer');
  closePagesNotes = document.querySelectorAll('#closePagesNotes')[1]; 
  openPagesNotes = document.querySelectorAll('#normalPagesNotes')[1];

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
  const keys = [];

  const checkRangeChange = (videoElement, videoRangeInputs) => {
    // Advance video when changing range max
    if (videoRangeInputs) {
      videoRangeInputs[1] && videoRangeInputs[1].addEventListener('change', e => {
        videoElement.currentTime = Number.parseInt(e.target.value, 10) * 60;
      });
    }
  }

  const noteTypeEvents = (overVideo, overElement) => {
    Array.from(noteTypeBtnList).forEach(button => {
      button && button.addEventListener('click', e => {
        const type = e.target.dataset.type;
        console.log(`Handle note of type: ${type}`);
        textInputContainer.classList.add('input-text--hidden');
        videoInputContainer.classList.add('input-video--hidden');

        if (type === 'image') {
          handleScreenshot(overVideo, overElement, coords);
        } else if (type === 'text') {
          document.getElementsByClassName('note-btn-list')[0].classList.add('hidden');
          textInputContainer.classList.remove('input-text--hidden');
          handleText(overVideo ? videoRangeInputs : false, textInputContainer, coords);
        } else if (type === 'video') {
          document.getElementsByClassName('note-btn-list')[0].classList.add('hidden');
          videoInputContainer.classList.remove('input-video--hidden');
          handleVideo(overVideo ? videoRangeInputs : false, overElement);
        }
      });
    });
  }

  addNoteBtn.addEventListener('click', e => {
    textInputContainer.classList.add('input-text--hidden');W
    document.querySelectorAll('#videoInputContainer')[1].classList.add('input-video--hidden');
    document.querySelectorAll('#videoInputContainer')[0].classList.add('input-video--hidden');
  });

  window.onkeydown = async function (e) {
    if (!keys.includes(e.key)) {
      keys.push(e.key);
      if (keys.includes('W') && keys.includes('Shift')) {
        if (addNoteBtnCont) {
          addNoteBtnCont.classList.toggle('btnContainer--hidden');

          noteTypeEvents(overVideo, overElement);

          // if cursor on video show note options under video play controls
          if (overVideo) {
            console.log(`Video at ${overVideo.currentTime} and with total duration of ${overVideo.duration}`);
            console.log(`Video currently ${overVideo.paused ? 'paused' : 'playing'}`);

            document.getElementById('rangeControllGroup').classList.remove('video-range--hidden')
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

  previousNotesContainer = document.querySelectorAll('#previouslyAddedNotes')[1];
  document.querySelectorAll('#previouslyAddedNotes')[0].display = 'none';
  showPreviousNotes = document.querySelectorAll('#showPreviousNotes')
  showPreviousNotes = document.querySelectorAll('#showPreviousNotes')[showPreviousNotes.length - 1]

  document.querySelectorAll('#showPreviousNotes')[0].style.display = 'none';
  hidePreviousNotes = document.querySelectorAll('#hidePreviousNotes')[1];


  showPreviousNotes.addEventListener('click', e => {
    document.querySelectorAll('#previouslyAddedNotes')[0].style.display = 'none';

    previousNotesContainer.classList.remove('notes-notice--hide');
    previousNotesContainer.classList.contains('hidden');
  });

  closePagesNotes && closePagesNotes.addEventListener('click', e => {
    document.querySelectorAll('#previouslyAddedNotes')[0].style.display = 'none';
    //previousNotesContainer.classList.add('hidden');
    previousNotesContainer.classList.add('notes-notice--small');
    previousNotesContainer.classList.add('notes-notice--hide');
  });

  openPagesNotes && openPagesNotes.addEventListener('click', e => {
    console.log('Open');
    previousNotesContainer.classList.remove('notes-notice--small');
  });

  hidePreviousNotes && hidePreviousNotes.addEventListener('click', e => {
    document.querySelectorAll('#previouslyAddedNotes')[0].style.display = 'none';

      previousNotesContainer.classList.add('notes-notice--hide');
  });

  document.getElementById('addNoteBtn').addEventListener('click', e => {
    console.log('WUH')
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