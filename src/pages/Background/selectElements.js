/* eslint-disable no-inner-declarations */
if (window.contentScriptInjected !== true) {
  window.contentScriptInjected = true;

  var stopAll = true;
  var freezeState = true;
  var runSelect = true;
  var activeSelected = []; // Element type
  var prevSelected = [];
  var filtManualSelected = [];
  var borderedInnerHTML = [];
  var prevNode = null;
  var stopMouseover = true;
  var body = document.getElementsByTagName("body")[0];
  var bodyWidth = body.clientWidth;
  var bodyHeight = body.clientHeight;
  var rectArea = 0;

  function addBorderPrimary(node) {
    if (node.nodeName === 'IMG') {
      node.classList.add('activeBorderImage');
      node.classList.add('activeBorderPrimary');
    } else if (node.nodeName === 'A') {
      node.style.position = 'relative';
      node.classList.add('activeBorderPrimary');
    } else {
      node.classList.add('activeBorderPrimary');
    }
  }

  function addBorderEvent(node) {
    var element = node.getBoundingClientRect();

    if (element.width * element.height >= rectArea) {
      rectArea = element.width * element.height;

      if (node.nodeName === 'IMG') {
        node.classList.add('activeBorderImage');
        node.classList.add('activeBorderEvent');
        if (prevNode != null) removeBorderEvent(prevNode);
      } else if (node.nodeName === 'A') {
        // remove position relative
        node.style.position = 'relative';
        node.classList.add('activeBorderEvent');
        if (prevNode != null) removeBorderEvent(prevNode);
      } else {
        node.classList.add('activeBorderEvent');
        if (prevNode != null) removeBorderEvent(prevNode);
      }

      prevNode = node;
    }
  }

  function removeBorderPrimary(node) {
    if (node.nodeName === 'IMG') {
      node.classList.remove('activeBorderImage');
      node.classList.remove('activeBorderPrimary');
    }
  }

  function removeBorderEvent(node) {
    if (node.nodeName === 'IMG') {
      node.classList.remove('activeBorderImage');
      node.classList.remove('activeBorderEvent');
    } else {
      node.classList.remove('activeBorderEvent');
    }
  }

  function removePrimaryBorderAll() {
    var borderedItem = document.querySelectorAll('.activeBorderPrimary');

    borderedItem.forEach((node) => {
      node.classList.remove('activeBorderPrimary');
      node.classList.remove('activeBorderImage');
      // if node has position absolute, remove it
      if (node.style.position === 'absolute') {
        node.style.position = '';
      }
    });
  }
  function removeEventBorderAll() {
    var borderedItem = document.querySelectorAll('.activeBorderEvent');

    borderedItem.forEach((node) => {
      node.classList.remove('activeBorderEvent');
      node.classList.remove('activeBorderImage');
    });
  }
  function removeBorderAll() {
    var borderedItem = document.querySelectorAll(
      '.activeBorderPrimary, .activeBorderEvent, .previousBorderPrimary'
    );
    borderedItem.forEach((node) => {
      node.classList.remove('activeBorderPrimary');
      node.classList.remove('activeBorderImage');
      node.classList.remove('activeBorderEvent');
      node.classList.remove('previousBorderPrimary');
    });
  }

  function selectingElements() {
    //this function is ran at start of script, and managed via stopAll/freezeState/etc
    var x = document.querySelectorAll(
      'div, span, li, button, input, textarea, p, img, h1, h2, h3, h4, h5, a, ol, article, iframe, html, main'
      //"span, th, td, button, input, a, textarea, p, li, ol, card, img, section, nav, footer, header, map, video, audio, embed, iframe, object, picture, portal, param, source, form, fieldset, datalist, label, legend, select, option, output, progress, meter, h1, h2, h3, h4, h5, h6, pre"
    );

    x.forEach((node) => {
      node.addEventListener('mouseenter', function addBorder() {
        if (!freezeState && stopMouseover && !stopAll) {
          removePrimaryBorderAll();
          if (!node.classList.contains('activeBorderEvent'))
            addBorderPrimary(node);
        }
      });
      node.addEventListener('mouseleave', function addBorder() {
        if (!freezeState && stopMouseover && !stopAll) {
          removeBorderPrimary(node);
        }
      });
      node.addEventListener('click', doClick);

      node.addEventListener('dblclick', function addBorder(e) {
        if (!stopAll) {
          e.preventDefault();
          e.stopPropagation();
          console.log('bringing it back 2');
          chrome.runtime.sendMessage({
            msg: 'Bring back scrape builder',
          });
        }
      });
    });
  }
  var doClick = (e) => doathing(e);

  function doathing(e) {
    if (!stopAll) {
      e.preventDefault();
      e.stopPropagation();

      collectBordered();
      chrome.runtime.sendMessage({
        msg: 'Bring back scrape builder',
      });

      stopAll = true;
      freezeState = true;
    }
  }

  function removeBordered(field) {
    var borderedItem = document.querySelector(
      '.previousBorderPrimary.' + field
    );

    borderedItem.classList.remove('previousBorderPrimary', field);
  }

  function collectBordered() {
    activeSelected.length = 0;
    var borderedItem = document.querySelectorAll('.activeBorderPrimary');

    borderedItem.forEach((node) => {
      activeSelected.push(node);
    });

    if (activeSelected.length > 0) {
      if (
        activeSelected[activeSelected.length - 1].classList.contains(
          'activeBorderPrimary' ||
            activeSelected[0].classList.contains('activeBorderPrimary')
        )
      ) {
        activeSelected[activeSelected.length - 1].classList.remove(
          'activeBorderPrimary'
        ) ?? activeSelected[0].classList.remove('activeBorderPrimary');
      }
      if (
        activeSelected[activeSelected.length - 1].classList.contains(
          'activeBorderEvent' ||
            activeSelected[0].classList.contains('activeBorderEvent')
        )
      ) {
        activeSelected[activeSelected.length - 1].classList.remove(
          'activeBorderEvent'
        ) ?? activeSelected[0].classList.remove('activeBorderEvent');
      }
      if (
        activeSelected[activeSelected.length - 1].classList.contains(
          'previousBorderPrimary' ||
            activeSelected[0].classList.contains('previousBorderPrimary')
        )
      ) {
        activeSelected[activeSelected.length - 1].classList.remove(
          'previousBorderPrimary'
        ) ?? activeSelected[0].classList.remove('previousBorderPrimary');
      }
      if (
        activeSelected[activeSelected.length - 1].classList.contains(
          'activeBorderImage' ||
            activeSelected[0].classList.contains('activeBorderImage')
        )
      ) {
        activeSelected[activeSelected.length - 1].classList.remove(
          'activeBorderImage'
        ) ?? activeSelected[0].classList.remove('activeBorderImage');
      }

      prevSelected.push(activeSelected[activeSelected.length - 1]) ??
        prevSelected.push(activeSelected[0]);

      console.log('send to bring back mboy');

      chrome.runtime.sendMessage({
        scrapeThis: 'Add to scrape builder',
        data: {
          textC:
            activeSelected[activeSelected.length - 1].textContent ??
            activeSelected[0].textContent,
          innerH:
            activeSelected[activeSelected.length - 1].innerHTML ??
            activeSelected[0].innerHTML,
          innerT:
            activeSelected[activeSelected.length - 1].innerText ??
            activeSelected[0].innerText,
          cName:
            activeSelected[activeSelected.length - 1].className ??
            activeSelected[0].className,
          tagName:
            activeSelected[activeSelected.length - 1].tagName ??
            activeSelected[0].tagName,
          url: window.location.href,
          src: activeSelected[0].src,
          value: myField,
          label: myLabel,
        },
      });
      console.log('mboy sent the mssg');
      activeSelected[activeSelected.length - 1].classList.add(
        'previousBorderPrimary',
        myField
      ) ?? activeSelected[0].classList.add('previousBorderPrimary', myField);
    }
  }

  function collectBorderedEvent() {
    activeSelected.length = 0;
    var borderedItem = document.querySelectorAll('.activeBorderEvent');

    borderedItem.forEach((node) => {
      removeBorderEvent(node);
      activeSelected.push(node);
    });
    setTimeout(() => {
      borderedItem.forEach((node) => {
        if (node.nodeName === 'IMG') {
          node.classList.add('activeBorderImage');
          node.classList.add('activeBorderEvent');
        } else {
          node.classList.add('activeBorderEvent');
        }
      });
    }, 400);

    borderedInnerHTML = Array.from(activeSelected).map(
      (anchor) => anchor.innerHTML
    );
    if (activeSelected.length > 0) {
      if (
        activeSelected[activeSelected.length - 1].classList.contains(
          'activeBorderPrimary' ||
            activeSelected[0].classList.contains('activeBorderPrimary')
        )
      ) {
        activeSelected[activeSelected.length - 1].classList.remove(
          'activeBorderPrimary'
        ) ?? activeSelected[0].classList.remove('activeBorderPrimary');
      }
      if (
        activeSelected[activeSelected.length - 1].classList.contains(
          'activeBorderEvent' ||
            activeSelected[0].classList.contains('activeBorderEvent')
        )
      ) {
        activeSelected[activeSelected.length - 1].classList.remove(
          'activeBorderEvent'
        ) ?? activeSelected[0].classList.remove('activeBorderEvent');
      }
      if (
        activeSelected[activeSelected.length - 1].classList.contains(
          'previousBorderPrimary' ||
            activeSelected[0].classList.contains('previousBorderPrimary')
        )
      ) {
        activeSelected[activeSelected.length - 1].classList.remove(
          'previousBorderPrimary'
        ) ?? activeSelected[0].classList.remove('previousBorderPrimary');
      }
      prevSelected.push(activeSelected[activeSelected.length - 1]) ??
        prevSelected.push(activeSelected[0]);

      chrome.runtime.sendMessage({
        scrapeThis: 'Add to scrape builder',
        data: {
          textC:
            activeSelected[activeSelected.length - 1].textContent ??
            activeSelected[0].textContent,
          innerH:
            activeSelected[activeSelected.length - 1].innerHTML ??
            activeSelected[0].innerHTML,
          innerT:
            activeSelected[activeSelected.length - 1].innerText ??
            activeSelected[0].innerText,
          cName:
            activeSelected[activeSelected.length - 1].className ??
            activeSelected[0].className,
          tagName:
            activeSelected[activeSelected.length - 1].tagName ??
            activeSelected[0].tagName,
          url: window.location.href,
          src: activeSelected[0].src,
          value: myField,
          label: myLabel,
        },
      });

      // add to the end or to the first if nothing else there.
      activeSelected[activeSelected.length - 1].classList.add(
        'previousBorderPrimary'
      ) ?? activeSelected[0].classList.add('previousBorderPrimary');
    }
  }

  function borderInRectCheck(el, locA, locB) {
    if (el === null || el === undefined) {
      return false;
    }
    var scrollPos =
      window.scrollY ||
      window.scrollTop ||
      document.getElementsByTagName('html')[0].scrollTop;
    const rect = el.getBoundingClientRect();

    if (locA.x <= locB.x && locA.y <= locB.y) {
      return (
        rect.top >= locA.y - scrollPos &&
        rect.left >= locA.x &&
        rect.bottom <= locB.y - scrollPos &&
        rect.right <= locB.x
      );
    } else if (locA.x > locB.x && locA.y <= locB.y) {
      return (
        rect.top >= locA.y - scrollPos &&
        rect.left >= locB.x &&
        rect.bottom <= locB.y - scrollPos &&
        rect.right <= locA.x
      );
    } else if (locA.x <= locB.x && locA.y > locB.y) {
      return (
        rect.top >= locB.y - scrollPos &&
        rect.left >= locA.x &&
        rect.bottom <= locA.y - scrollPos &&
        rect.right <= locB.x
      );
    } else if (locA.x > locB.x && locA.y > locB.y) {
      return (
        rect.top >= locB.y - scrollPos &&
        rect.left >= locB.x &&
        rect.bottom <= locA.y - scrollPos &&
        rect.right <= locA.x
      );
    }
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  function canvasProcess() {
    var elementCanvas = document.createElement('DIV');
    elementCanvas.innerHTML = `<canvas id="canvas" width="${bodyWidth}" height="${bodyHeight}" style="z-index: 2147483647; pointer-events: none; position: absolute; top: 0; left: 0"></canvas>`;
    document.body.appendChild(elementCanvas);

    canvasOperations();
  }

  function canvasOperations() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var locA = null;
    var locB = null;

    document.addEventListener('mousedown', function (e) {
      if (!stopAll) {
        stopMouseover = false;
        if (!freezeState) {
          locA = null;
          locB = null;
          locA = getMousePos(canvas, e);
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });

    document.addEventListener('mousemove', function (e) {
      if (locA && stopMouseover === false && !freezeState && !stopAll) {
        locB = getMousePos(canvas, e);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(76, 144, 255, 0.3)';
        ctx.shadowColor = 'rgba(76, 144, 255)';
        ctx.shadowBlur = 4;
        ctx.lineJoin = 'bevel';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgb(123, 168, 252)';
        ctx.strokeRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y);
        ctx.fillRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y);
      }
    });

    document.addEventListener('mouseup', function (e) {
      if (!stopAll) {
        if (!freezeState && locA && locB) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          locB = getMousePos(canvas, e);
          ctx.fillStyle = 'rgba(76, 144, 255, 0.3)';
          ctx.shadowColor = 'rgba(76, 144, 255)';
          ctx.shadowBlur = 6;
          ctx.lineJoin = 'bevel';
          ctx.lineWidth = 4;
          ctx.strokeStyle = 'rgb(123, 168, 252)';
          ctx.strokeRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y);
          ctx.fillRect(locA.x, locA.y, locB.x - locA.x, locB.y - locA.y);
          console.log('COLLECTING...');
          var x = document.querySelectorAll(
            // "div, span, li, button, input, textarea, p, img, h1, h2, h3, h4, h5, a, ol, article, iframe, html"
            'span, th, td, button, input, a, textarea, p, li, ol, card, img, section, nav, footer, header, map, video, audio, embed, iframe, object, picture, portal, param, source, form, fieldset, datalist, label, legend, select, option, output, progress, meter, h1, h2, h3, h4, h5, h6, pre'
          );
          x.forEach((node) => {
            // remove position absolute
            if (node.style.position === 'absolute') {
              console.log('absolute');
              node.style.position = 'relative';
            }
            if (borderInRectCheck(node, locA, locB)) {
              addBorderEvent(node);
            }
          });
          collectBorderedEvent();
          rectArea = 0;
          freezeState = true;
          removeEventBorderAll();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          chrome.runtime.sendMessage({
            msg: 'Bring back scrape builder',
          });
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stopMouseover = true;
      }
    });
  }

  chrome.runtime.onMessage.addListener(async function (req, sender, resp) {
    if (req.msg === 'selectElements') {
      chrome.runtime.sendMessage({
        msg: 'Bring up active tab',
      });
      stopAll = false;
      freezeState = false;
      if (runSelect === true) {
        selectingElements();
        runSelect = false;
      }
    }
  });

  var myField = '';
  var myLabel = '';

  // This is triggered by listening to storage changes
  function PopupButtonClickDetector(changes, area) {
    let changedItems = Object.keys(changes);

    console.log(changes);

    for (let node of changedItems) {
      if (node === 'disableSelect' && area === 'sync') {
        stopAll = true;
      }

      if (node === 'removeElement' && area === 'sync') {
        let someval = JSON.parse(changes.removeElement.newValue);
        removeBordered(someval.field);
      }

      if (node === 'highlightElements' && area === 'sync') {
        console.log('highlighting elements');
        let someval = JSON.parse(changes.highlightElements.newValue);
        console.log('parsed');
        console.log(someval);
        // someVal.value.value is the field the user selected on the extension.
        // this is used to find the selected area on the page

        // foreach someval to get the field and label
        someval.highlightElements.forEach((element) => {
          var mySelector = element.selectable.selector;
          var myField = element.selectable.value;
          // query select the first element that matches the field
          let x = document.querySelector(mySelector);
          // if the element exists
          if (x) {
            x.classList.add('previousBorderPrimary', myField);
          }
        });

        chrome.runtime.sendMessage({
          msg: 'Bring back scrape builder',
        });
      }

      if (node === 'selectElements' && area === 'sync') {
        console.log('bout to parse');
        let someval = JSON.parse(changes.selectElements.newValue);
        console.log('parsed');
        // someVal.field is the field the user selected on the extension.
        // this is used to find the selected area on the page
        myField = someval.field;
        myLabel = someval.label;
        console.log('bout to send bring up tab');
        chrome.runtime.sendMessage({
          msg: 'Bring up active tab',
        });
        stopAll = false;
        freezeState = false;
        if (runSelect === true) {
          console.log('running select');
          selectingElements();
          runSelect = false;
        }
      }

      if (node === 'clearSelected' && area === 'sync') {
        activeSelected.length = 0;
        prevSelected.length = 0;
        filtManualSelected.length = 0;
        borderedInnerHTML.length = 0;
        prevNode = null;
        stopMouseover = true;
        stopAll = true;
        removeBorderAll();
      }
    }
  }

  chrome.storage.onChanged.addListener(PopupButtonClickDetector);
  canvasProcess();
}
