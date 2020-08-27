import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { addBasicNote, addMediaNote } from './services/apiRequests';

const handleScreenshot = (overVideo, overElement, coords) => {
  // Add a canva elemenst to the body
  if (overVideo) {
    let canvas = document.getElementsByTagName('canvas')[1];
    if (!canvas) {
      canvas = document.createElement('canvas');
      overVideo.parentNode.appendChild(canvas);
    }

    // set it to the same dimensions as the video
    canvas.style.height = `${100}%`;
    canvas.style.width = `${100}%`;
    canvas.height = overVideo.clientHeight;
    canvas.widWWth = overVideo.clientWidth;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(overVideo, 0, 0, overVideo.clientWidth, overVideo.clientHeight);
    overVideo.style.backgroundImage = "url(" + canvas.toDataURL() + ")";
    overVideo.style.backgroundSize = 'cover';

    // get image blob to stores
    canvas.toBlob(async function (blob) {
       const thumbnail = document.createElement('img');
      thumbnail.classList = 'thumbnail';
      thumbnail.setAttribute('width','256px');
      thumbnail.setAttribute('height','164px');
      thumbnail.style.position = 'absolute';
      thumbnail.style.left = `${coords[0]}px`;
      thumbnail.style.top = `${coords[1]}px`;
      thumbnail.style.zIndex = 100000;
      thumbnail.src = canvas.toDataURL('image/jpg');

      document.body.appendChild(thumbnail);
      setTimeout(() => {
        thumbnail.remove();
      }, 2000);
    }, { type: 'image/png' });
    return;

  } else {
    // not great, taking the screensht of the whole doc could be a better idea
    html2canvas(overElement.parentNode).then(function (canvas) {
      const id = `cnv-note-${Date.now()}`;
      canvas.setAttribute('id', id);
      canvas.style.height = `${100}%`;
      canvas.style.width = `${100}%`;
      document.body.appendChild(canvas);

      document.getElementById(id).toBlob(async function (blob) {
        const thumbnail = document.createElement('img');
        thumbnail.classList = 'thumbnail';
        thumbnail.setAttribute('width','256px');
        thumbnail.setAttribute('height','164px');
        thumbnail.style.position = 'absolute';
        thumbnail.style.left = `${coords[0]}px`;
        thumbnail.style.top = `${coords[1]}px`;
        thumbnail.style.zIndex = 100000;
        thumbnail.src = canvas.toDataURL('image/jpg');

        document.body.appendChild(thumbnail);

        setTimeout(() => {
          thumbnail.remove();
        }, 2000);

      });
    });
  }
};

const handleText = (video, input, coords) => {
  input.querySelector('#textInputBtn').onclick = async () => {
    const textContent = input.querySelector('#textInput').value;

    console.log('Video time stamps: ', video && video[0].value, video && video[1].value, textContent);

    if (!video || !video[0].value) {
      const thumbnail = document.createElement('p');
      thumbnail.innerText = textContent;
      thumbnail.classList = 'thumbnail';
      thumbnail.setAttribute('width','256px');
      thumbnail.setAttribute('height','154px');
      thumbnail.style.position = 'absolute';
      thumbnail.style.left = `${coords[0]}px`;
      thumbnail.style.top = `${coords[1]}px`;
      thumbnail.style.zIndex = 100000;
  
      document.body.appendChild(thumbnail);
  
      setTimeout(() => {
        thumbnail.remove();
      }, 2000);
    }

    input.querySelector('#textInput').value = '';

    document.getElementsByClassName('note-btn-list')[0].classList.remove('remove');

    input.classList.add('input-text--hidden');
  };
  return input.value;
};


const handleVideo = (video, input) => {
  let shouldStop = false;
  let stopped = false;
  const downloadLink = document.getElementById('download');
  const stopButton = document.getElementById('stop');
  const player = document.querySelectorAll('#player')[0];

  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then((stream) => {
      // set video player
      player.srcObject = stream;
      player.play();
      //
      const options = { mimeType: 'video/webm' };
      const mediaRecorder = new MediaRecorder(stream, options);
      var chunks = [];
      mediaRecorder.start();

      stopButton.addEventListener('click', e => {
        e.preventDefault();

        document.querySelectorAll('#player')[0].pause();
        mediaRecorder.stop();
      });

      mediaRecorder.onstop = async function (e) {
        console.log("data available after MediaRecorder called.");

        // does not work on windows media player, working on browser!
        downloadLink.href = URL.createObjectURL(new Blob(chunks, { 'type': 'video/webm; codecs=opus' }));
        const sentMedia = await addMediaNote(window.location.href, localStorage.getItem('userToken'), null, blob, null).catch(err => {

        downloadLink.download = 'acetest.webm';
      };

      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      }
    })
};


export { handleScreenshot, handleText, handleVideo };
