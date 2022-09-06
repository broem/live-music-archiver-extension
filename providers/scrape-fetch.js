let currRaw = null;

async function scrapeInstagram(IgMapper) {
  chrome.storage.session.get(["userId", "config"], async function (result) {
    var config = result["config"];
    const response = await fetch(
      "http://" + config["remote-address"] + "/api/scrapeInstagram",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,

          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
        body: JSON.stringify(IgMapper),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        console.log(resp);
      });
  });
}

async function getCurrentIGScrapeEvents() {
  // get the current userId from storage
  chrome.storage.session.get(["userId", "config"], async function (result) {
    var config = result["config"];

    await fetch(
      "http://" +
        config["remote-address"] +
        "/api/getCurrentIGScrapeEvents/" +
        result["userId"],
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          Authorization: `Bearer ${currRaw}`,
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        // save to local session storage
        chrome.storage.session.set({ scrapeIGEvents: resp });
      });
  });
}

async function updateIGScrape(data) {
  chrome.storage.session.get("config", async function (result) {
    const config = result["config"];

    const response = await fetch(
      "http://" + config["remote-address"] + "/api/updateIGScrape",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,

          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        // chrome.runtime.sendMessage({
        //   reloadScrapeBuilder: "Reload scrape builder",
        // });
      });
  });
}

async function deleteIGScrape(data) {
  chrome.storage.session.get("config", async function (result) {
    const config = result["config"];
    const response = await fetch(
      "http://" + config["remote-address"] + "/api/deleteIGScrape",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,
          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {});
  });
}

// downloadRecent downloads recent events from the server.
async function downloadRecent() {
  // get the current userId from storage
  chrome.storage.session.get(["userId", "config"], async function (result) {
    await fetch(
      "http://" +
        result["config"]["remote-address"] +
        "/api/myScrapes/" +
        result["userId"],
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          Authorization: `Bearer ${currRaw}`,
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    )
      .then((blob) => blob.text())
      .then((resp) => {
        chrome.tabs.query(
          {
            active: true,
            lastFocusedWindow: true,
          },
          function (tabs) {
            // and use that tab to fill in out title and url
            var tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, {
              msg: "Recent scrapes",
              data: resp,
            });
          }
        );
      });
  });
}

async function getCurrentScrapeEvents() {
  // get the current userId from storage
  chrome.storage.session.get(["userId", "config"], async function (result) {
    var config = result["config"];

    await fetch(
      "http://" +
        config["remote-address"] +
        "/api/getCurrentScrapeEvents/" +
        result["userId"],
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          Authorization: `Bearer ${currRaw}`,
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        // save to local session storage
        chrome.storage.session.set({ scrapeEvents: resp });
      });
  });
}

async function updateScrape(data) {
  chrome.storage.session.get("config", async function (result) {
    const config = result["config"];

    const response = await fetch(
      "http://" + config["remote-address"] + "/api/updateScrape",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,

          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        // chrome.runtime.sendMessage({
        //   reloadScrapeBuilder: "Reload scrape builder",
        // });
      });
  });
}

async function deleteScrape(data) {
  chrome.storage.session.get("config", async function (result) {
    const config = result["config"];
    const response = await fetch(
      "http://" + config["remote-address"] + "/api/deleteScrape",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,
          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        console.log(resp);
      });
  });
}

async function scrapeBuilderPost(data) {
  chrome.storage.session.get("config", async function (result) {
    const config = result["config"];
    const response = await fetch(
      "http://" + config["remote-address"] + "/api/scrapeBuilder",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,

          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        console.log(resp);
        let verifyItem = resp;
        chrome.storage.sync.set({ verifyItem });
      });
  });
}

async function verified(data) {
  chrome.storage.session.get("config", async function (result) {
    const config = result["config"];
    const response = await fetch(
      "http://" + config["remote-address"] + "/api/verified",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,

          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        console.log(resp);
        if (resp.includes("true")) {
          console.log("was here bro");
          chrome.runtime.sendMessage({
            reloadScrapeBuilder: "Reload scrape builder",
          });
        } else {
          console.log("switch back to selecting needs to happen now");
        }
      });
  });
}

async function logoutPost() {
  chrome.storage.session.get("config", async function (result) {
    const config = result["config"];
    const response = await fetch(
      "http://" + config["remote-address"] + "/api/logout",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,

          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        console.log(resp);
        currRaw = null;
        chrome.tabs.query(
          {
            active: true,
            lastFocusedWindow: true,
          },
          function (tabs) {
            // and use that tab to fill in out title and url
            var tab = tabs[0];
            console.log(tab.url);
            chrome.tabs.remove(tab.id);
          }
        );
        chrome.tabs.create(
          {
            url: chrome.runtime.getURL("../login.html"),
            active: false,
          },
          async function (tab) {
            // After the tab has been created, open a window to inject the tab
            await chrome.windows.create({
              tabId: tab.id,
              type: "popup",
              focused: true,
              height: 628,
              width: 600,
              // incognito, top, left, ...
            });
          }
        );
      });
  });
}

async function loginRegisterPost(url, data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-searchTableData-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then((blob) => blob.json())
    .then((data) => {
      if (data && data != null) currRaw = data.token;
    });
  if (currRaw != null) {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      function (tabs) {
        // and use that tab to fill in out title and url
        var tab = tabs[0];
        console.log(tab.url);
        chrome.tabs.remove(tab.id);
      }
    );
    chrome.tabs.create(
      {
        url: chrome.runtime.getURL("../popup.html"),
        active: false,
      },
      async function (tab) {
        // After the tab has been created, open a window to inject the tab
        await chrome.windows.create({
          tabId: tab.id,
          type: "popup",
          focused: true,
          height: 470,
          width: 600,
          // incognito, top, left, ...
        });
      }
    );
    return true;
  } else {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      function (tabs) {
        // and use that tab to fill in out title and url
        var tab = tabs[0];
        console.log(tab.url);
        chrome.tabs.remove(tab.id);
      }
    );
    chrome.tabs.create(
      {
        url: chrome.runtime.getURL("../login.html"),
        active: false,
      },
      async function (tab) {
        // After the tab has been created, open a window to inject the tab
        await chrome.windows.create({
          tabId: tab.id,
          type: "popup",
          focused: true,
          height: 628,
          width: 600,
          // incognito, top, left, ...
        });
      }
    );
    return true;
  }
}

export {
  scrapeInstagram,
  downloadRecent,
  scrapeBuilderPost,
  logoutPost,
  loginRegisterPost,
  verified,
  getCurrentScrapeEvents,
  updateScrape,
  deleteScrape,
  getCurrentIGScrapeEvents,
  updateIGScrape,
  deleteIGScrape,
};
