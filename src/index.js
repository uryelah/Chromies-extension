window.onload = () => {
  setTimeout(() => {
    // Check if still auth
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Send token from API here
      chrome.tabs.sendMessage(tabs[0].id, { token: "check" }, function (response) {
        if (response.farewell === 'goodbye') {  
          nonAuthenticatedContent.classList.add('hidden');
          authenticatedContent.classList.remove('hidden');
        };
      });
    });

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
    if (request.authenticated == "yes") {
      const nonAuthenticatedContent = document.getElementById('auth-form');
      const authenticatedContent = document.getElementById('authenticated');
      nonAuthenticatedContent && nonAuthenticatedContent.classList.add('hidden');
      authenticatedContent && authenticatedContent.classList.remove('hidden');
      sendResponse({ token: "hell yes" });
    } else if (request.loggedIn == "yes") {
      sendResponse({ token: "nice" });
      const nonAuthenticatedContent = document.getElementById('auth-form');
      const authenticatedContent = document.getElementById('authenticated');
      nonAuthenticatedContent && nonAuthenticatedContent.classList.add('hidden');
      authenticatedContent && authenticatedContent.classList.remove('hidden');
    } else if (request.loggedOut == "yes") {
      sendResponse({ token: "oh no" });
      const nonAuthenticatedContent = document.getElementById('auth-form');
      const authenticatedContent = document.getElementById('authenticated');
      nonAuthenticatedContent && nonAuthenticatedContent.classList.remove('hidden');
      authenticatedContent && authenticatedContent.classList.add('hidden');
    };
  }).catch(err => {
    throw err
});
