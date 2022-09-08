let setup = document.getElementById("setup");
let profiles = document.getElementById("profiles");
let back = document.getElementById("back");
var scrape = document.getElementById("scrape");
var profileText = document.getElementById("profileText");
var frequency = document.getElementById("frequency");
var downloadRecent = document.getElementById("downloadRecent");
var orginalSetup;

setup.addEventListener("click", async (event) => {
  if (!setup.classList.contains("active")) {
    event.preventDefault();
    setup.classList.add("active");
    profiles.classList.remove("active");
    var removesetup = document.getElementById("scrapersPage");
    removesetup.remove();
    document.body.appendChild(orginalSetup);
  }
});

profiles.addEventListener("click", async (event) => {
  if (!profiles.classList.contains("active")) {
    event.preventDefault();
    profiles.classList.add("active");
    setup.classList.remove("active");
    orginalSetup = document.getElementById("mainContainer");
    var tempsetup = document.getElementById("mainContainer");
    tempsetup.remove();

    var scrapersPage = document.createElement("DIV");
    scrapersPage.id = "scrapersPage";

    scrapersPage.innerHTML = `<div class="container"> 
    <div class="card" style="width: 18rem;">
     <div class="card-header">
      My Instagram Scrapers
        </div>
        <ul class="list-group list-group-flush">
        </ul>
      </div>
    </div>`;

    document.body.appendChild(scrapersPage);

    // find list-group-flush
    var listGroup = document.querySelector(".list-group-flush");

    // grab scrapeEvents from local session storage
    chrome.storage.session.get("scrapeIGEvents", function (result) {
      console.log(result);
      var scrapeEvents = result.scrapeIGEvents;
      var hadItem = false;

      if (scrapeEvents) {
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

          // deep copy scrapeEvents[i] to scrapeEventCopy
          var scrapeEventCopy = JSON.parse(JSON.stringify(scrapeEvents[i]));
          // append dropdown to list item
          frequencyDropdown.scrapeEvent = scrapeEventCopy;

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
            event.target.scrapeEvent.frequency = frequency;
            event.preventDefault();

            // update through scrape-fetch.js
            chrome.runtime.sendMessage({
              msg: "updateIGScrape",
              data: event.target.scrapeEvent,
            });
          });

          listItems.innerHTML =
            "<div><b>Profile:</b> " +
            scrapeEvents[i].profile +
            "</div>" +
            '<div><b class="freq">Frequency:</b> ' +
            "</div>" +
            '<div><b class="enabledDisplay' +
            [i] +
            '">Enabled: ' +
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
          button.specialID = i;

          button.addEventListener("click", function (event) {
            console.log(event);
            event.target.scrapeEvent.enabled =
              !event.target.scrapeEvent.enabled;

            var enabledDisplay = document.querySelector(
              ".enabledDisplay" + event.target.specialID
            );

            // change button text
            if (button.textContent === "Enable") {
              enabledDisplay.textContent = "Enabled: true";
              event.target.style.backgroundColor = "red";
              event.target.textContent = "Disable";
            } else {
              enabledDisplay.textContent = "Enabled: false";
              event.target.style.backgroundColor = "blue";
              event.target.textContent = "Enable";
            }
            event.preventDefault();

            // update through scrape-fetch.js
            chrome.runtime.sendMessage({
              msg: "updateIGScrape",
              data: event.target.scrapeEvent,
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
              msg: "deleteIGScrape",
              data: event.target.scrapeEvent,
            });
            // remove list item
            event.target.parentElement.remove();
            event.preventDefault();
          });

          // add delete button to list item
          listItems.appendChild(deleteButton);
          listGroup.appendChild(listItems);
        }
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

back.addEventListener("click", async () => {
  chrome.runtime.sendMessage({
    msg: "Bring back popup",
  });
});

scrape.addEventListener("click", async () => {
  var profile = profileText.value;
  // get the frequency option
  var frequencyOption = frequency.options[frequency.selectedIndex].value;
  if (frequencyOption == "Schedule") {
    frequencyOption = "Every Other Day";
  }

  console.log(profile);
  console.log(frequencyOption);
  if (profile == "") {
    alert("Please enter a profile");
  } else {
    chrome.runtime.sendMessage({
      scrapeIGProfile: "Scrape ig profile",
      profile: profile,
      frequency: frequencyOption,
    });
  }
});

// add event listener to downloadRecent
downloadRecent.addEventListener("click", async () => {
  chrome.runtime.sendMessage({
    msg: "downloadIGRecent",
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.msg === "recentIGScrapes") {
    // download recent
    // get from local storage
    console.log(message.data);
    // create reuslt url

    // string to blob
    var blob = new Blob([message.data], { type: "text/txt" });

    var resultURL = window.URL.createObjectURL(blob);
    // create download link
    var downloadLink = document.createElement("a");
    downloadLink.href = resultURL;
    downloadLink.download = "recentIG.txt";
    // click download link
    downloadLink.click();
    // download recent
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "scrapeIgSetup") {
    console.log("reloadScrapeBuilder");
    window.location.reload(true);
    alert("Scrape event added");
  }
});

chrome.runtime.sendMessage({
  msg: "GetIGScrapes",
});