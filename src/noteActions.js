import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

const handleScreenshot = (overVideo, overElement) => {
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
    canvas.toBlob(function (blob) {
      saveAs(blob, `${document.title}.png`);
    });
    return;

  } else {
    // not great, taking the screensht of the whole doc could be a better idea
    html2canvas(overElement.parentNode).then(function (canvas) {
      const id = `cnv-note-${Date.now()}`;
      canvas.setAttribute('id', id);
      canvas.style.height = `${100}%`;
      canvas.style.width = `${100}%`;
      document.body.appendChild(canvas);

      document.getElementById(id).toBlob(function (blob) {
        saveAs(blob, `${overElement.ownerDocument.title}.png`);
      });
    });
  }
};

const handleText = (video, input) => {
  input.querySelector('#textInputBtn').onclick = () => {
    const textContent = input.querySelector('#textInput').value;

    console.log('Video time stamps: ', video && video[0].value, video && video[1].value, textContent);

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
  const player = document.getElementById('player');

  const handleSuccess = (stream) => {

  };

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
      console.log(mediaRecorder)

      stopButton.addEventListener('click', e => {
        e.preventDefault();

        player.stop();
        mediaRecorder.stop();
      });

      mediaRecorder.onstop = function (e) {
        console.log("data available after MediaRecorder.stop() called.");

        // does not work on windows media player, working on browser!
        downloadLink.href = URL.createObjectURL(new Blob(chunks, { 'type': 'video/webm; codecs=opus' }));
        downloadLink.download = 'acetest.webm';
      };

      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      }
    })
};


export { handleScreenshot, handleText, handleVideo };
