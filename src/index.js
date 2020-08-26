import { registerUser, loginUser } from './services/apiRequests';

window.onload = () => {
  setTimeout(() => {
    /*
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
*/
    const loginForm = document.getElementById('loginForm');
    const inputLoginUsername = document.getElementById('userNameLogin');
    const registerForm = document.getElementById('registerForm');
    const inputRegisterUsername = document.getElementById('userNameRegister');
    const btnBackdrop = document.getElementById('btnBackdrop');
    const btnLogin = document.getElementById('loginBtn');
    const btnRegister = document.getElementById('registerBtn');
    const errorsDiv = document.querySelector('.errorsDiv');
    //const nonAuthenticatedContent = document.getElementById('auth-form');
    //const authenticatedContent = document.getElementById('authenticated');

    document.getElementById('login-btn').addEventListener('click', e => {
      loginForm.style.left = "5px";
      registerForm.style.left = "450px";
      registerForm.style.top = "-10px";
      btnBackdrop.style.left = "0";
    });

    document.getElementById('register-btn').addEventListener('click', e => {
      loginForm.style.left = "-400px";
      registerForm.style.left = "410px";
      registerForm.style.top = "-10px";
      btnBackdrop.style.left = "100px";
    });

    const userID = sessionStorage.getItem('ChromieUserID');
    if (userID) window.location.href = './dashboard.html';

    // login form onSubmit Event listener
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const result = await loginUser(inputLoginUsername.value);
      if (result.status === 200) {
        errorsDiv.textContent = '';
        // eslint-disable-next-line no-underscore-dangle
        sessionStorage.setItem('ChromieUserID', result.data._id);
        window.location.href = './dashboard.html';
        // sessionStorage.getItem('ChromieUserID');
      } else errorsDiv.textContent = result.data || result.statusText;
    });

    // registration form onSubmit Event listener
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const result = await registerUser(inputRegisterUsername.value);
      if (result.status === 200) {
        errorsDiv.textContent = '';
        // eslint-disable-next-line no-underscore-dangle
        sessionStorage.setItem('ChromieUserID', result.data._id);
        window.location.href = './dashboard.html';
        // sessionStorage.getItem('ChromieUserID');
      } else errorsDiv.textContent = result.data || result.statusText;
    });

    /*
    Array.from(submitBtns).forEach(btn => {
      btn.addEventListener('click', async e => {
        // logs in the user and sends message to content that user is logged with token
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          // Send token from API here
          chrome.tabs.sendMessage(tabs[0].id, { token: "hello" }, function (response) {
            if (response && response.farewell === 'goodbye') {
              nonAuthenticatedContent.classList.add('hidden');
              authenticatedContent.classList.remove('hidden');
            };
          });
        });
      });
    });
    */
  }, 500);
};

/*
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
*/