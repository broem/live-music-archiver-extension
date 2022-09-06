/* eslint-disable no-inner-declarations */
var mainDisplayText = document.getElementById("mainDisplay");
let profiles = document.getElementById("scrapers");
let sb = document.getElementById("sb");
let selectElements = document.getElementById("selectElements");
let verify = document.getElementById("verify");
let downloadRecent = document.getElementById("downloadRecent");
let back = document.getElementById("back");
let submitScrape = document.getElementById("submitScrape");
let disableSelect = document.getElementById("disableSelect");
let clearSelected = document.getElementById("clearSelected");
let cancel = document.getElementById("cancel");
let eventArea = document.getElementById("eventArea");
let venueName = document.getElementById("venueName");
let venueAddress = document.getElementById("venueAddress");
let venueContactInfo = document.getElementById("venueContactInfo");
let eventTitle = document.getElementById("eventTitle");
let eventDesc = document.getElementById("eventDesc");
let images = document.getElementById("images");
let startDate = document.getElementById("startDate");
let endDate = document.getElementById("endDate");
let doorTime = document.getElementById("doorTime");
let ticketCost = document.getElementById("ticketCost");
let ticketURLs = document.getElementById("ticketURLs");
let otherPerformers = document.getElementById("otherPerformers");
let eventURLs = document.getElementById("eventURLs");
let ageRequired = document.getElementById("ageRequired");
let facebookURL = document.getElementById("facebookURL");
let twitterURL = document.getElementById("twitterURL");
let misc = document.getElementById("misc");

let everyDay = document.getElementById("everyDay");
let everyOtherDay = document.getElementById("everyOtherDay");
let everyWeek = document.getElementById("everyWeek");
let everyOtherWeek = document.getElementById("everyOtherWeek");
let everyMonth = document.getElementById("everyMonth");

let eventButton = document.getElementById("eventButton");
let frequencyButton = document.getElementById("frequencyButton");

var orginalSb;
var item = "";
var frequency = "";

var selectedItems = [];

eventButton.textContent = "Event Options";
//var setTitle = document.getElementById("setTitle");

var textC = "";
var innerH = "";
var innerT = "";
var cName = "";
var tagName = "";
var url = "";
var scrapeItemRecieved = false;

sb.addEventListener("click", async (event) => {
  if (!sb.classList.contains("active")) {
    event.preventDefault();
    sb.classList.add("active");
    profiles.classList.remove("active");
    var removeSb = document.getElementById("scrapersPage");
    removeSb.remove();
    document.body.appendChild(orginalSb);
  }
});

