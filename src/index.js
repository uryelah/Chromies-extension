window.onload = () => {
  setTimeout(() => {

    const x = document.getElementById("login");
    const y = document.getElementById("register");
    const z = document.getElementById("btn");
    const submitBtns = document.getElementsByClassName('submit-btn');
    const nonAuthenticatedContent = document.getElementById('auth-form');
    const authenticatedContent = document.getElementById('authenticated');

    document.getElementById('login-btn').addEventListener('click', e => {
      x.style.left = "5px";
      y.style.left = "450px";
      z.style.left = "0";
    });

    document.getElementById('register-btn').addEventListener('click', e => {
      x.style.left = "-400px";
      y.style.left = "10px";
      z.style.left = "100px";
    });

    Array.from(submitBtns).forEach(btn => {
      btn.addEventListener('click', async e => {
        // logs in the user and sends message to content that user is logged with token
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          // Send token from API here
          chrome.tabs.sendMessage(tabs[0].id, { token: "hello" }, function (response) {
            if (response.farewell === 'goodbye') {  
              nonAuthenticatedContent.classList.add('hidden');
              authenticatedContent.classList.remove('hidden');
            };
          });
        });
      });
    });
  }, 500);
};

// Check if receives message from content that user is authenticated
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension", request.authenticated);
    if (request.authenticated == "yes")
      sendResponse({ token: "hell yes" });
  }).catch(err => {
    throw err
});
