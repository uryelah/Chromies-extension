/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports) {

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


/***/ })

/******/ });