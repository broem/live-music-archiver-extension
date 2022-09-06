/* eslint-disable no-undef */
let scrapeBuilder = document.getElementById("scrapeBuilder");
let scrapeInstagram = document.getElementById("scrapeInstagram");
let deselectElements = document.getElementById("deselectElements");
let downloadRecent = document.getElementById("downloadRecent");
let selectRight = document.getElementById("selectRight");
let selectAllTaggedElements = document.getElementById(
  "selectAllTaggedElements"
);
let stopSelecting = document.getElementById("stopSelection");
let collectSelected = document.getElementById("collectSelected");
let clearSelected = document.getElementById("clearSelected");
let radioLight = document.getElementById("radioLight");
// let logOut = document.getElementById("logOut");

var currText = "";
var textIsClicked = false;

// logOut.addEventListener("click", async () => {
//   console.log("logout disabled atm");
//   chrome.runtime.sendMessage({
//     logout: "Log out",
//   });
// });

scrapeBuilder.addEventListener("mouseenter", async () => {
  selectButton.style.fill = "rgba(23, 218, 234, 1)";
  selectButtonBlue.style.fill = "rgba(23, 218, 234, 1)";
  selectButtonInner.style.fill = "rgb(252, 249, 154)";
  buttonHoverText.textContent = "Scrape Builder";
  radioLightOn();
});

scrapeBuilder.addEventListener("mouseleave", async () => {
  selectButton.style.fill = "rgb(58, 71, 71)";
  selectButtonBlue.style.fill = "rgb(91, 170, 179)";
  selectButtonInner.style.fill = "rgb(45, 54, 54)";
  buttonHoverText.textContent = "";
  radioLightOff();
});

downloadRecent.addEventListener("mouseenter", async () => {
  leftButton.style.fill = "rgb(102, 252, 76)";
  leftButtonBlue.style.fill = "rgb(102, 252, 76)";
  leftButtonInner.style.fill = "rgb(252, 249, 154)";
  buttonHoverText.textContent = "Future Use";
  radioLightOn();
});

downloadRecent.addEventListener("mouseleave", async () => {
  leftButton.style.fill = "rgb(45, 54, 54)";
  leftButtonBlue.style.fill = "rgb(91, 170, 179)";
  leftButtonInner.style.fill = "rgb(45, 54, 54)";
  buttonHoverText.textContent = "";
  radioLightOff();
});

selectRight.addEventListener("mouseenter", async () => {
  rightButton.style.fill = "rgba(218, 163, 255, 1)";
  rightButtonBlue.style.fill = "rgba(218, 163, 255, 1)";
  rightButtonInner.style.fill = "rgb(252, 249, 154)";

  // buttonHoverText.textContent = "Select right element";
  buttonHoverText.textContent = "Future Use";
  radioLightOn();
});

selectRight.addEventListener("mouseleave", async () => {
  rightButton.style.fill = "rgb(45, 54, 54)";
  rightButtonBlue.style.fill = "rgb(91, 170, 179)";
  rightButtonInner.style.fill = "rgb(45, 54, 54)";
  buttonHoverText.textContent = "";
  radioLightOff();
});

selectAllTaggedElements.addEventListener("mouseenter", async () => {
  selectAllButton.style.fill = "rgba(153, 249, 154, 1)";
  selectAllButtonBlue.style.fill = "rgba(153, 249, 154, 1)";
  selectAllButtonInner.style.fill = "rgb(252, 249, 154)";
  //  buttonHoverText.textContent = "Select all tagged elements";
  buttonHoverText.textContent = "Future Use";
  radioLightOn();
});

selectAllTaggedElements.addEventListener("mouseleave", async () => {
  selectAllButton.style.fill = "rgb(45, 54, 54)";
  selectAllButtonBlue.style.fill = "rgb(91, 170, 179)";
  selectAllButtonInner.style.fill = "rgb(45, 54, 54)";
  buttonHoverText.textContent = "";
  radioLightOff();
});

