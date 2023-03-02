/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/pages/Background/background.js":
/*!********************************************!*\
  !*** ./src/pages/Background/background.js ***!
  \********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scrape_fetch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scrape-fetch.js */ "./src/pages/Background/scrape-fetch.js");
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();
var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

const BRING_BACK_POP_CTX = 'BRING_BACK_POP';
let selectElementsIndex = 0;
let highlightElementsIndex = 0;
let selectAllIndex = 0;
let disableSelect = 0;

// fetch json data from server
fetch('./config.json').then(response => response.json()).then(data => {
  // set config data to local storage
  chrome.storage.session.set({
    config: data
  }, function () {
    console.log('config data set to local storage');
    console.log('checking user');
    CheckUser();
  });
});
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('popup.html'),
    active: false
  }, async function (tab) {
    console.log('tab created');
    // After the tab has been created, open a window to inject the tab
    await chrome.windows.create({
      tabId: tab.id,
      type: 'popup',
      focused: true,
      height: 628,
      width: 628
      // incognito, top, left, ...
    }).then(() => {
      popUpTabId = tab.id;
    }).catch(err => {
      console.log(err);
    });
  });
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    tabs.forEach(tab => {
      if (tab.url != null && tab.url != undefined && tab.url.length > 0 && substringSearch('chrome', tab.url) == -1) {
        chrome.scripting.executeScript({
          target: {
            tabId: tab.id
          },
          files: ['./selectElements.js'] //, "tagElements.js"
        }).then(() => {
          console.log('selectElements.js injected');
        }).catch(err => {
          console.error(err);
        });
      }
    });
  });
  chrome.identity.getProfileUserInfo({
    accountStatus: 'ANY'
  }, function (userInfo) {
    console.log('checking user info');
    // set user id and email
    chrome.storage.session.set({
      userId: userInfo.id
    });
    chrome.storage.session.set({
      userEmail: userInfo.email
    });

    // check if user exists in database
    console.log('getting user');
    checkUser();
  });
});
async function checkUser() {
  console.log('dededeee user');
  await _scrape_fetch_js__WEBPACK_IMPORTED_MODULE_0__.getUser().then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  });
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url != null && tab.url != undefined && tab.url.length > 0 && substringSearch('chrome', tab.url) == -1) {
    chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ['selectElements.js'] //, "tagElements.js"
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {});
chrome.contextMenus.onClicked.addListener(bringBackPopContextExe);
function substringSearch(pattern, text) {
  if (pattern.length == 0) {
    return 0; // Immediate match
  }

  var lsp = [0];
  for (var i = 1; i < pattern.length; i++) {
    var j = lsp[i - 1];
    while (j > 0 && pattern.charAt(i) != pattern.charAt(j)) j = lsp[j - 1];
    if (pattern.charAt(i) == pattern.charAt(j)) j++;
    lsp.push(j);
  }
  var j = 0;
  for (var i = 0; i < text.length; i++) {
    while (j > 0 && text.charAt(i) != pattern.charAt(j)) j = lsp[j - 1];
    if (text.charAt(i) == pattern.charAt(j)) {
      j++;
      if (j == pattern.length) return i - (j - 1);
    }
  }
  return -1; // Not found
}

