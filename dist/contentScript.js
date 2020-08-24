const addNoteBtnContainer = document.createElement('div');
const noteTypeRow = document.createElement('div');

addNoteBtnContainer.classList = 'btnContainer--hidden';
addNoteBtnContainer.setAttribute('id', 'addNoteBtnContainer');

noteTypeRow.classList = 'note-btn-list row--hidden';
noteTypeRow.setAttribute('id', 'noteTypes');

addNoteBtnContainer.innerHTML = `
<button type="button" class="btn-default modal-test" id="addNoteBtn">
  Add Note
</button>
`;

noteTypeRow.innerHTML = `
<button type="button" class="btn-default">
  Plain/Text
</button>
<button type="button" class="btn-default">
  Screenshot
</button>
<button type="button" class="btn-default">
  Video
</button>
`;

addNoteBtnContainer.appendChild(noteTypeRow);

window.onload = () => {
  // add mouse move event listener to mouse to make button appear near it
  let addNoteBtnCont;
  let addNoteBtn;
  let noteTypeBtns;
  const coords = [0, 0];
  const keyHash = {
    Shift: false,
    n: false,
  }

  // window events
  window.addEventListener('mousemove', e => {
    coords[0] = e.clientX;
    coords[1] = e.clientY;
  });

  // Startget key commands to get button
  const keys = []

  window.onkeydown = function (e) {
    if (!keys.includes(e.key)) {
      keys.push(e.key);
      if (keys.includes('N') && keys.includes('Shift')) {
        if (addNoteBtnCont) {
          addNoteBtnCont.classList.toggle('btnContainer--hidden');
          addNoteBtnCont.style.transform = `translate(${coords[0]}px, ${coords[1]}px)`;
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

  addNoteBtn.addEventListener('click', e => {
    if (noteTypeBtns) {
      noteTypeBtns.classList.toggle('row--hidden');
    };
  });
};

// @sourceURL=contentScript.js 