collectSelected.addEventListener("mouseenter", async () => {
  collectButton.style.fill = "rgb(255, 164, 99)";
  collectButtonBlue.style.fill = "rgb(255, 164, 99)";
  collectButtonInner.style.fill = "rgb(252, 249, 154)";
  // buttonHoverText.textContent = "Collect selected";
  buttonHoverText.textContent = "Future Use";
  radioLightOn();
});

collectSelected.addEventListener("mouseleave", async () => {
  collectButton.style.fill = "rgb(45, 54, 54)";
  collectButtonBlue.style.fill = "rgb(91, 170, 179)";
  collectButtonInner.style.fill = "rgb(45, 54, 54)";
  buttonHoverText.textContent = "";
  radioLightOff();
});

deselectElements.addEventListener("mouseenter", async () => {
  removeButton.style.fill = "rgb(209, 78, 87)";
  removeButtonBlue.style.fill = "rgb(209, 78, 87)";
  removeButtonInner.style.fill = "rgb(252, 249, 154)";
  // buttonHoverText.textContent = "Remove target";
  buttonHoverText.textContent = "Future Use";
  radioLightOn();
});

deselectElements.addEventListener("mouseleave", async () => {
  removeButton.style.fill = "rgb(45, 54, 54)";
  removeButtonBlue.style.fill = "rgb(91, 170, 179)";
  removeButtonInner.style.fill = "rgb(45, 54, 54)";
  buttonHoverText.textContent = "";
  radioLightOff();
});

stopSelecting.addEventListener("mouseenter", async () => {
  stopAllButton1.style.fill = "rgb(252, 78, 93)";
  stopAllButton2.style.fill = "rgb(252, 78, 93)";
  stopAllButton3.style.fill = "rgb(252, 249, 154)";
  // buttonHoverText.textContent = "Stop selection";
  buttonHoverText.textContent = "Future Use";
  radioLightOn();
});

stopSelecting.addEventListener("mouseleave", async () => {
  stopAllButton1.style.fill = "rgb(45, 54, 54)";
  stopAllButton2.style.fill = "rgb(91, 170, 179)";
  stopAllButton3.style.fill = "rgb(45, 54, 54)";
  buttonHoverText.textContent = "";
  radioLightOff();
});

clearSelected.addEventListener("mouseenter", async () => {
  futureButton.style.fill = "rgb(247, 114, 203)";
  futureButtonBlue.style.fill = "rgb(247, 114, 203)";
  futureButtonInner.style.fill = "rgb(252, 249, 154)";
  // buttonHoverText.textContent = "Clear selected";
  buttonHoverText.textContent = "Future Use";
  radioLightOn();
});

clearSelected.addEventListener("mouseleave", async () => {
  futureButton.style.fill = "rgb(45, 54, 54)";
  futureButtonBlue.style.fill = "rgb(91, 170, 179)";
  futureButtonInner.style.fill = "rgb(45, 54, 54)";
  buttonHoverText.textContent = "";
  radioLightOff();
});

futureUse2.addEventListener("mouseenter", async () => {
  buttonHoverText.textContent = "Future use";
  radioLightOn();
});

futureUse2.addEventListener("mouseleave", async () => {
  buttonHoverText.textContent = "";
  radioLightOff();
});

futureUse3.addEventListener("mouseenter", async () => {
  buttonHoverText.textContent = "Future use";
  radioLightOn();
});

futureUse3.addEventListener("mouseleave", async () => {
  buttonHoverText.textContent = "";
  radioLightOff();
});

scrapeInstagram.addEventListener("mouseenter", async () => {
  buttonHoverText.textContent = "Scrape Instagram";
  radioLightOn();
});

scrapeInstagram.addEventListener("mouseleave", async () => {
  buttonHoverText.textContent = "";
  radioLightOff();
});

radioLight.addEventListener("mouseenter", async () => {
  // buttonHoverText.textContent = "Insert key word";
  buttonHoverText.textContent = "Future Use";
  radioLightOn();
});

radioLight.addEventListener("mouseleave", async () => {
  if (textIsClicked === false) {
    buttonHoverText.textContent = "";
    radioLightOff();
  }
});