chrome.storage.session.setAccessLevel({
  accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS'
});
function CheckUser() {
  console.log('check user');
  chrome.storage.session.get(['userId'], function (result) {
    console.log(result);
  });
}
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.selectElements === 'Select elements') {
    console.log('select elements');
    selectElementsIndex += 1;
    let payload = {
      field: request.field,
      label: request.label,
      updator: selectElementsIndex
    };
    chrome.storage.sync.set({
      selectElements: JSON.stringify(payload)
    });
  }
  if (request.msg === 'removeElement') {
    selectElementsIndex += 1;
    let payload = {
      field: request.field,
      updator: selectElementsIndex
    };
    chrome.storage.sync.set({
      removeElement: JSON.stringify(payload)
    });
  }
  if (request.msg === 'openTab') {
    chrome.tabs.create({
      url: request.url
    }).then(tab => {
      console.log('tab created');
      // inject selectElements.js
      chrome.scripting.executeScript({
        target: {
          tabId: tab.id
        },
        files: ['selectElements.js']
      });
    });
  }
  if (request.msg === 'highlightElements') {
    console.log('highlight elements');
    // get highlightElementsIndex from storage
    chrome.storage.sync.get(['highlightElements'], function (result) {
      elems = JSON.parse(result);
      highlightElementsIndex = elems.updator;
    });
    highlightElementsIndex += 1;
    let payload = {
      highlightElements: request.data,
      updator: highlightElementsIndex
    };
    chrome.storage.sync.set({
      highlightElements: JSON.stringify(payload)
    });
  }
  if (request.selectAllTaggedElements === 'Select all tagged elements') {
    selectAllIndex += 1;
    chrome.storage.sync.set({
      selectAllIndex
    });
  }
  if (request.disableSelect === 'Disable select') {
    disableSelect += 1;
    chrome.storage.sync.set({
      disableSelect
    });
  }
  if (request.msg === 'GetIGScrapes') {
    await _scrape_fetch_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentIGScrapeEvents();
  }

  // updateIGScrape handler
  if (request.msg === 'updateIGScrape') {
    // update scrape
    await _scrape_fetch_js__WEBPACK_IMPORTED_MODULE_0__.updateIGScrape(request.data);
  }

  // deleteIGScrape handler
  if (request.msg === 'deleteIGScrape') {
    // delete scrape
    await _scrape_fetch_js__WEBPACK_IMPORTED_MODULE_0__.deleteIGScrape(request.data);
  }
  if (request.msg === 'GetCurrentScrapes') {
    await _scrape_fetch_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentScrapeEvents();
  }
  // downloadRecent handler
  if (request.msg === 'Download recent') {
    // download recent
    await _scrape_fetch_js__WEBPACK_IMPORTED_MODULE_0__.downloadRecent().then(recent => {});
  }

  // downloadIGRecent handler
  if (request.msg === 'downloadIGRecent') {
    // download recent
    await _scrape_fetch_js__WEBPACK_IMPORTED_MODULE_0__.downloadIGRecent().then(recent => {});
  }

  // updateScrape handler
  if (request.msg === 'updateScrape') {
    // update scrape
    await _scrape_fetch_js__WEBPACK_IMPORTED_MODULE_0__.updateScrape(request.data);
  }

  // deleteScrape handler
  if (request.msg === 'deleteScrape') {
    // delete scrape
    await _scrape_fetch_js__WEBPACK_IMPORTED_MODULE_0__.deleteScrape(request.data);
  }
  if (request.msg === 'Bring back scrape builder') {
    chrome.tabs.query({}, async function (tabs) {
      var x = 0;
      tabs.forEach(tab => {
        let findPopupMatch = substringSearch('scrapeBuilder', tab.url);
        if (findPopupMatch != -1) {
          chrome.windows.update(tabs[x].windowId, {
            focused: true
          });
        }
        x++;
      });
    });
  }
  if (request.msg === 'Bring back popup') {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function (tabs) {
      // and use that tab to fill in out title and url
      var tab = tabs[0];
      chrome.tabs.remove(tab.id);
    });
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup.html'),
      active: false
    }, async function (tab) {
      // After the tab has been created, open a window to inject the tab
      await chrome.windows.create({
        tabId: tab.id,
        type: 'popup',
        focused: true,
        height: 628,
        width: 628
        // incognito, top, left, ...w
      });
    });

    disableSelect += 1;
    chrome.storage.sync.set({
      disableSelect
    });
  }
  if (request.msg === 'Bring up active tab') {
    chrome.tabs.query({
      active: true,
      currentWindow: false
    }, async function (tabs) {
      var x = 0;
      tabs.forEach(tab => {
        let findActiveMatch = substringSearch(sender.url, tab.url);
        if (findActiveMatch != -1) {
          chrome.windows.update(tabs[x].windowId, {
            focused: true
          });
        }
        x++;
      });
    });
  }
});
function bringBackPopContextExe(info, tab) {
  if (info.menuItemId !== BRING_BACK_POP_CTX) {
    return;
  }
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.scripting.executeScript({
      target: {
        tabId: tabs[0].id
      },
      files: ['bringBackPopContext.js']
    });
  });
}
;
(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;
  if (!reactHotLoader) {
    return;
  }
  reactHotLoader.register(BRING_BACK_POP_CTX, "BRING_BACK_POP_CTX", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\background.js");
  reactHotLoader.register(selectElementsIndex, "selectElementsIndex", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\background.js");
  reactHotLoader.register(highlightElementsIndex, "highlightElementsIndex", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\background.js");
  reactHotLoader.register(selectAllIndex, "selectAllIndex", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\background.js");
  reactHotLoader.register(disableSelect, "disableSelect", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\background.js");
  reactHotLoader.register(checkUser, "checkUser", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\background.js");
  reactHotLoader.register(substringSearch, "substringSearch", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\background.js");
  reactHotLoader.register(CheckUser, "CheckUser", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\background.js");
  reactHotLoader.register(bringBackPopContextExe, "bringBackPopContextExe", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\background.js");
})();
;
(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ }),

/***/ "./src/pages/Background/scrape-fetch.js":
/*!**********************************************!*\
  !*** ./src/pages/Background/scrape-fetch.js ***!
  \**********************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adminGetUsers": () => (/* binding */ adminGetUsers),
/* harmony export */   "adminRecentEvents": () => (/* binding */ adminRecentEvents),
/* harmony export */   "adminUserMaps": () => (/* binding */ adminUserMaps),
/* harmony export */   "deleteIGScrape": () => (/* binding */ deleteIGScrape),
/* harmony export */   "deleteScrape": () => (/* binding */ deleteScrape),
/* harmony export */   "downloadIGRecent": () => (/* binding */ downloadIGRecent),
/* harmony export */   "downloadRecent": () => (/* binding */ downloadRecent),
/* harmony export */   "getBuilder": () => (/* binding */ getBuilder),
/* harmony export */   "getCurrentIGScrapeEvents": () => (/* binding */ getCurrentIGScrapeEvents),
/* harmony export */   "getCurrentScrapeEvents": () => (/* binding */ getCurrentScrapeEvents),
/* harmony export */   "getUser": () => (/* binding */ getUser),
/* harmony export */   "scrapeBuilderPost": () => (/* binding */ scrapeBuilderPost),
/* harmony export */   "scrapeInstagram": () => (/* binding */ scrapeInstagram),
/* harmony export */   "updateIGScrape": () => (/* binding */ updateIGScrape),
/* harmony export */   "updateScrape": () => (/* binding */ updateScrape),
/* harmony export */   "verified": () => (/* binding */ verified)
/* harmony export */ });
/* module decorator */ module = __webpack_require__.hmd(module);
(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();
var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};
let currRaw = null;
async function scrapeInstagram(IgMapper) {
  chrome.storage.session.get(['userId', 'config'], async function (result) {
    var config = result['config'];
    const response = await fetch('http://' + config['remote-address'] + '/api/scrapeInstagram', {
      method: 'POST',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(IgMapper)
    }).then(blob => blob.json()).then(resp => {
      if (resp === true) {
        chrome.runtime.sendMessage({
          msg: 'scrapeIgSetup'
        });
      }
    }).catch(err => {
      console.log(err);
    });
  });
}

// downloadIGRecent
async function downloadIGRecent(data) {
  chrome.storage.session.get(['userId', 'config'], async function (result) {
    var config = result['config'];
    const response = await fetch('http://' + config['remote-address'] + '/api/myIgScrapes/' + result['userId'], {
      method: 'GET',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    }).then(blob => blob.text()).then(resp => {
      chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, function (tabs) {
        // and use that tab to fill in out title and url
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, {
          msg: 'recentIGScrapes',
          data: resp
        });
      });
    }).catch(err => {
      console.log(err);
    });
  });
}
async function getCurrentIGScrapeEvents() {
  // get the current userId from storage
  chrome.storage.session.get(['userId', 'config'], async function (result) {
    var config = result['config'];
    await fetch('http://' + config['remote-address'] + '/api/getCurrentIGScrapeEvents/' + result['userId'], {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(blob => blob.json()).then(resp => {
      // save to local session storage
      chrome.storage.session.set({
        scrapeIGEvents: resp
      });
    }).catch(err => {
      console.log(err);
    });
  });
}
async function updateIGScrape(data) {
  chrome.storage.session.get('config', async function (result) {
    const config = result['config'];
    const response = await fetch('http://' + config['remote-address'] + '/api/updateIGScrape', {
      method: 'POST',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    }).then(blob => blob.json()).then(resp => {
      // chrome.runtime.sendMessage({
      //   reloadScrapeBuilder: "Reload scrape builder",
      // });
    }).catch(err => {
      console.log(err);
    });
  });
}
async function deleteIGScrape(data) {
  chrome.storage.session.get('config', async function (result) {
    const config = result['config'];
    const response = await fetch('http://' + config['remote-address'] + '/api/deleteIGScrape', {
      method: 'POST',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    }).then(blob => blob.json()).then(resp => {}).catch(err => {
      console.log(err);
    });
  });
}

// downloadRecent downloads recent events from the server.
async function downloadRecent() {
  // get the current userId from storage
  chrome.storage.session.get(['userId', 'config'], async function (result) {
    await fetch('http://' + result['config']['remote-address'] + '/api/myScrapes/' + result['userId'], {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(blob => blob.text()).then(resp => {
      chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, function (tabs) {
        // and use that tab to fill in out title and url
        var tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, {
          msg: 'Recent scrapes',
          data: resp
        });
      });
    }).catch(err => {
      console.log(err);
    });
  });
}
async function getCurrentScrapeEvents() {
  // get the current userId from storage
  chrome.storage.session.get(['userId', 'config'], async function (result) {
    var config = result['config'];
    await fetch('http://' + config['remote-address'] + '/api/getCurrentScrapeEvents/' + result['userId'], {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(blob => blob.json()).then(resp => {
      // save to local session storage
      chrome.storage.session.set({
        scrapeEvents: resp
      });
    }).catch(err => {
      console.log(err);
    });
  });
}
async function updateScrape(data) {
  chrome.storage.session.get('config', async function (result) {
    const config = result['config'];
    const response = await fetch('http://' + config['remote-address'] + '/api/updateScrape', {
      method: 'POST',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    }).then(blob => blob.json()).then(resp => {
      // chrome.runtime.sendMessage({
      //   reloadScrapeBuilder: "Reload scrape builder",
      // });
    });
  });
}
async function deleteScrape(data) {
  chrome.storage.session.get('config', async function (result) {
    const config = result['config'];
    const response = await fetch('http://' + config['remote-address'] + '/api/deleteScrape', {
      method: 'POST',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    }).then(blob => blob.json()).then(resp => {
      console.log(resp);
    });
  });
}
async function getUser() {
  console.log('Getting user');
  chrome.storage.session.get(['userEmail', 'config', 'userId'], async function (result) {
    var config = result['config'];
    var userEmail = result['userEmail'];
    var userId = result['userId'];
    var data = {
      "user_id": userId,
      "email": userEmail
    };
    console.log(userEmail);
    var url = 'http://' + config['remote-address'] + '/api/user';
    console.log(url);
    await fetch(url, {
      method: 'POST',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    }).then(blob => blob.json()).then(resp => {
      console.log(resp);
      chrome.storage.session.set({
        user: JSON.stringify(resp)
      });
    }).catch(err => {
      console.log(err);
    });
  });
}
function getStorageInfo() {
  // create new promise
  let config = null;
  let userId = null;
  let userEmail = null;
  // get the current userId from storage
  return new Promise((resolve, reject) => {
    chrome.storage.session.get(['config', 'userId', 'userEmail'], response => {
      console.log('RESPONSE');
      console.log(response);
      config = response['config'];
      userId = response['userId'];
      userEmail = response['userEmail'];

      // return the info
      resolve({
        config: config,
        userId: userId,
        userEmail: userEmail
      });
    });
  });
}
async function scrapeBuilderPost(data) {
  let config = null;
  let userId = null;
  let userEmail = null;
  // get the current userId from storage

  let info = await getStorageInfo();
  console.log('Getting storage info');
  console.log(info);
  config = info['config'];
  data.userId = info['userId'];
  data.userEmail = info['userEmail'];
  try {
    const blob = await fetch('http://' + config['remote-address'] + '/api/scrapeBuilder', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    if (blob.status == 200) {
      const resp = await blob.json();
      console.log('good to go');
      console.log(resp);
      return resp;
    } else {
      console.log('bad status');
      return null;
    }
  } catch (err) {
    // let verifyItem = null;
    // chrome.storage.sync.set({ verifyItem });
    console.log(err);
    return null;
  }
}
async function adminUserMaps(data) {
  let info = await getStorageInfo();
  var config = info['config'];
  var url = `http://${config['remote-address']}/api/admin/userMaps/${data}`;
  try {
    const blob = await fetch(url, {
      method: 'GET',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer'
    });
    if (blob.status == 200) {
      const resp = await blob.json();
      console.log('good to go');
      console.log(resp);
      return resp;
    } else {
      console.log('bad status');
      return null;
    }
  } catch (err) {
    // let verifyItem = null;
    // chrome.storage.sync.set({ verifyItem });
    console.log(err);
    return null;
  }
}
async function adminRecentEvents(data) {
  let info = await getStorageInfo();
  var config = info['config'];
  var url = `http://${config['remote-address']}/api/admin/getEventsRecent/${data}`;
  try {
    const blob = await fetch(url, {
      method: 'GET',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        userId: info['userId'],
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer'
    });
    if (blob.status == 200) {
      const resp = await blob.json();
      return resp;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function adminGetUsers() {
  // chrome.storage.session.get(['config'], async function (result) {
  //   var config = result['config'];
  // var url = 'http://' + config['remote-address'] + '/api/admin/getUsers';
  // TODO: fix this
  var url = 'http://' + 'localhost:3424' + '/api/admin/getUsers';
  return await fetch(url, {
    method: 'GET',
    // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    // no-cors, *cors, same-origin
    cache: 'no-cache',
    // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin',
    // include, *same-origin, omit
    redirect: 'follow',
    // manual, *follow, error
    referrerPolicy: 'no-referrer'
  }).then(blob => blob.json()).then(resp => {
    console.log(resp);
    // map the users to a list
    let users = resp.map(user => {
      return {
        label: user
      };
    });
    console.log(users);
    return users;
  }).catch(err => {
    console.log(err);
  });
  // });
}

async function verified(data) {
  chrome.storage.session.get(['config', 'userId'], async function (result) {
    const config = result['config'];
    const userId = result['userId'];
    data['userId'] = userId;
    const response = await fetch('http://' + config['remote-address'] + '/api/verified', {
      method: 'POST',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    }).then(blob => blob.json()).then(resp => {});
  });
}
async function getBuilder(data) {
  var info = await getStorageInfo();
  var config = info['config'];
  var url = `http://${config['remote-address']}/api/getScrapeBuilder/${data}`;
  try {
    const blob = await fetch(url, {
      method: 'GET',
      // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      // no-cors, *cors, same-origin
      cache: 'no-cache',
      // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin',
      // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      // manual, *follow, error
      referrerPolicy: 'no-referrer'
    });
    if (blob.status == 200) {
      const resp = await blob.json();
      console.log('good to go');
      console.log(resp);
      return resp;
    } else {
      console.log('bad status');
      return null;
    }
  } catch (err) {
    // let verifyItem = null;
    // chrome.storage.sync.set({ verifyItem });
    console.log(err);
    return null;
  }
}

;
(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;
  if (!reactHotLoader) {
    return;
  }
  reactHotLoader.register(currRaw, "currRaw", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(scrapeInstagram, "scrapeInstagram", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(downloadIGRecent, "downloadIGRecent", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(getCurrentIGScrapeEvents, "getCurrentIGScrapeEvents", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(updateIGScrape, "updateIGScrape", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(deleteIGScrape, "deleteIGScrape", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(downloadRecent, "downloadRecent", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(getCurrentScrapeEvents, "getCurrentScrapeEvents", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(updateScrape, "updateScrape", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(deleteScrape, "deleteScrape", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(getUser, "getUser", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(getStorageInfo, "getStorageInfo", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(scrapeBuilderPost, "scrapeBuilderPost", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(adminUserMaps, "adminUserMaps", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(adminRecentEvents, "adminRecentEvents", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(adminGetUsers, "adminGetUsers", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(verified, "verified", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
  reactHotLoader.register(getBuilder, "getBuilder", "C:\\Users\\wacbl\\go\\src\\live-music-archiver-extension\\src\\pages\\Background\\scrape-fetch.js");
})();
;
(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("background." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("79515fd7092e72eff4f9")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "Live Music Archiver:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			};
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"background": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdateLive_Music_Archiver"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./src/pages/Background/background.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=background.bundle.js.map