profiles.addEventListener("click", async (event) => {
  if (!profiles.classList.contains("active")) {
    event.preventDefault();
    profiles.classList.add("active");
    sb.classList.remove("active");
    orginalSb = document.getElementById("mainContainer");
    var tempSb = document.getElementById("mainContainer");
    tempSb.remove();

    var scrapersPage = document.createElement("DIV");
    scrapersPage.id = "scrapersPage";

    scrapersPage.innerHTML = `<div class="container"> 
    <div class="card" style="width: 18rem;">
     <div class="card-header">
      My Event Scrapers
        </div>
        <ul class="list-group list-group-flush">
        </ul>
      </div>
    </div>`;

    document.body.appendChild(scrapersPage);

    // find list-group-flush
    var listGroup = document.querySelector(".list-group-flush");

    // grab scrapeEvents from local session storage
    chrome.storage.session.get("scrapeEvents", function (result) {
      var scrapeEvents = result.scrapeEvents;
      var hadItem = false;

      // loop through scrapeEvents
      for (var i = 0; i < scrapeEvents.length; i++) {
        hadItem = true;
        // create list item
        var listItems = document.createElement("LI");
        listItems.classList.add("list-group-item");
        // make freuency dropdown menu
        var frequencyDropdown = document.createElement("SELECT");
        frequencyDropdown.classList.add("form-select");
        frequencyDropdown.classList.add("frequencyDropdown");
        // make option for every day
        var everyDayOption = document.createElement("OPTION");
        everyDayOption.value = "Every Day";
        everyDayOption.textContent = "Every Day";
        // make option for every other day
        var everyOtherDayOption = document.createElement("OPTION");
        everyOtherDayOption.value = "Every Other Day";
        everyOtherDayOption.textContent = "Every Other Day";
        // make option for every week
        var everyWeekOption = document.createElement("OPTION");
        everyWeekOption.value = "Every Week";
        everyWeekOption.textContent = "Every Week";
        // make option for every other week
        var everyOtherWeekOption = document.createElement("OPTION");
        everyOtherWeekOption.value = "Every Other Week";
        everyOtherWeekOption.textContent = "Every Other Week";
        // make option for every month
        var everyMonthOption = document.createElement("OPTION");
        everyMonthOption.value = "Every Month";
        everyMonthOption.textContent = "Every Month";
        // append options to dropdown
        frequencyDropdown.appendChild(everyDayOption);
        frequencyDropdown.appendChild(everyOtherDayOption);
        frequencyDropdown.appendChild(everyWeekOption);
        frequencyDropdown.appendChild(everyOtherWeekOption);
        frequencyDropdown.appendChild(everyMonthOption);
        // append dropdown to list item
        frequencyDropdown.scrapeEvent = scrapeEvents[i];

        // set frequency dropdown to correct value
        if (scrapeEvents[i].frequency === "Every Day") {
          frequencyDropdown.value = "Every Day";
        } else if (scrapeEvents[i].frequency === "Every Other Day") {
          frequencyDropdown.value = "Every Other Day";
        } else if (scrapeEvents[i].frequency === "Every Week") {
          frequencyDropdown.value = "Every Week";
        } else if (scrapeEvents[i].frequency === "Every Other Week") {
          frequencyDropdown.value = "Every Other Week";
        } else if (scrapeEvents[i].frequency === "Every Month") {
          frequencyDropdown.value = "Every Month";
        }

        // add event listener to frequency dropdown
        frequencyDropdown.addEventListener("change", function (event) {
          console.log("frequencyDropdown change event");
          // get value of dropdown
          var frequency = event.target.value;

          // update scrapeEvent
          frequencyDropdown.scrapeEvent.frequency = frequency;
          event.preventDefault();

          // update through scrape-fetch.js
          chrome.runtime.sendMessage({
            msg: "updateScrape",
            data: frequencyDropdown.scrapeEvent,
          });
        });

        listItems.innerHTML =
          "<div><b>URL:</b> " +
          scrapeEvents[i].url +
          "</div>" +
          '<div><b class="freq">Frequency:</b> ' +
          "</div>" +
          '<div><b class="enabledDisplay">Enabled: ' +
          scrapeEvents[i].enabled +
          "</b> " +
          "</div>";

        // add frequency dropdown to class=freq
        listItems.querySelector(".freq").appendChild(frequencyDropdown);

        // add button to list item
        var button = document.createElement("BUTTON");
        button.classList.add("btn", "btn-primary");
        // text for button enabled or disabled
        var buttonText = "";
        if (scrapeEvents[i].enabled == true) {
          button.style.backgroundColor = "red";
          buttonText = "Disable";
        } else {
          button.style.backgroundColor = "blue";
          buttonText = "Enable";
        }
        button.textContent = buttonText;
        // add scrapeEvent to button
        button.scrapeEvent = scrapeEvents[i];

        button.addEventListener("click", function (event) {
          console.log(event);
          button.scrapeEvent.enabled = !button.scrapeEvent.enabled;

          // find enabledDisplay
          var enabledDisplay =
            event.target.parentElement.querySelector(".enabledDisplay");
          // change button text
          if (button.textContent == "Enable") {
            enabledDisplay.textContent = "Enabled: true";
            button.style.backgroundColor = "red";
            button.textContent = "Disable";
          } else {
            enabledDisplay.textContent = "Enabled: false";
            button.style.backgroundColor = "blue";
            button.textContent = "Enable";
          }
          event.preventDefault();

          // update through scrape-fetch.js
          chrome.runtime.sendMessage({
            msg: "updateScrape",
            data: button.scrapeEvent,
          });
        });
        // add button to list item
        listItems.appendChild(button);

        // make delete button
        var deleteButton = document.createElement("BUTTON");
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.textContent = "Delete";
        deleteButton.scrapeEvent = scrapeEvents[i];

        deleteButton.addEventListener("click", function (event) {
          // delete scrapeEvent
          chrome.runtime.sendMessage({
            msg: "deleteScrape",
            data: deleteButton.scrapeEvent,
          });
          // remove list item
          event.target.parentElement.remove();
          event.preventDefault();
        });

        // add delete button to list item
        listItems.appendChild(deleteButton);
        listGroup.appendChild(listItems);
      }

      if (hadItem == false) {
        var listItems = document.createElement("LI");
        listItems.classList.add("list-group-item");
        listItems.textContent = "No items";
        listGroup.appendChild(listItems);
      }
    });
  }
});

everyDay.addEventListener("click", async () => {
  frequency = "Every Day";
  frequencyButton.textContent = "Every Day";
});
everyOtherDay.addEventListener("click", async () => {
  frequency = "Every Other Day";
  frequencyButton.textContent = "Every Other Day";
});
everyWeek.addEventListener("click", async () => {
  frequency = "Every Week";
  frequencyButton.textContent = "Every Week";
});
everyOtherWeek.addEventListener("click", async () => {
  frequency = "Every Other Week";
  frequencyButton.textContent = "Every Other Week";
});
everyMonth.addEventListener("click", async () => {
  frequency = "Every Month";
  frequencyButton.textContent = "Every Month";
});

