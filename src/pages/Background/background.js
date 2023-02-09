import * as scrape from './scrape-fetch.js';

const BRING_BACK_POP_CTX = 'BRING_BACK_POP';
let selectElementsIndex = 0;
let selectAllIndex = 0;
let submitScrape = 0;
let verify = 0;
let disableSelect = 0;
let clearSelected = 0;

let popUpTabId = 0;

var captureEvent = new Object();

captureEvent.event = {};
captureEvent.venueName = {};
captureEvent.venueAddress = {};
captureEvent.venueContactInfo = {};
captureEvent.eventTitle = {};
captureEvent.eventDesc = {};
captureEvent.images = {};
captureEvent.startDate = {};
captureEvent.endDate = {};
captureEvent.doorTime = {};
captureEvent.ticketCost = {};
captureEvent.ticketURLS = {};
captureEvent.otherPerformers = {};
captureEvent.eventURLS = {};
captureEvent.ageRequired = {};
captureEvent.facebookURL = {};
captureEvent.twitterURL = {};
captureEvent.misc = {};
captureEvent.userId = {};
captureEvent.userEmail = {};
captureEvent.frequency = {};
captureEvent.cbsa = {};
captureEvent.latitude = {};
captureEvent.longitude = {};
captureEvent.stateFips = {};
captureEvent.countyFips = {};
captureEvent.mapID = {};
captureEvent.eventDescURL = {};

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
      await chrome.windows.create({
        tabId: tab.id,
        type: 'popup',
        focused: true,
        height: 628,
        width: 628,
        // incognito, top, left, ...
      }).then(() => {
        popUpTabId = tab.id;
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
          }).catch(err => {
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

chrome.runtime.onInstalled.addListener(() => {
});

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
      "field": "incoming",
      "updator": selectElementsIndex
    }
    chrome.storage.sync.set({ selectElements : JSON.stringify(payload) });
  }

  if (request.verify === 'Verify') {
    verify += 1;
    chrome.storage.sync.set({ verify });
    // get user id and email from storage
    chrome.storage.session.get(['userId', 'userEmail'], function (result) {
      captureEvent.userId = result['userId'];
      captureEvent.userEmail = result['userEmail'];

      captureEvent.frequency = request.data.frequency;
      captureEvent.cbsa = request.data.cbsa;
      captureEvent.stateFips = request.data.stateFips;
      captureEvent.countyFips = request.data.countyFips;
      captureEvent.latitude = request.data.latitude;
      captureEvent.longitude = request.data.longitude;

      scrape.scrapeBuilderPost(captureEvent);
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

  if (request.msg === 'GetIGScrapes') {
    await scrape.getCurrentIGScrapeEvents();
  }

  // updateIGScrape handler
  if (request.msg === 'updateIGScrape') {
    // update scrape
    await scrape.updateIGScrape(request.data);
  }

  // deleteIGScrape handler
  if (request.msg === 'deleteIGScrape') {
    // delete scrape
    await scrape.deleteIGScrape(request.data);
  }

  if (request.msg === 'GetCurrentScrapes') {
    await scrape.getCurrentScrapeEvents();
  }
  // downloadRecent handler
  if (request.msg === 'Download recent') {
    // download recent
    await scrape.downloadRecent().then((recent) => {});
  }

  // downloadIGRecent handler
  if (request.msg === 'downloadIGRecent') {
    // download recent
    await scrape.downloadIGRecent().then((recent) => {});
  }

  // updateScrape handler
  if (request.msg === 'updateScrape') {
    // update scrape
    await scrape.updateScrape(request.data);
  }

  // deleteScrape handler
  if (request.msg === 'deleteScrape') {
    // delete scrape
    await scrape.deleteScrape(request.data);
  }

  if (request.msg === 'Bring back scrape builder') {
    chrome.tabs.query(
      {},
      async function (tabs) {
        var x = 0;
        tabs.forEach((tab) => {
          let findPopupMatch = substringSearch(
            'scrapeBuilder',
            tab.url
          );
          if (findPopupMatch != -1) {
            chrome.windows.update(tabs[x].windowId, { focused: true });
          }
          x++;
        });
      }
    );
  }

  if (request.clearSelected === 'Clear selected') {
    clearSelected += 1;
    chrome.storage.sync.set({ clearSelected });
    captureEvent.event = {};
    captureEvent.venueName = {};
    captureEvent.venueAddress = {};
    captureEvent.venueContactInfo = {};
    captureEvent.eventTitle = {};
    captureEvent.eventDesc = {};
    captureEvent.eventDescURL = {};
    captureEvent.images = {};
    captureEvent.startDate = {};
    captureEvent.endDate = {};
    captureEvent.doorTime = {};
    captureEvent.ticketCost = {};
    captureEvent.ticketURLS = {};
    captureEvent.otherPerformers = {};
    captureEvent.eventURLS = {};
    captureEvent.ageRequired = {};
    captureEvent.facebookURL = {};
    captureEvent.twitterURL = {};
    captureEvent.misc = {};
    captureEvent.frequency = {};
  }

  if (request.submitScrape === 'Submit scrape') {
    if (request.enable == true) {
      submitScrape += 1;
      chrome.storage.sync.set({ submitScrape });
      captureEvent.event = {};
      captureEvent.venueName = {};
      captureEvent.venueAddress = {};
      captureEvent.venueContactInfo = {};
      captureEvent.eventTitle = {};
      captureEvent.eventDesc = {};
      captureEvent.eventDescURL = {};
      captureEvent.images = {};
      captureEvent.startDate = {};
      captureEvent.endDate = {};
      captureEvent.doorTime = {};
      captureEvent.ticketCost = {};
      captureEvent.ticketURLS = {};
      captureEvent.otherPerformers = {};
      captureEvent.eventURLS = {};
      captureEvent.ageRequired = {};
      captureEvent.facebookURL = {};
      captureEvent.twitterURL = {};
      captureEvent.misc = {};
      captureEvent.frequency = {};
    }
    scrape.verified({
      enabled: request.enable,
      mapID: captureEvent.mapId,
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
  if (request.msg === 'Scrape instagram') {
    console.log('scrape instagram');
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
        url: chrome.runtime.getURL('instagram.html'),
        active: false,
      },
      async function (tab) {
        // After the tab has been created, open a window to inject the tab
        await chrome.windows.create({
          tabId: tab.id,
          type: 'popup',
          focused: true,
          height: 700,
          width: 600,
        });
      }
    );
  }

  if (request.scrapeIGProfile === 'Scrape ig profile') {
    captureEvent = new Object();
    chrome.storage.session.get(['userId', 'userEmail'], function (result) {
      captureEvent['user_id'] = result['userId'];
      captureEvent['user_email'] = result['userEmail'];
      captureEvent['ig_user_name'] = request.profile;
      captureEvent['frequency'] = request.frequency;

      scrape.scrapeInstagram(captureEvent);
    });
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
