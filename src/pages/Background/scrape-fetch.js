let currRaw = null;

async function scrapeInstagram(IgMapper) {
  chrome.storage.session.get(['userId', 'config'], async function (result) {
    var config = result['config'];
    const response = await fetch(
      'http://' + config['remote-address'] + '/api/scrapeInstagram',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,

          'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(IgMapper),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        if (resp === true) {
          chrome.runtime.sendMessage({
            msg: 'scrapeIgSetup',
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

// downloadIGRecent
async function downloadIGRecent(data) {
  chrome.storage.session.get(['userId', 'config'], async function (result) {
    var config = result['config'];
    const response = await fetch(
      'http://' +
        config['remote-address'] +
        '/api/myIgScrapes/' +
        result['userId'],
      {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,
          'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
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
              msg: 'recentIGScrapes',
              data: resp,
            });
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

async function getCurrentIGScrapeEvents() {
  // get the current userId from storage
  chrome.storage.session.get(['userId', 'config'], async function (result) {
    var config = result['config'];

    await fetch(
      'http://' +
        config['remote-address'] +
        '/api/getCurrentIGScrapeEvents/' +
        result['userId'],
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${currRaw}`,
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        // save to local session storage
        chrome.storage.session.set({ scrapeIGEvents: resp });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

async function updateIGScrape(data) {
  chrome.storage.session.get('config', async function (result) {
    const config = result['config'];

    const response = await fetch(
      'http://' + config['remote-address'] + '/api/updateIGScrape',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,

          'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        // chrome.runtime.sendMessage({
        //   reloadScrapeBuilder: "Reload scrape builder",
        // });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

async function deleteIGScrape(data) {
  chrome.storage.session.get('config', async function (result) {
    const config = result['config'];
    const response = await fetch(
      'http://' + config['remote-address'] + '/api/deleteIGScrape',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,
          'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {})
      .catch((err) => {
        console.log(err);
      });
  });
}

// downloadRecent downloads recent events from the server.
async function downloadRecent() {
  // get the current userId from storage
  chrome.storage.session.get(['userId', 'config'], async function (result) {
    await fetch(
      'http://' +
        result['config']['remote-address'] +
        '/api/myScrapes/' +
        result['userId'],
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${currRaw}`,
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
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
              msg: 'Recent scrapes',
              data: resp,
            });
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

async function getCurrentScrapeEvents() {
  // get the current userId from storage
  chrome.storage.session.get(['userId', 'config'], async function (result) {
    var config = result['config'];

    await fetch(
      'http://' +
        config['remote-address'] +
        '/api/getCurrentScrapeEvents/' +
        result['userId'],
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${currRaw}`,
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
        // save to local session storage
        chrome.storage.session.set({ scrapeEvents: resp });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

async function updateScrape(data) {
  chrome.storage.session.get('config', async function (result) {
    const config = result['config'];

    const response = await fetch(
      'http://' + config['remote-address'] + '/api/updateScrape',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,

          'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
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
  chrome.storage.session.get('config', async function (result) {
    const config = result['config'];
    const response = await fetch(
      'http://' + config['remote-address'] + '/api/deleteScrape',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,
          'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {
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
      "user_id" : userId,
      "email": userEmail
    }
    console.log(userEmail);
    var url = 'http://' + config['remote-address'] + '/api/user';
    console.log(url);
    await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,

        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    })
      .then((blob) => blob.json())
      .then((resp) => {
        console.log(resp);
        chrome.storage.session.set({
          user: JSON.stringify(resp),
        });
      })
      .catch((err) => {
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
    chrome.storage.session.get(
      ['config', 'userId', 'userEmail'],
      (response) => {
        console.log('RESPONSE');
        console.log(response);
        config = response['config'];
        userId = response['userId'];
        userEmail = response['userEmail'];

        // return the info
        resolve({
          config: config,
          userId: userId,
          userEmail: userEmail,
        });
      }
    );
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
    const blob = await fetch(
      'http://' + config['remote-address'] + '/api/scrapeBuilder',
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${currRaw}`,

          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      }
    );

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
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,

        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer',
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
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        userId: info['userId'],
        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer',
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
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
  })
    .then((blob) => blob.json())
    .then((resp) => {
      console.log(resp);
      // map the users to a list
      let users = resp.map((user) => {
        return {
          label: user,
        };
      });

      console.log(users);

      return users;
    })
    .catch((err) => {
      console.log(err);
    });
  // });
}

async function verified(data) {
  chrome.storage.session.get(['config', 'userId'], async function (result) {
    const config = result['config'];
    const userId = result['userId'];
    data['userId'] = userId;
    const response = await fetch(
      'http://' + config['remote-address'] + '/api/verified',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          Authorization: `Bearer ${currRaw}`,

          'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      }
    )
      .then((blob) => blob.json())
      .then((resp) => {});
  });
}

async function getBuilder(data) {
  var info = await getStorageInfo();
  var config = info['config'];
  var url = `http://${config['remote-address']}/api/getScrapeBuilder/${data}`;
  try {
    const blob = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        Authorization: `Bearer ${currRaw}`,
        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer',
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

export {
  scrapeInstagram,
  downloadRecent,
  scrapeBuilderPost,
  verified,
  getCurrentScrapeEvents,
  updateScrape,
  deleteScrape,
  getCurrentIGScrapeEvents,
  updateIGScrape,
  deleteIGScrape,
  downloadIGRecent,
  getUser,
  adminGetUsers,
  adminUserMaps,
  getBuilder,
  adminRecentEvents,
};