eventArea.addEventListener("click", async (event) => {
  item = "Event Area";
  eventButton.textContent = "Event Area";
  checkEvent(eventArea, event);
});
venueName.addEventListener("click", async (event) => {
  item = "Venue Name";
  eventButton.textContent = "Venue Name";
  checkEvent(venueName, event);
});
venueAddress.addEventListener("click", async (event) => {
  item = "Venue Address";
  eventButton.textContent = "Venue Address";
  checkEvent(venueAddress, event);
});
venueContactInfo.addEventListener("click", async (event) => {
  item = "Venue Contact Info";
  eventButton.textContent = "Venue Contact Info";
  checkEvent(venueContactInfo, event);
});
eventTitle.addEventListener("click", async (event) => {
  item = "Event Title";
  eventButton.textContent = "Event Title";
  checkEvent(eventTitle, event);
});
eventDesc.addEventListener("click", async (event) => {
  item = "Event Desc";
  eventButton.textContent = "Event Desc";
  checkEvent(eventDesc, event);
});
images.addEventListener("click", async (event) => {
  item = "Images";
  eventButton.textContent = "Images";
  checkEvent(images, event);
});
startDate.addEventListener("click", async (event) => {
  item = "Start Date";
  eventButton.textContent = "Start Date";
  checkEvent(startDate, event);
});
endDate.addEventListener("click", async (event) => {
  item = "End Date";
  eventButton.textContent = "End Date";
  checkEvent(endDate, event);
});
doorTime.addEventListener("click", async (event) => {
  item = "Door Time";
  eventButton.textContent = "Door Time";
  checkEvent(doorTime, event);
});
ticketCost.addEventListener("click", async (event) => {
  item = "Ticket Cost";
  eventButton.textContent = "Ticket Cost";
  checkEvent(ticketCost, event);
});
ticketURLs.addEventListener("click", async (event) => {
  item = "Ticket URLs";
  eventButton.textContent = "Ticket URLs";
  checkEvent(ticketURLs, event);
});
otherPerformers.addEventListener("click", async (event) => {
  item = "Other Performers";
  eventButton.textContent = "Other Performers";
  checkEvent(otherPerformers, event);
});
eventURLs.addEventListener("click", async (event) => {
  item = "Event URLs";
  eventButton.textContent = "Event URLs";
  checkEvent(eventURLs, event);
});
ageRequired.addEventListener("click", async (event) => {
  item = "Age Required";
  eventButton.textContent = "Age Required";
  checkEvent(ageRequired, event);
});
facebookURL.addEventListener("click", async (event) => {
  item = "Facebook URL";
  eventButton.textContent = "Facebook URL";
  checkEvent(facebookURL, event);
});
twitterURL.addEventListener("click", async (event) => {
  item = "Twitter URL";
  eventButton.textContent = "Twitter URL";
  checkEvent(twitterURL, event);
});
misc.addEventListener("click", async (event) => {
  item = "Misc";
  eventButton.textContent = "Misc";
  checkEvent(misc, event);
});

function checkEvent(element, event) {
  if (scrapeItemRecieved == true) {
    addEvent(event);
    scrapeItemRecieved = false;
    element.remove();
    eventButton.textContent = "Event Options";
  } else {
    let tempText = "";
    mainDisplayText.textContent = "You have to select an item on the page.";
    setTimeout(() => {
      mainDisplayText.textContent = tempText;
    }, 3000);
    eventButton.textContent = "Event Options";
  }
}

function addEvent(event) {
  if (eventButton.textContent != "Event Options") {
    chrome.runtime.sendMessage({
      msg: "Take from scrape builder obj",
      data: {
        addThisTitle: item,
        textC: textC,
        innerH: innerH,
        innerT: innerT,
        cName: cName,
        tagName: tagName,
        url: url,
      },
    });
    if (selectedItems.includes(item)) {
      var listItems = document.querySelectorAll(".listItemContain");
      listItems.forEach((node) => {
        if (node.innerHTML.includes(item)) {
          node.remove();
        }
      });
      addTask(event);
      verify.disabled = false;
    } else if (item != "") {
      addTask(event);
      verify.disabled = false;
    }

    selectedItems.push(item);
    item = "";

    eventButton.textContent = "Event Options";
  } else {
    let tempText = mainDisplayText.textContent;
    mainDisplayText.textContent = "You have to select an event option.";
    setTimeout(() => {
      mainDisplayText.textContent = tempText;
    }, 3000);
    event.preventDefault();
  }
}

