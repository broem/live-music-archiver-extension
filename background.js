import * as logic from "./providers/business-logic.js";
import * as scrape from "./providers/scrape-fetch.js";

const BRING_BACK_POP_CTX = "BRING_BACK_POP";
let selectElementsIndex = 0;
let selectAllIndex = 0;
let submitScrape = 0;
let verify = 0;
let disableSelect = 0;
let clearSelected = 0;

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
fetch("./config.json")
  .then((response) => response.json())
  .then((data) => {
    // set config data to local storage
    chrome.storage.session.set({ config: data }, function () {
      console.log("config data set to local storage");
    });
  });

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL("popup.html"),
      active: false,
    },
    async function (tab) {
      // After the tab has been created, open a window to inject the tab
      await chrome.windows.create({
        tabId: tab.id,
        type: "popup",
        focused: true,
        height: 628,
        width: 628,
        // incognito, top, left, ...
      });
    }
  );
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    tabs.forEach((tab) => {
      if (
        tab.url != null &&
        tab.url != undefined &&
        tab.url.length > 0 &&
        logic.substringSearch("chrome", tab.url) == -1
      ) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["selectElements.js"], //, "tagElements.js"
        });
      }
    });
  });
  chrome.identity.getProfileUserInfo(
    { accountStatus: "ANY" },
    function (userInfo) {
      // set user id and email
      chrome.storage.session.set({ userId: userInfo.id });
      chrome.storage.session.set({ userEmail: userInfo.email });
    }
  );
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    tab.url != null &&
    tab.url != undefined &&
    tab.url.length > 0 &&
    logic.substringSearch("chrome", tab.url) == -1
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["selectElements.js"], //, "tagElements.js"
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Bring back popup",
    contexts: ["all"],
    id: BRING_BACK_POP_CTX,
  });
});

