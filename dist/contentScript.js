const addNoteBtnContainer = document.createElement('div');
const noteTypeRow = document.createElement('div');
const videoRangeContainer = document.createElement('div');

addNoteBtnContainer.classList = 'btnContainer--hidden';
addNoteBtnContainer.setAttribute('id', 'addNoteBtnContainer');

noteTypeRow.classList = 'note-btn-list row--hidden';
noteTypeRow.setAttribute('id', 'noteTypes');

videoRangeContainer.classList = 'range-controll-group video-range--hidden';
videoRangeContainer.setAttribute('id', 'rangeControllGroup');

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

addNoteBtnContainer.appendChild(noteTypeRow);
addNoteBtnContainer.prepend(videoRangeContainer);

window.onload = () => {
  // add mouse move event listener to mouse to make button appear near it
  let addNoteBtnCont;
  let addNoteBtn;
  let noteTypeBtns;
  let noteTypeBtnList;
  let videoPlayers;
  let overVideo;
  let videoRangeInputs;

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
          overVideo = videoPlayers[i];
          nothingFound = false;
        }
      });

      if (nothingFound) {
        overVideo = false;
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

  window.onkeydown = async function (e) {
    if (!keys.includes(e.key)) {
      keys.push(e.key);
      if (keys.includes('W') && keys.includes('Shift')) {
        if (addNoteBtnCont) {
          addNoteBtnCont.classList.toggle('btnContainer--hidden');
          videoRangeContainer.classList.add('video-range--hidden');

          // if cursor on video show note options under video play controls
          if (overVideo) {
            console.log(`Video at ${overVideo.currentTime} and with total duration of ${overVideo.duration}`);
            console.log(`Video currently ${overVideo.paused ? 'paused' : 'playing'}`);

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

              const videoPercentage = ((overVideo.currentTime * 100) / overVideo.duration)/100;

              addNoteBtnCont.style.transform = `translate(${position.x + (position.width * videoPercentage) - ( (position.x + (position.width * videoPercentage)) <= 350 ? 0 : 175)}px, ${position.y + position.height}px)`;
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
    for (n in keys) {
      n = false
    };
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

  addNoteBtn.addEventListener('click', e => {
    if (noteTypeBtns) {
      noteTypeBtns.classList.toggle('row--hidden');
    };
  });

  Array.from(noteTypeBtnList).forEach(button => {
    button.addEventListener('click', e => {
      console.log(`Handle note of type: ${e.target.dataset.type}`);
    });
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
};

/*
Video in page?
Video playing?
currentTime/60 for minutes   getCurrentTime
duration/60 for minutes      getDuration

seekable

*/

// @sourceURL=contentScript.js 