function addTask(event) {
  event.preventDefault();

  var listGenerator = document.createElement("LI");
  listGenerator.className =
    "list-group-item d-flex justify-content-between align-items-start list-item-contain";

  listGenerator.innerHTML = `<div class="ms-2 me-auto">
    <div class="fw-bold">${item}</div>
    ${innerT}
  </div>
  <span class="badge bg-primary rounded-pill">14</span>`;

  var list = document.getElementById("list");
  list.prepend(listGenerator);
}

back.addEventListener("click", async () => {
  chrome.runtime.sendMessage({
    msg: "Bring back popup",
  });
});

selectElements.addEventListener("click", async () => {
  submitScrape.disabled = true;
  cancel.disabled = true;
  chrome.runtime.sendMessage({
    selectElements: "Select elements",
  });
});

// downloadRecent downloads the most recent scrapes
downloadRecent.addEventListener("click", async () => {
  chrome.runtime.sendMessage({
    msg: "Download recent",
  });
});

// listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.msg === "Recent scrapes") {
    // download recent
    // get from local storage
    console.log(message.data);
    // create reuslt url

    // string to blob
    var blob = new Blob([message.data], { type: "text/csv" });

    var resultURL = window.URL.createObjectURL(blob);
    // create download link
    var downloadLink = document.createElement("a");
    downloadLink.href = resultURL;
    downloadLink.download = "recent.csv";
    // click download link
    downloadLink.click();
    // download recent
  }
});

verify.addEventListener("click", async (event) => {
  submitScrape.disabled = true;
  cancel.disabled = true;
  var metaData = new Object();
  if (
    frequency === "Every Day" ||
    frequency === "Every Other Day" ||
    frequency === "Every Week" ||
    frequency === "Every Other Week" ||
    frequency === "Every Month"
  ) {
    // get user input from form and pass it to background page
    var cbsa = document.getElementById("cbsa").value;
    var stateFips = document.getElementById("stateFips").value;
    var countyFips = document.getElementById("countyFips").value;

    metaData = {
      frequency: frequency,
      cbsa: cbsa,
      stateFips: stateFips,
      countyFips: countyFips,
    };

    chrome.runtime.sendMessage({
      verify: "Verify",
      data: metaData,
    });
    selectElements.disabled = true;
    verify.disabled = true;
    submitScrape.disabled = false;
    cancel.disabled = false;
  } else {
    let tempText = mainDisplayText.textContent;
    mainDisplayText.textContent =
      "You must pick how often to gather data from the site.";
    setTimeout(() => {
      mainDisplayText.textContent = tempText;
    }, 3000);
    event.preventDefault();
  }
});

disableSelect.addEventListener("click", async () => {
  chrome.runtime.sendMessage({
    disableSelect: "Disable select",
  });
});

clearSelected.addEventListener("click", async () => {
  chrome.runtime.sendMessage({
    clearSelected: "Clear selected",
  });
  window.location.reload(true);
});

submitScrape.addEventListener("click", async () => {
  chrome.runtime.sendMessage({
    submitScrape: "Submit scrape",
    enable: true,
  });
  selectElements.disabled = false;
  selectedItems.length = 0;
  verify.disabled = true;
  submitScrape.disabled = true;
  cancel.disabled = true;
  scrapeItemRecieved = false;
});

cancel.addEventListener("click", async (event) => {
  event.preventDefault();
  chrome.runtime.sendMessage({
    submitScrape: "Submit scrape",
    enable: false,
  });
  selectElements.disabled = false;
  verify.disabled = false;
  submitScrape.disabled = true;
  cancel.disabled = true;
  scrapeItemRecieved = true;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.scrapeThis === "Add to scrape builder") {
    scrapeItemRecieved = true;
    mainDisplayText.textContent = request.data.textC;
    textC = request.data.textC;
    innerH = request.data.innerH;
    innerT = request.data.innerT;
    cName = request.data.cName;
    tagName = request.data.tagName;
    url = request.data.url;
  }

  if (request.reloadScrapeBuilder === "Reload scrape builder") {
    window.location.reload(true);
  }
});

function PopupButtonClickDetector(changes, area) {
  let changedItems = Object.keys(changes);

  for (let node of changedItems) {
    if (node == "verifyItem" && area == "sync") {
      console.log(changes["verifyItem"].newValue);
      var scrape = JSON.stringify(changes["verifyItem"].newValue);
      mainDisplayText.textContent = scrape;
    }
  }
}

chrome.runtime.sendMessage({
  msg: "GetCurrentScrapes",
});

chrome.storage.onChanged.addListener(PopupButtonClickDetector);
