window.onload = () => {
  setTimeout(() => {
    var div = document.createElement("div");
    div.className = 'className';
    div.innerHTML = `
    <div class="modal-test">
      <h1>THis is a test!</h1>
    </div>
    `;
    // always use appendChild and not innerHTML directly in existing page elements, 
    // otherwise it can make the page stop working
    document.body.appendChild(div);
  }, 5000);
};

// @sourceURL=contentScript.js 