selectAllTaggedElements.addEventListener("click", async () => {
  // chrome.runtime.sendMessage({
  //   selectAllTaggedElements: "Select all tagged elements",
  // });
});

scrapeBuilder.addEventListener("click", async () => {
  chrome.runtime.sendMessage({
    msg: "Switch to scrape builder",
  });
});

scrapeInstagram.addEventListener("click", async () => {
  chrome.runtime.sendMessage({
    scrapeInstagram: "Scrape instagram",
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var link = document.getElementById("radioLight");
  // onClick's logic below:
  link.addEventListener("click", function () {
    textIsClicked = true;
    radioLight1.style.fill = "transparent";
    radioLight2.style.fill = "transparent";
    radioLight3.style.fill = "transparent";
    radioLight4.style.fill = "transparent";
    radioLight5.style.fill = "rgb(252, 249, 154)";
    radioLight6.style.fill = "rgb(252, 249, 154)";
    radioLight7.style.fill = "rgb(252, 249, 154)";
    radioLight8.style.fill = "rgb(252, 249, 154)";
    radioLightOuter1.style.fill = "rgb(45, 54, 54)";
    radioLightOuter2.style.fill = "rgb(45, 54, 54)";
    radioLightOuter3.style.fill = "rgb(45, 54, 54)";
    editText();
  });
});

function radioLightOff() {
  radioLight1.style.fill = "rgb(236, 231, 212)";
  radioLight1.style.fillOpacity = "0.77";
  radioLight2.style.fill = "rgb(45, 54, 54";
  radioLight3.style.fill = "rgb(45, 54, 54";
  radioLight4.style.fill = "rgb(45, 54, 54";
  radioLight5.style.fill = "rgb(91, 170, 179)";
  radioLight6.style.fill = "rgb(91, 170, 179)";
  radioLight7.style.fill = "rgb(91, 170, 179)";
  radioLight8.style.fill = "rgb(45, 54, 54)";
  radioLightOuter1.style.fill = "rgb(141, 43, 100)";
  radioLightOuter2.style.fill = "rgb(141, 43, 100)";
  radioLightOuter3.style.fill = "rgb(141, 43, 100)";
}

function radioLightOn() {
  radioLight1.style.fill = "transparent";
  radioLight2.style.fill = "transparent";
  radioLight3.style.fill = "transparent";
  radioLight4.style.fill = "transparent";
  radioLight5.style.fill = "rgb(252, 249, 154)";
  radioLight6.style.fill = "rgb(252, 249, 154)";
  radioLight7.style.fill = "rgb(252, 249, 154)";
  radioLight8.style.fill = "rgb(252, 249, 154)";
  radioLightOuter1.style.fill = "rgb(45, 54, 54)";
  radioLightOuter2.style.fill = "rgb(45, 54, 54)";
  radioLightOuter3.style.fill = "rgb(45, 54, 54)";
}

function editText() {
  var input = document.createElement("input");
  input.style.width = "400px";
  input.style.height = "40px";
  input.style.fontSize = "24px";
  input.style.fontFamily = "'Cairo', sans-serif";
  input.style.color = "white";
  input.style.backgroundColor = "rgb(45, 54, 54)";
  input.value = "";
  input.onkeyup = function (e) {
    if (["Enter", "Escape"].includes(e.key)) {
      this.blur();
      textIsClicked = false;
      chrome.storage.sync.set({ currTextKey: " " }, function () {
        console.log("Value is set to " + " ");
      });
      chrome.storage.sync.set({ currTextKey: currText }, function () {
        console.log("Value is set to " + currText);
      });

      return;
    }
    buttonHoverText.textContent = this.value;
    currText = buttonHoverText.textContent;
  };
  input.onblur = function (e) {
    textIsClicked = false;
    myforeign.remove();
  };

  var myforeign = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "foreignObject"
  );
  myforeign.setAttribute("width", "100%");
  myforeign.setAttribute("height", "100%");
  myforeign.append(input);

  svg = buttonHoverText.parentNode;
  svg.append(myforeign);
  input.focus();
}
