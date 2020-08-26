import { registerUser, loginUser } from './services/apiRequests';

window.onload = () => {
  setTimeout(() => {
    // Check if still auth
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Send token from API here
      chrome.tabs.sendMessage(tabs[0].id, { token: "check" }, function (response) {
        if (response && response.farewell === 'goodbye') {
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
    const errorsDiv = document.querySelector('.errorsDiv');
    const inputLoginUsername = document.getElementById('input-field');
    const inputRegisterUsername = document.getElementById('signup-field');

    document.getElementById('login-btn').addEventListener('click', e => {
      x.style.left = "5px";
      y.style.left = "450px";
      y.style.top = "-10px";
      z.style.left = "0";
    });

    document.getElementById('register-btn').addEventListener('click', e => {
      x.style.left = "-400px";
      y.style.left = "410px";
      y.style.top = "-10px";
      z.style.left = "100px";
    });

    Array.from(submitBtns).forEach(btn => {
      btn.addEventListener('click', async e => {
        //login
        if (btn.dataset.type === 'login') {
          const result = await loginUser(inputLoginUsername.value);
          if (result.status === 200) {
            errorsDiv.textContent = '';
            // eslint-disable-next-line no-underscore-dangle
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              // Send token from API here
              chrome.tabs.sendMessage(tabs[0].id, { token: "hello", userToken: result.data._id, limit: Date.now() + 86400000 }, function (response) {
                if (response && response.farewell === 'goodbye') {
                  nonAuthenticatedContent.classList.add('hidden');
                  authenticatedContent.classList.remove('hidden');
                };
              });
            });
            // sessionStorage.getItem('ChromieUserID');
          } else {
            errorsDiv.textContent = result.data || result.statusText;
            chrome.tabs.sendMessage(tabs[0].id, { error: result.data || result.statusText }, function (response) {
              nonAuthenticatedContent.classList.remove('hidden');
              authenticatedContent.classList.add('hidden');
            });
          }
        } else if (btn.dataset.type === 'signup') {
          //signup
          const result = await registerUser(inputRegisterUsername.value);
          if (result.status === 200) {
            errorsDiv.textContent = '';
            // eslint-disable-next-line no-underscore-dangle
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              // Send token from API here
              chrome.tabs.sendMessage(tabs[0].id, { token: "hello", userToken: result.data._id, limit: Date.now() + 86400000 }, function (response) {
                if (response && response.farewell === 'goodbye') {
                  nonAuthenticatedContent.classList.add('hidden');
                  authenticatedContent.classList.remove('hidden');
                };
              });
            });
            // sessionStorage.getItem('ChromieUserID');
          } else {
            errorsDiv.textContent = result.data || result.statusText;
            chrome.tabs.sendMessage(tabs[0].id, { error: result.data || result.statusText }, function (response) {
              nonAuthenticatedContent.classList.remove('hidden');
              authenticatedContent.classList.add('hidden');
            });
          }
        }
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