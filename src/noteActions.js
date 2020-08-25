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
    canvas.width = overVideo.clientWidth;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(overVideo, 0, 0, overVideo.clientWidth, overVideo.clientHeight);
    overVideo.style.backgroundImage = "url(" + canvas.toDataURL() + ")";
    overVideo.style.backgroundSize = 'cover';
    // get image blob to stores
    canvas.toBlob(function (blob) {
      saveAs(blob, `${document.title}.png`);
    });
  } else {
    // not great, taking the screensht of the whole doc could be a better idea
    html2canvas(overElement.parentNode).then(function(canvas) {
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

export { handleScreenshot };