chrome.contextMenus.onClicked.addListener(bringBackPopContextExe);

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.selectElements === "Select elements") {
    selectElementsIndex += 1;
    chrome.storage.sync.set({ selectElementsIndex });
  }

  if (request.verify === "Verify") {
    verify += 1;
    chrome.storage.sync.set({ verify });
    // get user id and email from storage
    chrome.storage.session.get(["userId", "userEmail"], function (result) {
      captureEvent.userId = result["userId"];
      captureEvent.userEmail = result["userEmail"];

      captureEvent.frequency = request.data.frequency;
      captureEvent.cbsa = request.data.cbsa;
      captureEvent.stateFips = request.data.stateFips;
      captureEvent.countyFips = request.data.countyFips;
      captureEvent.latitude = request.data.latitude;
      captureEvent.longitude = request.data.longitude;

      scrape.scrapeBuilderPost(captureEvent);
    });
  }

  if (request.selectAllTaggedElements === "Select all tagged elements") {
    selectAllIndex += 1;
    chrome.storage.sync.set({ selectAllIndex });
  }

  if (request.disableSelect === "Disable select") {
    disableSelect += 1;
    chrome.storage.sync.set({ disableSelect });
  }

  if (request.msg === "Switch to scrape builder") {
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
        url: chrome.runtime.getURL("scrapeBuilder.html"),
        active: false,
      },
      async function (tab) {
        // After the tab has been created, open a window to inject the tab
        await chrome.windows.create({
          tabId: tab.id,
          type: "popup",
          focused: true,
          height: 700,
          width: 600,
          // incognito, top, left, ...w
        });
      }
    );
  }

  if (request.msg === "GetIGScrapes") {
    await scrape.getCurrentIGScrapeEvents();
  }

  // updateIGScrape handler
  if (request.msg === "updateIGScrape") {
    // update scrape
    await scrape.updateIGScrape(request.data);
  }

  // deleteIGScrape handler
  if (request.msg === "deleteIGScrape") {
    // delete scrape
    await scrape.deleteIGScrape(request.data);
  }

  if (request.msg === "GetCurrentScrapes") {
    await scrape.getCurrentScrapeEvents();
  }
  // downloadRecent handler
  if (request.msg === "Download recent") {
    // download recent
    await scrape.downloadRecent().then((recent) => {});
  }

  // downloadIGRecent handler
  if (request.msg === "downloadIGRecent") {
    // download recent
    await scrape.downloadIGRecent().then((recent) => {});
  }

  // updateScrape handler
  if (request.msg === "updateScrape") {
    // update scrape
    await scrape.updateScrape(request.data);
  }

  // deleteScrape handler
  if (request.msg === "deleteScrape") {
    // delete scrape
    await scrape.deleteScrape(request.data);
  }

  if (request.msg === "Take from scrape builder obj") {
    var a = request.data.textC;
    var b = request.data.innerH;
    var c = request.data.innerT;
    var d = request.data.cName;
    var e = request.data.tagName;
    var f = request.data.url;

    if (request.data.addThisTitle === "Event Area") {
      captureEvent.event["textContent"] = a;
      captureEvent.event["innerHTML"] = b;
      captureEvent.event["innerText"] = c;
      captureEvent.event["className"] = d;
      captureEvent.event["tagName"] = e;
      captureEvent.event["url"] = f;
    } else if (request.data.addThisTitle === "Venue Name") {
      captureEvent.venueName["textContent"] = a;
      captureEvent.venueName["innerHTML"] = b;
      captureEvent.venueName["innerText"] = c;
      captureEvent.venueName["className"] = d;
      captureEvent.venueName["tagName"] = e;
      captureEvent.venueName["url"] = f;
    } else if (request.data.addThisTitle === "Venue Address") {
      captureEvent.venueAddress["textContent"] = a;
      captureEvent.venueAddress["innerHTML"] = b;
      captureEvent.venueAddress["innerText"] = c;
      captureEvent.venueAddress["className"] = d;
      captureEvent.venueAddress["tagName"] = e;
      captureEvent.venueAddress["url"] = f;
    } else if (request.data.addThisTitle === "Venue Contact Info") {
      captureEvent.venueContactInfo["textContent"] = a;
      captureEvent.venueContactInfo["innerHTML"] = b;
      captureEvent.venueContactInfo["innerText"] = c;
      captureEvent.venueContactInfo["className"] = d;
      captureEvent.venueContactInfo["tagName"] = e;
      captureEvent.venueContactInfo["url"] = f;
    } else if (request.data.addThisTitle === "Event Title") {
      captureEvent.eventTitle["textContent"] = a;
      captureEvent.eventTitle["innerHTML"] = b;
      captureEvent.eventTitle["innerText"] = c;
      captureEvent.eventTitle["className"] = d;
      captureEvent.eventTitle["tagName"] = e;
      captureEvent.eventTitle["url"] = f;
    } else if (request.data.addThisTitle === "Event Desc") {
      captureEvent.eventDesc["textContent"] = a;
      captureEvent.eventDesc["innerHTML"] = b;
      captureEvent.eventDesc["innerText"] = c;
      captureEvent.eventDesc["className"] = d;
      captureEvent.eventDesc["tagName"] = e;
      captureEvent.eventDesc["url"] = f;
    } else if (request.data.addThisTitle === "Images") {
      captureEvent.images["textContent"] = a;
      captureEvent.images["innerHTML"] = b;
      captureEvent.images["innerText"] = c;
      captureEvent.images["className"] = d;
      captureEvent.images["tagName"] = e;
      captureEvent.images["url"] = f;
    } else if (request.data.addThisTitle === "Start Date") {
      captureEvent.startDate["textContent"] = a;
      captureEvent.startDate["innerHTML"] = b;
      captureEvent.startDate["innerText"] = c;
      captureEvent.startDate["className"] = d;
      captureEvent.startDate["tagName"] = e;
      captureEvent.startDate["url"] = f;
    } else if (request.data.addThisTitle === "End Date") {
      captureEvent.endDate["textContent"] = a;
      captureEvent.endDate["innerHTML"] = b;
      captureEvent.endDate["innerText"] = c;
      captureEvent.endDate["className"] = d;
      captureEvent.endDate["tagName"] = e;
      captureEvent.endDate["url"] = f;
    } else if (request.data.addThisTitle === "Door Time") {
      captureEvent.doorTime["textContent"] = a;
      captureEvent.doorTime["innerHTML"] = b;
      captureEvent.doorTime["innerText"] = c;
      captureEvent.doorTime["className"] = d;
      captureEvent.doorTime["tagName"] = e;
      captureEvent.doorTime["url"] = f;
    } else if (request.data.addThisTitle === "Ticket Cost") {
      captureEvent.ticketCost["textContent"] = a;
      captureEvent.ticketCost["innerHTML"] = b;
      captureEvent.ticketCost["innerText"] = c;
      captureEvent.ticketCost["className"] = d;
      captureEvent.ticketCost["tagName"] = e;
      captureEvent.ticketCost["url"] = f;
    } else if (request.data.addThisTitle === "Ticket URLs") {
      captureEvent.ticketURLS["textContent"] = a;
      captureEvent.ticketURLS["innerHTML"] = b;
      captureEvent.ticketURLS["innerText"] = c;
      captureEvent.ticketURLS["className"] = d;
      captureEvent.ticketURLS["tagName"] = e;
      captureEvent.ticketURLS["url"] = f;
    } else if (request.data.addThisTitle === "Other Performers") {
      captureEvent.otherPerformers["textContent"] = a;
      captureEvent.otherPerformers["innerHTML"] = b;
      captureEvent.otherPerformers["innerText"] = c;
      captureEvent.otherPerformers["className"] = d;
      captureEvent.otherPerformers["tagName"] = e;
      captureEvent.otherPerformers["url"] = f;
    } else if (request.data.addThisTitle === "Event Desc URL") {
      captureEvent.eventDescURL["textContent"] = a;
      captureEvent.eventDescURL["innerHTML"] = b;
      captureEvent.eventDescURL["innerText"] = c;
      captureEvent.eventDescURL["className"] = d;
      captureEvent.eventDescURL["tagName"] = e;
      captureEvent.eventDescURL["url"] = f;
    } else if (request.data.addThisTitle === "Age Required") {
      captureEvent.ageRequired["textContent"] = a;
      captureEvent.ageRequired["innerHTML"] = b;
      captureEvent.ageRequired["innerText"] = c;
      captureEvent.ageRequired["className"] = d;
      captureEvent.ageRequired["tagName"] = e;
      captureEvent.ageRequired["url"] = f;
    } else if (request.data.addThisTitle === "Facebook URL") {
      captureEvent.facebookURL["textContent"] = a;
      captureEvent.facebookURL["innerHTML"] = b;
      captureEvent.facebookURL["innerText"] = c;
      captureEvent.facebookURL["className"] = d;
      captureEvent.facebookURL["tagName"] = e;
      captureEvent.facebookURL["url"] = f;
    } else if (request.data.addThisTitle === "Twitter URL") {
      captureEvent.twitterURL["textContent"] = a;
      captureEvent.twitterURL["innerHTML"] = b;
      captureEvent.twitterURL["innerText"] = c;
      captureEvent.twitterURL["className"] = d;
      captureEvent.twitterURL["tagName"] = e;
      captureEvent.twitterURL["url"] = f;
    } else if (request.data.addThisTitle === "Misc") {
      captureEvent.misc["textContent"] = a;
      captureEvent.misc["innerHTML"] = b;
      captureEvent.misc["innerText"] = c;
      captureEvent.misc["className"] = d;
      captureEvent.misc["tagName"] = e;
      captureEvent.misc["url"] = f;
    }
  }

  if (request.msg === "Bring back scrape builder") {
    chrome.tabs.query(
      { active: true, currentWindow: false },
      async function (tabs) {
        var x = 0;
        tabs.forEach((tab) => {
          let findPopupMatch = logic.substringSearch(
            "scrapeBuilder.html",
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

  if (request.clearSelected === "Clear selected") {
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

  if (request.submitScrape === "Submit scrape") {
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

  if (request.msg === "Bring back popup") {
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
        url: chrome.runtime.getURL("popup.html"),
        active: false,
      },
      async function (tab) {
        // After the tab has been created, open a window to inject the tab
        await chrome.windows.create({
          tabId: tab.id,
          type: "popup",
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

  if (request.msg === "Bring up active tab") {
    chrome.tabs.query(
      { active: true, currentWindow: false },
      async function (tabs) {
        var x = 0;
        tabs.forEach((tab) => {
          let findActiveMatch = logic.substringSearch(sender.url, tab.url);
          if (findActiveMatch != -1) {
            chrome.windows.update(tabs[x].windowId, { focused: true });
          }
          x++;
        });
      }
    );
  }
  if (request.scrapeInstagram === "Scrape instagram") {
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
        url: chrome.runtime.getURL("instagram.html"),
        active: false,
      },
      async function (tab) {
        // After the tab has been created, open a window to inject the tab
        await chrome.windows.create({
          tabId: tab.id,
          type: "popup",
          focused: true,
          height: 700,
          width: 600,
        });
      }
    );
  }

  if (request.scrapeIGProfile === "Scrape ig profile") {
    captureEvent = new Object();
    chrome.storage.session.get(["userId", "userEmail"], function (result) {
      captureEvent["user_id"] = result["userId"];
      captureEvent["user_email"] = result["userEmail"];
      captureEvent["ig_user_name"] = request.profile;
      captureEvent["frequency"] = request.frequency;

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
      files: ["bringBackPopContext.js"],
    });
  });
}
