import * as scrape from './scrape-fetch.js';

const BRING_BACK_POP_CTX = 'BRING_BACK_POP';
let selectElementsIndex = 0;
let highlightElementsIndex = 0;
let selectAllIndex = 0;
let disableSelect = 0;

// fetch json data from server
fetch('./config.json')
  .then((response) => response.json())
  .then((data) => {
    // set config data to local storage
    chrome.storage.session.set({ config: data }, function () {
      console.log('config data set to local storage');
      console.log('checking user');
      CheckUser();
    });
  });

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL('popup.html'),
      active: false,
    },
    async function (tab) {
      console.log('tab created');
      // After the tab has been created, open a window to inject the tab
      await chrome.windows
        .create({
          tabId: tab.id,
          type: 'popup',
          focused: true,
          height: 628,
          width: 628,
          // incognito, top, left, ...
        })
        .then(() => {
          popUpTabId = tab.id;
        }).catch(err => {
          console.log(err);
        });
    }
  );
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    tabs.forEach((tab) => {
      if (
        tab.url != null &&
        tab.url != undefined &&
        tab.url.length > 0 &&
        substringSearch('chrome', tab.url) == -1
      ) {
        chrome.scripting
          .executeScript({
            target: { tabId: tab.id },
            files: ['./selectElements.js'], //, "tagElements.js"
          })
          .then(() => {
            console.log('selectElements.js injected');
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  });
  chrome.identity.getProfileUserInfo(
    { accountStatus: 'ANY' },
    function (userInfo) {
      console.log('checking user info');
      // set user id and email
      chrome.storage.session.set({ userId: userInfo.id });
      chrome.storage.session.set({ userEmail: userInfo.email });

      // check if user exists in database
      console.log('getting user');
      checkUser();
    }
  );
});

async function checkUser() {
  console.log('dededeee user');
  await scrape
    .getUser()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    tab.url != null &&
    tab.url != undefined &&
    tab.url.length > 0 &&
    substringSearch('chrome', tab.url) == -1
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['selectElements.js'], //, "tagElements.js"
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {});

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
  accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
});

function CheckUser() {
  console.log('check user');
  chrome.storage.session.get(['userId'], function (result) {
    console.log(result);
  });
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.selectElements === 'Select elements') {
    console.log('select elements');
    selectElementsIndex += 1;
    let payload = {
      field: request.field,
      label: request.label,
      updator: selectElementsIndex,
    };
    chrome.storage.sync.set({ selectElements: JSON.stringify(payload) });
  }

  if (request.msg === 'removeElement') {
    selectElementsIndex += 1;
    let payload = {
      field: request.field,
      updator: selectElementsIndex,
    };
    chrome.storage.sync.set({ removeElement: JSON.stringify(payload) });
  }

  if (request.msg === 'openTab') {
    chrome.tabs.create({ url: request.url }).then((tab) => {
      console.log('tab created');
      // inject selectElements.js
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['selectElements.js'],
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
      updator: highlightElementsIndex,
    };
    chrome.storage.sync.set({
      highlightElements: JSON.stringify(payload),
    });
  }

  if (request.selectAllTaggedElements === 'Select all tagged elements') {
    selectAllIndex += 1;
    chrome.storage.sync.set({ selectAllIndex });
  }

  if (request.disableSelect === 'Disable select') {
    disableSelect += 1;
    chrome.storage.sync.set({ disableSelect });
  }

  if (request.msg === 'Bring back scrape builder') {
    chrome.tabs.query({}, async function (tabs) {
      var x = 0;
      tabs.forEach((tab) => {
        let findPopupMatch = substringSearch('scrapeBuilder', tab.url);
        if (findPopupMatch != -1) {
          chrome.windows.update(tabs[x].windowId, { focused: true });
        }
        x++;
      });
    });
  }

  if (request.msg === 'Bring back popup') {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      function (tabs) {
        // and use that tab to fill in out title and url
        var tab = tabs[0];
        chrome.tabs.remove(tab.id);
      }
    );
    chrome.tabs.create(
      {
        url: chrome.runtime.getURL('popup.html'),
        active: false,
      },
      async function (tab) {
        // After the tab has been created, open a window to inject the tab
        await chrome.windows.create({
          tabId: tab.id,
          type: 'popup',
          focused: true,
          height: 628,
          width: 628,
          // incognito, top, left, ...w
        });
      }
    );

    disableSelect += 1;
    chrome.storage.sync.set({ disableSelect });
  }

  if (request.msg === 'Bring up active tab') {
    chrome.tabs.query(
      { active: true, currentWindow: false },
      async function (tabs) {
        var x = 0;
        tabs.forEach((tab) => {
          let findActiveMatch = substringSearch(sender.url, tab.url);
          if (findActiveMatch != -1) {
            chrome.windows.update(tabs[x].windowId, { focused: true });
          }
          x++;
        });
      }
    );
  }
});

function bringBackPopContextExe(info, tab) {
  if (info.menuItemId !== BRING_BACK_POP_CTX) {
    return;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['bringBackPopContext.js'],
    });
  });
}
