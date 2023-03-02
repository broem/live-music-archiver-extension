import React, { useState, useEffect, useRef } from "react";
import './home.css';

const Home = () => {
  let buttonHoverText = useRef();
  let clearSelected = useRef();
  let collectButton = useRef();
  let collectButtonBlue = useRef();
  let collectButtonInner = useRef();
  let collectSelected = useRef();
  let deselectElements = useRef();
  let downloadRecent = useRef();
  let futureUse2 = useRef();
  let futureUse3 = useRef();
  let leftButton = useRef();
  let leftButtonBlue = useRef();
  let leftButtonInner = useRef();
  let radioLight = useRef();
  let radioLight1 = useRef();
  let radioLight2 = useRef();
  let radioLight3 = useRef();
  let radioLight4 = useRef();
  let radioLight5 = useRef();
  let radioLight6 = useRef();
  let radioLight7 = useRef();
  let radioLight8 = useRef();
  let radioLightOuter1 = useRef();
  let radioLightOuter2 = useRef();
  let radioLightOuter3 = useRef();
  let scrapeBuilder = useRef();
  let scrapeInstagram = useRef();
  let selectAllTaggedElements = useRef();
  let selectButton = useRef();
  let selectButtonBlue = useRef();
  let selectButtonInner = useRef();
  let selectRight = useRef();
  let stopSelection = useRef();

  var textIsClicked = false;

  function mouseEnter(e) {
    selectButton.current.style = "fill:rgba(23, 218, 234, 1)";
    selectButtonBlue.current.style = "fill:rgba(23, 218, 234, 1)";
    selectButtonInner.current.style= "fill:rgb(252, 249, 154)";

    if (e.target.id === "selectButton") {
      buttonHoverText.current.textContent = "Scrape Builder";
    }
    if (e.target.id === "knob1Button3") {
      buttonHoverText.current.textContent = "Scrape Instagram";
    }

    radioLightOn();
  }

  function mouseLeave(e) {
    selectButton.current.style = "fill:rgb(58, 71, 71)";
    selectButtonBlue.current.style ="fill:rgb(91, 170, 179)";
    selectButtonInner.current.style = "fill:rgb(45, 54, 54)";

    buttonHoverText.current.textContent = "";
    radioLightOff();
  }

  function futureMouseEnter(e) {
    leftButton.current.style = "fill:rgb(102, 252, 76)";
    leftButtonBlue.current.style = "fill:rgb(102, 252, 76)";
    leftButtonInner.current.style = "fill:rgb(252, 249, 154)";
    buttonHoverText.current.textContent = "Future Use";

    radioLightOn();
  }

  function futureMouseLeave(e) {
    leftButton.current.style = "fill:rgb(45, 54, 54)";
    leftButtonBlue.current.style = "fill:rgb(91, 170, 179)";
    leftButtonInner.current.style = "fill:rgb(45, 54, 54)";
    buttonHoverText.current.textContent = "";

    radioLightOff();
  }

  function scrapeBuilderClick(e) {
    e.preventDefault();
    // update url
    window.history.pushState({}, "", "/scrapeBuilder");

    // communicate to Routes that URL has changed
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  }

  function scrapeInstagramClick(e) {
    console.log("scrape instagram click");

    // display the instagram scrape builder
     // prevent full page reload
     e.preventDefault();
     // update url
     window.history.pushState({}, "", "/instagram");
 
     // communicate to Routes that URL has changed
     const navEvent = new PopStateEvent('popstate');
     window.dispatchEvent(navEvent);


    // chrome.runtime.sendMessage({
    //   msg: "Scrape instagram",
    // });
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    var link = document.getElementById("radioLight");

    link.addEventListener("click", function () {
      textIsClicked = true;
      radioLight1.current.style.fill = "transparent";
      radioLight2.current.style.fill = "transparent";
      radioLight3.current.style.fill = "transparent";
      radioLight4.current.style.fill = "transparent";
      radioLight5.current.style.fill = "rgb(252, 249, 154)";
      radioLight6.current.style.fill = "rgb(252, 249, 154)";
      radioLight7.current.style.fill = "rgb(252, 249, 154)";
      radioLight8.current.style.fill = "rgb(252, 249, 154)";
      radioLightOuter1.current.style.fill = "rgb(45, 54, 54)";
      radioLightOuter2.current.style.fill = "rgb(45, 54, 54)";
      radioLightOuter3.current.style.fill = "rgb(45, 54, 54)";
      editText();
    });
  });
  
  function radioLightOff() {
    radioLight1.current.style.fill = "rgb(236, 231, 212)";
    radioLight1.current.style.fillOpacity = "0.77";
    radioLight2.current.style.fill = "rgb(45, 54, 54";
    radioLight3.current.style.fill = "rgb(45, 54, 54";
    radioLight4.current.style.fill = "rgb(45, 54, 54";
    radioLight5.current.style.fill = "rgb(91, 170, 179)";
    radioLight6.current.style.fill = "rgb(91, 170, 179)";
    radioLight7.current.style.fill = "rgb(91, 170, 179)";
    radioLight8.current.style.fill = "rgb(45, 54, 54)";
    radioLightOuter1.current.style.fill = "rgb(141, 43, 100)";
    radioLightOuter2.current.style.fill = "rgb(141, 43, 100)";
    radioLightOuter3.current.style.fill = "rgb(141, 43, 100)";
  }
  
  function radioLightOn() {
    radioLight1.current.style.fill = "transparent";
    radioLight2.current.style.fill = "transparent";
    radioLight3.current.style.fill = "transparent";
    radioLight4.current.style.fill = "transparent";
    radioLight5.current.style.fill = "rgb(252, 249, 154)";
    radioLight6.current.style.fill = "rgb(252, 249, 154)";
    radioLight7.current.style.fill = "rgb(252, 249, 154)";
    radioLight8.current.style.fill = "rgb(252, 249, 154)";
    radioLightOuter1.current.style.fill = "rgb(45, 54, 54)";
    radioLightOuter2.current.style.fill = "rgb(45, 54, 54)";
    radioLightOuter3.current.style.fill = "rgb(45, 54, 54)";
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


  return (
      <div className="container" style={{backgroundColor: "#333333"}}>
        <div className="row">
          <div className="col" style={{ marginTop: '14px', marginBottom: '14px'}}>
            <svg width="100%" height="100%" viewBox="0 0 1400 800" version="1.1" xmlns="http://www.w3.org/2000/svg"
              >
              <g transform="matrix(0.993935,0,0,1.08737,6.05782,-64.6249)">
                <rect x="23.657" y="80.878" width="1344.13" height="695.854" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1.0329,0,0,1.09217,-11.2103,-31.0234)">
                <rect x="45.316" y="54.909" width="1281.35" height="682.386" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.361326,0,0,0.963891,408.579,201.375)">
                <rect x="14.832" y="17.451" width="1567.74" height="565.098" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(0.227195,0,0,0.94941,43.7348,209.811)">
                <rect x="14.832" y="17.451" width="1567.74" height="565.098" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(0.227142,0,0,0.946771,986.858,209.857)">
                <rect x="14.832" y="17.451" width="1567.74" height="565.098" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1.07874,0,0,1.07115,919.857,-71.3177)">
                <ellipse cx="230.061" cy="578.467" rx="158.976" ry="160.103" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1.17301,0,0,1.07917,906.775,78.775)">
                <ellipse cx="222.726" cy="436.833" rx="136.454" ry="148.32" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1.41151,0,0,1.35603,843.515,-280.589)">
                <ellipse cx="229.909" cy="612.655" rx="108.538" ry="112.978" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1.33363,0,0,1.33363,-382.175,-171.905)">
                <circle cx="1157.33" cy="546.52" r="109.809" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.971636,0,0,0.893906,944.832,166.497)">
                <ellipse cx="222.726" cy="436.833" rx="136.454" ry="148.32" style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <g transform="matrix(1.07874,0,0,1.07115,-22.9811,-71.3177)">
                <ellipse cx="230.061" cy="578.467" rx="158.976" ry="160.103" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1,0,0,0.953463,-3.32054,20.4289)">
                <ellipse cx="86.512" cy="390.577" rx="19.021" ry="19.927" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1.17301,0,0,1.07917,-36.0624,78.775)">
                <ellipse cx="222.726" cy="436.833" rx="136.454" ry="148.32" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1.41151,0,0,1.35603,-99.3231,-280.589)">
                <ellipse cx="229.909" cy="612.655" rx="108.538" ry="112.978" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1.31622,0,0,1.31622,-85.6393,-171.802)">
                <circle cx="240.191" cy="545.193" r="113.79" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1.00561,0,0,0.925157,6.53015,142.819)">
                <ellipse cx="222.726" cy="436.833" rx="136.454" ry="148.32" style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <g transform="matrix(1.06495,0,0,1.17386,4.26495,-118.761)">
                <ellipse cx="199.738" cy="576.591" rx="78.564" ry="71.275" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1.06495,0,0,1.17386,958.779,-131.446)">
                <ellipse cx="199.738" cy="576.591" rx="78.564" ry="71.275" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.984261,0,0,0.909977,77.8699,3.29529)">
                <ellipse cx="155.075" cy="602.574" rx="40.64" ry="43.957" style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(1.19851,0,0,1.19851,-1044.82,-276.252)">
                <circle cx="1102.05" cy="621.68" r="24.549" style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(0.984261,0,0,0.909977,1005.12,13.0589)">
                <ellipse cx="155.075" cy="602.574" rx="40.64" ry="43.957" style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(1.67005,0,0,1.67005,-729.47,-405.139)">
                <circle cx="1102.05" cy="621.68" r="24.549" style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(1.13655,0,0,0.979556,-79.377,-1.61781)">
                <path
                  d="M910.658,389.188C910.658,355.79 887.289,328.676 858.506,328.676L510.145,328.676C481.361,328.676 457.992,355.79 457.992,389.188L457.992,510.21C457.992,543.607 481.361,570.721 510.145,570.721L858.506,570.721C887.289,570.721 910.658,543.607 910.658,510.21L910.658,389.188Z"
                  style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1.04909,0,0,1.30461,-36.747,-91.5818)">
                <path
                  d="M934.329,367.17C934.329,344.473 911.414,326.046 883.189,326.046L518.366,326.046C490.141,326.046 467.226,344.473 467.226,367.17L467.226,449.418C467.226,472.115 490.141,490.542 518.366,490.542L883.189,490.542C911.414,490.542 934.329,472.115 934.329,449.418L934.329,367.17Z"
                  style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <g transform="matrix(0.828052,0,0,0.959533,172.246,7.77225)">
                <path
                  d="M911.884,392.299C911.884,368.655 889.64,349.458 862.241,349.458L547.083,349.458C519.684,349.458 497.44,368.655 497.44,392.299L497.44,477.981C497.44,501.626 519.684,520.822 547.083,520.822L862.241,520.822C889.64,520.822 911.884,501.626 911.884,477.981L911.884,392.299Z"
                  style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(0.863316,0,0,0.430754,99.9172,255.269)">
                <rect x="744.084" y="371.363" width="6.115" height="125.014" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.863316,0,0,0.430754,62.8605,255.269)">
                <rect x="744.084" y="371.363" width="6.115" height="125.014" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.863316,0,0,0.861508,81.9766,68.3782)">
                <rect x="744.084" y="371.363" width="6.115" height="125.014" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1.22945,0,0,1.79879,-99.6426,-166.379)">
                <ellipse cx="724.046" cy="337.454" rx="22.248" ry="15.206" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.818677,0,0,0.818677,279.673,117.238)">
                <circle cx="624.009" cy="395.234" r="25.234" style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(0.77107,0,0,0.77107,309.256,140.622)">
                <circle cx="624.17" cy="389.838" r="23.446" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.911757,0,0,0.911757,227.28,77.4035)">
                <circle cx="617.769" cy="399.022" r="13.984" style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <rect x="505.366" y="345.357" width="6.519" height="189.337" style={{fill: "rgb(141, 43, 100)"}} />
              <rect x="875.851" y="345.357" width="7.615" height="192.88" style={{fill: "rgb(141, 43, 100)"}} />
              <g transform="matrix(2.1544,0,0,0.74191,-1056.69,92.9092)">
                <path
                  d="M909.638,367.783C909.638,363.48 908.435,359.987 906.953,359.987L785.179,359.987C783.697,359.987 782.494,363.48 782.494,367.783L782.494,383.375C782.494,387.678 783.697,391.171 785.179,391.171L906.953,391.171C908.435,391.171 909.638,387.678 909.638,383.375L909.638,367.783Z"
                  style={{fill: "rgb(236, 231, 212); fill-opacity: 0.77"}} />
              </g>
              <g transform="matrix(1.6197,0,0,0.425811,-592.584,237.063)">
                <path
                  d="M909.638,367.783C909.638,363.48 908.719,359.987 907.588,359.987L784.544,359.987C783.413,359.987 782.494,363.48 782.494,367.783L782.494,383.375C782.494,387.678 783.413,391.171 784.544,391.171L907.588,391.171C908.719,391.171 909.638,387.678 909.638,383.375L909.638,367.783Z"
                  style={{fill: "rgb(236, 231, 212); fill-opacity: 0.77"}} />
              </g>
              <g transform="matrix(0.892097,0,0,1,71.8659,-19.221)">
                <rect x="485.934" y="364.578" width="423.876" height="7.086" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.892007,0,0,1,71.9098,166.573)">
                <rect x="485.934" y="364.578" width="423.876" height="7.086" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1.22061,0,0,2.74249,-272.351,-194.252)">
                <rect x="262.772" y="84.573" width="1064.94" height="65.819" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1,0,0,1,-0.872029,-35.0272)">
                <rect x="239.728" y="89.651" width="1091.82" height="147.562" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1.06952,0,0,1.422,-34.8868,-99.5121)">
                <rect x="263.159" y="114.068" width="1007.88" height="93.421" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <a href="#" ref={radioLight} onMouseEnter={futureMouseEnter} onMouseLeave={futureMouseLeave} id="radioLight">
                <g transform="matrix(1.21529,0,0,1.89034,-63.0527,-189.799)">
                  <path ref={radioLightOuter3} id="radioLightOuter3"
                    d="M1124.76,153.015C1124.76,144.275 1113.72,137.179 1100.12,137.179L295.126,137.179C281.531,137.179 270.494,144.275 270.494,153.015L270.494,184.687C270.494,193.427 281.531,200.523 295.126,200.523L1100.12,200.523C1113.72,200.523 1124.76,193.427 1124.76,184.687L1124.76,153.015Z"
                    style={{fill: "rgb(141, 43, 100)"}} />
                </g>
                <g transform="matrix(1,0,0,1.302,162.328,-86.4741)">
                  <ellipse ref={radioLightOuter2} id="radioLightOuter2" cx="1120.27" cy="166.363" rx="29.028" ry="43.283"
                    style={{fill: "rgb(141, 43, 100)"}} />
                </g>
                <g transform="matrix(1,0,0,1.302,-832.67,-87.2172)">
                  <ellipse ref={radioLightOuter1} id="radioLightOuter1" cx="1120.27" cy="166.363" rx="29.028" ry="43.283"
                    style={{fill: "rgb(141, 43, 100)"}} />
                </g>
                <g transform="matrix(0.996533,0,0,1,-10.7947,0)">
                  <path ref={radioLight8} id="radioLight8"
                    d="M1292.67,105.154C1292.67,91.117 1281.23,79.72 1267.14,79.72L324.956,79.72C310.869,79.72 299.432,91.117 299.432,105.154L299.432,156.024C299.432,170.062 310.869,181.459 324.956,181.459L1267.14,181.459C1281.23,181.459 1292.67,170.062 1292.67,156.024L1292.67,105.154Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(-1.60056,0,0,1.56026,1721.27,-80.7752)">
                  <path ref={radioLight7} id="radioLight7"
                    d="M729.473,120.346C729.473,114.214 724.62,109.236 718.642,109.236L295.541,109.236C289.563,109.236 284.71,114.214 284.71,120.346L284.71,142.567C284.71,148.699 289.563,153.677 295.541,153.677L718.642,153.677C724.62,153.677 729.473,148.699 729.473,142.567L729.473,120.346Z"
                    style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(-1,0,0,1.23351,874.945,-56.6194)">
                  <ellipse ref={radioLight6} id="radioLight6" cx="309.242" cy="146.696" rx="16.136" ry="26.328"
                    style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(-1,0,0,1.23351,1563.3,-56.6194)">
                  <ellipse ref={radioLight5} id="radioLight5" cx="309.242" cy="146.696" rx="16.136" ry="26.328"
                    style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(-0.645538,0,0,1.09474,1353.87,-36.6649)">
                  <rect ref={radioLight4} id="radioLight4" x="353.446" y="110.375" width="13.477" height="78.791"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(-0.645538,0,0,1.09474,1164.81,-36.6649)">
                  <rect ref={radioLight3} id="radioLight3" x="353.446" y="110.375" width="13.477" height="78.791"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(-0.645538,0,0,1.09474,970.716,-39.1067)">
                  <rect ref={radioLight2} id="radioLight2" x="353.446" y="110.375" width="13.477" height="78.791"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.0744,0,0,1,-47.5533,-2.96265)">
                  <path ref={radioLight1} id="radioLight1"
                    d="M1208.05,112.055C1208.05,109.252 1205.93,106.975 1203.33,106.975L835.328,106.975C832.718,106.975 830.6,109.252 830.6,112.055L830.6,122.215C830.6,125.018 832.718,127.294 835.328,127.294L1203.33,127.294C1205.93,127.294 1208.05,125.018 1208.05,122.215L1208.05,112.055Z"
                    style={{fill: "rgb(236, 231, 212); fill-opacity: 0.77"}} />
                </g>
              </a>
              <g transform="matrix(-0.732738,0,0,1.36069,1539.33,117.695)">
                <path
                  d="M729.473,120.346C729.473,114.214 720.228,109.236 708.841,109.236L305.342,109.236C293.955,109.236 284.71,114.214 284.71,120.346L284.71,142.567C284.71,148.699 293.955,153.677 305.342,153.677L708.841,153.677C720.228,153.677 729.473,148.699 729.473,142.567L729.473,120.346Z"
                  style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(-0.4578,0,0,1.07573,1151.88,138.761)">
                <ellipse cx="309.242" cy="146.696" rx="16.136" ry="26.328" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(-0.4578,0,0,1.07573,1467.01,138.761)">
                <ellipse cx="309.242" cy="146.696" rx="16.136" ry="26.328" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(-0.66713,0,0,1.08685,1506.07,153.694)">
                <path
                  d="M729.473,120.346C729.473,114.214 721.362,109.236 711.373,109.236L302.81,109.236C292.82,109.236 284.71,114.214 284.71,120.346L284.71,142.567C284.71,148.699 292.82,153.677 302.81,153.677L711.373,153.677C721.362,153.677 729.473,148.699 729.473,142.567L729.473,120.346Z"
                  style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <g transform="matrix(-0.416809,0,0,0.859241,1153.32,170.52)">
                <ellipse cx="309.242" cy="146.696" rx="16.136" ry="26.328" style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <g transform="matrix(-0.416809,0,0,0.859241,1440.23,170.52)">
                <ellipse cx="309.242" cy="146.696" rx="16.136" ry="26.328" style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <g transform="matrix(1,0,0,1,-13.4796,10.5826)">
                <path
                  d="M1306.92,278.454C1306.92,275.122 1304.22,272.417 1300.89,272.417L1147.75,272.417C1144.42,272.417 1141.72,275.122 1141.72,278.454L1141.72,290.53C1141.72,293.862 1144.42,296.567 1147.75,296.567L1300.89,296.567C1304.22,296.567 1306.92,293.862 1306.92,290.53L1306.92,278.454Z"
                  style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(1,0,0,1,10.7862,-11.1854)">
                <rect x="1156.99" y="282.11" width="6.088" height="49.793" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(-0.732738,0,0,1.36069,596.65,116.949)">
                <path
                  d="M729.473,120.346C729.473,114.214 720.228,109.236 708.841,109.236L305.342,109.236C293.955,109.236 284.71,114.214 284.71,120.346L284.71,142.567C284.71,148.699 293.955,153.677 305.342,153.677L708.841,153.677C720.228,153.677 729.473,148.699 729.473,142.567L729.473,120.346Z"
                  style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(-0.4578,0,0,1.07573,209.203,138.015)">
                <ellipse cx="309.242" cy="146.696" rx="16.136" ry="26.328" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(-0.4578,0,0,1.07573,524.331,138.015)">
                <ellipse cx="309.242" cy="146.696" rx="16.136" ry="26.328" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(-0.66713,0,0,1.08685,563.391,152.947)">
                <path
                  d="M729.473,120.346C729.473,114.214 721.362,109.236 711.373,109.236L302.81,109.236C292.82,109.236 284.71,114.214 284.71,120.346L284.71,142.567C284.71,148.699 292.82,153.677 302.81,153.677L711.373,153.677C721.362,153.677 729.473,148.699 729.473,142.567L729.473,120.346Z"
                  style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <g transform="matrix(1,0,0,1,-1038.32,10.5826)">
                <path
                  d="M1306.92,278.454C1306.92,275.122 1304.22,272.417 1300.89,272.417L1147.75,272.417C1144.42,272.417 1141.72,275.122 1141.72,278.454L1141.72,290.53C1141.72,293.862 1144.42,296.567 1147.75,296.567L1300.89,296.567C1304.22,296.567 1306.92,293.862 1306.92,290.53L1306.92,278.454Z"
                  style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(-0.416809,0,0,0.859241,210.635,169.774)">
                <ellipse cx="309.242" cy="146.696" rx="16.136" ry="26.328" style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <g transform="matrix(-0.416809,0,0,0.859241,497.547,169.774)">
                <ellipse cx="309.242" cy="146.696" rx="16.136" ry="26.328" style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <g transform="matrix(1,0,0,1,-931.895,-11.9318)">
                <rect x="1156.99" y="282.11" width="6.088" height="49.793" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1.22945,0,0,1.79879,-295.179,-165.474)">
                <ellipse cx="724.046" cy="337.454" rx="22.248" ry="15.206" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.818677,0,0,0.818677,84.1366,117.56)">
                <circle cx="624.009" cy="395.234" r="25.234" style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(0.77107,0,0,0.77107,113.72,140.944)">
                <circle cx="624.17" cy="389.838" r="23.446" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.911757,0,0,0.911757,31.7438,77.7256)">
                <circle cx="617.769" cy="399.022" r="13.984" style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(1,0,0,1,12.8743,-59.0867)">
                <ellipse cx="211.981" cy="626.528" rx="16.919" ry="15.924" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1,0,0,1,955.058,-79.5471)">
                <ellipse cx="211.981" cy="626.528" rx="16.919" ry="15.924" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <a href="#" ref={stopSelection} id="stopSelection">
                <g transform="matrix(1,0,0,1,9.75289,-27.7037)">
                  <ellipse id="stopAllButton1" cx="136.61" cy="156.157" rx="61.573" ry="60.299"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.44992,0,0,1.44992,-67.4801,-87.3338)">
                  <circle id="stopAllButton2" cx="147.486" cy="149.283" r="37.397" style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(1.18599,0,0,1.18599,-32.7938,-56.93)">
                  <circle id="stopAllButton3" cx="151.061" cy="157.098" r="40.039" style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>

              <g transform="matrix(1,0,0,0.929775,2.15874,64.9557)">
                <rect x="434.886" y="696.532" width="517.544" height="47.88" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1.00948,0,0,0.942215,-4.58317,56.7841)">
                <rect x="446.871" y="705.07" width="493.43" height="28.875" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1,0,0,1,264.974,33.971)">
                <ellipse cx="101.971" cy="358.859" rx="30.521" ry="31.184" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1,0,0,1,-18.7796,33.971)">
                <ellipse cx="101.971" cy="358.859" rx="30.521" ry="31.184" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.840201,0,0,0.801101,13.5435,82.9742)">
                <ellipse cx="86.512" cy="390.577" rx="19.021" ry="19.927" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(0.771674,0,0,0.735763,295.843,109.796)">
                <ellipse cx="86.512" cy="390.577" rx="19.021" ry="19.927" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1,0,0,1,-18.7796,345.689)">
                <ellipse cx="101.971" cy="358.859" rx="30.521" ry="31.184" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.725968,0,0,0.692183,25.599,428.99)">
                <ellipse cx="86.512" cy="390.577" rx="19.021" ry="19.927" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1,0,0,1,264.199,345.689)">
                <ellipse cx="101.971" cy="358.859" rx="30.521" ry="31.184" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.864382,0,0,0.824157,288.811,380.074)">
                <ellipse cx="86.512" cy="390.577" rx="19.021" ry="19.927" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1,0,0,1,1208.18,32.3123)">
                <ellipse cx="101.971" cy="358.859" rx="30.521" ry="31.184" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.872099,0,0,0.831515,1232.27,68.8306)">
                <ellipse cx="86.512" cy="390.577" rx="19.021" ry="19.927" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1,0,0,1,924.429,32.3123)">
                <ellipse cx="101.971" cy="358.859" rx="30.521" ry="31.184" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.735153,0,0,0.700941,967.838,122.432)">
                <ellipse cx="86.512" cy="390.577" rx="19.021" ry="19.927" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1,0,0,1,924.429,344.03)">
                <ellipse cx="101.971" cy="358.859" rx="30.521" ry="31.184" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.80819,0,0,0.77058,960.13,399.933)">
                <ellipse cx="86.512" cy="390.577" rx="19.021" ry="19.927" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(1,0,0,1,1207.41,344.03)">
                <ellipse cx="101.971" cy="358.859" rx="30.521" ry="31.184" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.62553,0,0,0.596419,1248.91,464.485)">
                <ellipse cx="86.512" cy="390.577" rx="19.021" ry="19.927" style={{fill: "rgb(234, 201, 57)"}} />
              </g>
              <g transform="matrix(0.863316,0,0,0.430754,-5.25613,255.269)">
                <rect x="744.084" y="371.363" width="6.115" height="125.014" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.863316,0,0,0.430754,29.7055,255.269)">
                <rect x="744.084" y="371.363" width="6.115" height="125.014" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(0.863316,0,0,0.861508,11.5899,68.3782)">
                <rect x="744.084" y="371.363" width="6.115" height="125.014" style={{fill: "rgb(141, 43, 100)"}} />
              </g>
              <g transform="matrix(1.04398,0,0,1.49513,-37.9591,-140.277)">
                <rect x="441.537" y="234.282" width="520.886" height="69.2" style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <g transform="matrix(0.991631,0,0,1.58548,4.22034,-188.152)">
                <rect x="428.693" y="256.487" width="534.676" height="55.119" style={{fill: "rgb(91, 170, 179)"}} />
              </g>
              <g transform="matrix(1.23054,0,0,1.26874,-99.923,-80.8446)">
                <rect x="435.06" y="240.815" width="421.131" height="59.49" style={{fill: "rgb(45, 54, 54)"}} />
              </g>
              <a href="#" ref={scrapeInstagram} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onClick={scrapeInstagramClick} id="scrapeInstagram">
                <g transform="matrix(0.742699,0,0,0.742699,446.645,146.449)">
                  <ellipse id="knob1Button3" cx="136.61" cy="156.157" rx="61.573" ry="60.299"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.07685,0,0,1.07685,389.284,102.162)">
                  <circle id="knob1Button2" cx="147.486" cy="149.283" r="37.397" style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(0.880836,0,0,0.880836,415.045,124.743)">
                  <circle id="knob1Button1" cx="151.061" cy="157.098" r="40.039" style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>
              <a href="#" ref={futureUse3} onMouseEnter={futureMouseEnter} onMouseLeave={futureMouseLeave} id="futureUse3">
                <g transform="matrix(0.742699,0,0,0.742699,593.084,146.449)">
                  <ellipse id="knob2Button3" cx="136.61" cy="156.157" rx="61.573" ry="60.299"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.07685,0,0,1.07685,535.723,102.162)">
                  <circle id="knob2Button2" cx="147.486" cy="149.283" r="37.397" style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(0.880836,0,0,0.880836,561.485,124.743)">
                  <circle id="knob2Button1" cx="151.061" cy="157.098" r="40.039" style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>
              <a href="#" ref={futureUse2} onMouseEnter={futureMouseEnter} onMouseLeave={futureMouseLeave} id="futureUse2">
                <g transform="matrix(0.742699,0,0,0.742699,746.774,146.449)">
                  <ellipse id="knob3Button3" cx="136.61" cy="156.157" rx="61.573" ry="60.299"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.07685,0,0,1.07685,689.413,102.162)">
                  <circle id="knob3Button2" cx="147.486" cy="149.283" r="37.397" style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(0.880836,0,0,0.880836,715.175,124.743)">
                  <circle id="knob3Button1" cx="151.061" cy="157.098" r="40.039" style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>

              <a href="#" ref={scrapeBuilder} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onClick={scrapeBuilderClick} id="scrapeBuilder">
                <g transform="matrix(0.87124,0,0,1.40318,16.9214,-83.0399)">
                  <path ref={selectButton} id="selectButton"
                    d="M521.494,463.302C521.494,456.695 512.854,451.33 502.212,451.33L463.649,451.33C453.007,451.33 444.367,456.695 444.367,463.302L444.367,550.598C444.367,557.206 453.007,562.57 463.649,562.57L502.212,562.57C512.854,562.57 521.494,557.206 521.494,550.598L521.494,463.302Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.15666,0,0,1.24008,-670.718,-157.694)">
                  <path ref={selectButtonBlue} id="selectButtonBlue"
                    d="M980.403,588.858C980.403,583.159 975.443,578.533 969.334,578.533L947.195,578.533C941.086,578.533 936.126,583.159 936.126,588.858L936.126,678.794C936.126,684.492 941.086,689.118 947.195,689.118L969.334,689.118C975.443,689.118 980.403,684.492 980.403,678.794L980.403,588.858Z"
                    style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(1,0,0,1.01152,0,-6.52844)">
                  <path ref={selectButtonInner} id="selectButtonInner"
                    d="M457.119,576.198C457.119,570.938 452.799,566.668 447.479,566.668L428.2,566.668C422.88,566.668 418.56,570.938 418.56,576.198L418.56,679.287C418.56,684.547 422.88,688.817 428.2,688.817L447.479,688.817C452.799,688.817 457.119,684.547 457.119,679.287L457.119,576.198Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>
              <a href="#" ref={downloadRecent} onMouseEnter={futureMouseEnter} onMouseLeave={futureMouseLeave} id="downloadRecent">
                <g transform="matrix(0.87124,0,0,1.40318,104.662,-83.0399)">
                  <path ref={leftButton} id="leftButton"
                    d="M521.494,463.302C521.494,456.695 512.854,451.33 502.212,451.33L463.649,451.33C453.007,451.33 444.367,456.695 444.367,463.302L444.367,550.598C444.367,557.206 453.007,562.57 463.649,562.57L502.212,562.57C512.854,562.57 521.494,557.206 521.494,550.598L521.494,463.302Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.15666,0,0,1.24008,-582.977,-157.694)">
                  <path ref={leftButtonBlue} id="leftButtonBlue"
                    d="M980.403,588.858C980.403,583.159 975.443,578.533 969.334,578.533L947.195,578.533C941.086,578.533 936.126,583.159 936.126,588.858L936.126,678.794C936.126,684.492 941.086,689.118 947.195,689.118L969.334,689.118C975.443,689.118 980.403,684.492 980.403,678.794L980.403,588.858Z"
                    style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(1,0,0,1.01152,87.5713,-6.67314)">
                  <path ref={leftButtonInner} id="leftButtonInner"
                    d="M457.119,576.198C457.119,570.938 452.799,566.668 447.479,566.668L428.2,566.668C422.88,566.668 418.56,570.938 418.56,576.198L418.56,679.287C418.56,684.547 422.88,688.817 428.2,688.817L447.479,688.817C452.799,688.817 457.119,684.547 457.119,679.287L457.119,576.198Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>
              <a href="#" ref={selectRight} onMouseEnter={futureMouseEnter} onMouseLeave={futureMouseLeave} id="selectRight">
                <g transform="matrix(0.87124,0,0,1.40318,192.664,-83.0399)">
                  <path id="rightButton"
                    d="M521.494,463.302C521.494,456.695 512.854,451.33 502.212,451.33L463.649,451.33C453.007,451.33 444.367,456.695 444.367,463.302L444.367,550.598C444.367,557.206 453.007,562.57 463.649,562.57L502.212,562.57C512.854,562.57 521.494,557.206 521.494,550.598L521.494,463.302Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g id="rightButtonBlue" transform="matrix(1.15666,0,0,1.24008,-494.976,-157.694)">
                  <path id="rightButtonBlue"
                    d="M980.403,588.858C980.403,583.159 975.443,578.533 969.334,578.533L947.195,578.533C941.086,578.533 936.126,583.159 936.126,588.858L936.126,678.794C936.126,684.492 941.086,689.118 947.195,689.118L969.334,689.118C975.443,689.118 980.403,684.492 980.403,678.794L980.403,588.858Z"
                    style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(1,0,0,1.01152,175.572,-6.67314)">
                  <path id="rightButtonInner"
                    d="M457.119,576.198C457.119,570.938 452.799,566.668 447.479,566.668L428.2,566.668C422.88,566.668 418.56,570.938 418.56,576.198L418.56,679.287C418.56,684.547 422.88,688.817 428.2,688.817L447.479,688.817C452.799,688.817 457.119,684.547 457.119,679.287L457.119,576.198Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>
              <a href="#" ref={selectAllTaggedElements} onMouseEnter={futureMouseEnter} onMouseLeave={futureMouseLeave} id="selectAllTaggedElements">
                <g transform="matrix(0.87124,0,0,1.4133,274.59,-88.7324)">
                  <path id="selectAllButton"
                    d="M521.494,463.217C521.494,456.656 512.854,451.33 502.212,451.33L463.649,451.33C453.007,451.33 444.367,456.656 444.367,463.217L444.367,550.684C444.367,557.244 453.007,562.57 463.649,562.57L502.212,562.57C512.854,562.57 521.494,557.244 521.494,550.684L521.494,463.217Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.15666,0,0,1.24008,-413.05,-157.694)">
                  <path id="selectAllButtonBlue"
                    d="M980.403,588.858C980.403,583.159 975.443,578.533 969.334,578.533L947.195,578.533C941.086,578.533 936.126,583.159 936.126,588.858L936.126,678.794C936.126,684.492 941.086,689.118 947.195,689.118L969.334,689.118C975.443,689.118 980.403,684.492 980.403,678.794L980.403,588.858Z"
                    style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(1,0,0,1.01152,257.498,-6.67314)">
                  <path id="selectAllButtonInner"
                    d="M457.119,576.198C457.119,570.938 452.799,566.668 447.479,566.668L428.2,566.668C422.88,566.668 418.56,570.938 418.56,576.198L418.56,679.287C418.56,684.547 422.88,688.817 428.2,688.817L447.479,688.817C452.799,688.817 457.119,684.547 457.119,679.287L457.119,576.198Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>
              <a href="#" ref={collectSelected} onMouseEnter={futureMouseEnter} onMouseLeave={futureMouseLeave} id="collectSelected">
                <g transform="matrix(0.87124,0,0,1.40318,356.776,-83.0399)">
                  <path ref={collectButton} id="collectButton"
                    d="M521.494,463.302C521.494,456.695 512.854,451.33 502.212,451.33L463.649,451.33C453.007,451.33 444.367,456.695 444.367,463.302L444.367,550.598C444.367,557.206 453.007,562.57 463.649,562.57L502.212,562.57C512.854,562.57 521.494,557.206 521.494,550.598L521.494,463.302Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.15666,0,0,1.24008,-330.864,-157.694)">
                  <path ref={collectButtonBlue} id="collectButtonBlue"
                    d="M980.403,588.858C980.403,583.159 975.443,578.533 969.334,578.533L947.195,578.533C941.086,578.533 936.126,583.159 936.126,588.858L936.126,678.794C936.126,684.492 941.086,689.118 947.195,689.118L969.334,689.118C975.443,689.118 980.403,684.492 980.403,678.794L980.403,588.858Z"
                    style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(1,0,0,1.01152,339.685,-6.67314)">
                  <path ref={collectButtonInner} id="collectButtonInner"
                    d="M457.119,576.198C457.119,570.938 452.799,566.668 447.479,566.668L428.2,566.668C422.88,566.668 418.56,570.938 418.56,576.198L418.56,679.287C418.56,684.547 422.88,688.817 428.2,688.817L447.479,688.817C452.799,688.817 457.119,684.547 457.119,679.287L457.119,576.198Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>
              <a href="#" ref={deselectElements} onMouseEnter={futureMouseEnter} onMouseLeave={futureMouseLeave} id="deselectElements">
                <g transform="matrix(0.87124,0,0,1.40318,444.517,-83.0399)">
                  <path id="removeButton"
                    d="M521.494,463.302C521.494,456.695 512.854,451.33 502.212,451.33L463.649,451.33C453.007,451.33 444.367,456.695 444.367,463.302L444.367,550.598C444.367,557.206 453.007,562.57 463.649,562.57L502.212,562.57C512.854,562.57 521.494,557.206 521.494,550.598L521.494,463.302Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.15666,0,0,1.24008,-243.123,-157.694)">
                  <path id="removeButtonBlue"
                    d="M980.403,588.858C980.403,583.159 975.443,578.533 969.334,578.533L947.195,578.533C941.086,578.533 936.126,583.159 936.126,588.858L936.126,678.794C936.126,684.492 941.086,689.118 947.195,689.118L969.334,689.118C975.443,689.118 980.403,684.492 980.403,678.794L980.403,588.858Z"
                    style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(1,0,0,1.01152,427.425,-6.67314)">
                  <path id="removeButtonInner"
                    d="M457.119,576.198C457.119,570.938 452.799,566.668 447.479,566.668L428.2,566.668C422.88,566.668 418.56,570.938 418.56,576.198L418.56,679.287C418.56,684.547 422.88,688.817 428.2,688.817L447.479,688.817C452.799,688.817 457.119,684.547 457.119,679.287L457.119,576.198Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>
              <a href="#" ref={clearSelected} onMouseEnter={futureMouseEnter} onMouseLeave={futureMouseLeave} id="clearSelected">
                <g transform="matrix(0.87124,0,0,1.40318,535.102,-83.0399)">
                  <path id="futureButton"
                    d="M521.494,463.302C521.494,456.695 512.854,451.33 502.212,451.33L463.649,451.33C453.007,451.33 444.367,456.695 444.367,463.302L444.367,550.598C444.367,557.206 453.007,562.57 463.649,562.57L502.212,562.57C512.854,562.57 521.494,557.206 521.494,550.598L521.494,463.302Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
                <g transform="matrix(1.15666,0,0,1.24008,-152.537,-157.694)">
                  <path id="futureButtonBlue"
                    d="M980.403,588.858C980.403,583.159 975.443,578.533 969.334,578.533L947.195,578.533C941.086,578.533 936.126,583.159 936.126,588.858L936.126,678.794C936.126,684.492 941.086,689.118 947.195,689.118L969.334,689.118C975.443,689.118 980.403,684.492 980.403,678.794L980.403,588.858Z"
                    style={{fill: "rgb(91, 170, 179)"}} />
                </g>
                <g transform="matrix(1,0,0,1.01152,518.011,-6.67314)">
                  <path id="futureButtonInner"
                    d="M457.119,576.198C457.119,570.938 452.799,566.668 447.479,566.668L428.2,566.668C422.88,566.668 418.56,570.938 418.56,576.198L418.56,679.287C418.56,684.547 422.88,688.817 428.2,688.817L447.479,688.817C452.799,688.817 457.119,684.547 457.119,679.287L457.119,576.198Z"
                    style={{fill: "rgb(45, 54, 54)"}} />
                </g>
              </a>
              <text id="buttonHoverText" ref={buttonHoverText} className="buttonHoverText" style={{fontSize: "4em", pointerEvents: "none", fill: "rgb(58, 71, 71)"}}
                textAnchor="end" x="1260" y="150"></text>
            </svg>
          </div>
        </div>
      </div>

  );
};

export default Home;
