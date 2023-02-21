import React from "react";
import Back from "../Common/back";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import FormControl from "@mui/material/FormControl";
import Typography from '@mui/material/Typography';
import * as scrape from "../../pages/Background/scrape-fetch.js";
import { useEffect } from "react";
import ScrapersPage from "../Scrapers/scrapers";
import AdminPage from "../Admin/admin";

const scheduleOptions = [
  {
    label: "Just Once",
  },
  {
    label: "Every Day",
  },
  {
    label: "Every Other Day",
  },
  {
    label: "Every Week",
  },
  {
    label: "Every Other Week",
  },
  {
    label: "Every Month",
  },
]

let eventOptions = [
  {"label":"Event Area" ,"value":"event"},
  {"label":"Venue Name" ,"value":"venueName"},
  {"label":"Venue Address" ,"value":"venueAddress"},
  {"label":"Venue Contact Info" ,"value":"venueContactInfo"},
  {"label":"Event Title" ,"value":"eventTitle"},
  {"label":"Event Description" ,"value":"eventDesc"},
  {"label":"Images" ,"value":"images"},
  {"label":"Start Date" ,"value":"startDate"},
  {"label":"End Date" ,"value":"endDate"},
  {"label":"Door Time" ,"value":"doorTime"},
  {"label":"Ticket Cost" ,"value":"ticketCost"},
  {"label":"Ticket URL" ,"value":"ticketURLS"},
  {"label":"Other Performers" ,"value":"otherPerformers"},
  {"label":"Event Desc URL" ,"value":"eventDescURL"},
  {"label":"Age Required" ,"value":"ageRequired"},
  {"label":"Facebook URL" ,"value":"facebookURL"},
  {"label":"Twitter URL" ,"value":"twitterURL"},
  {"label":"Misc" ,"value":"misc"}
]

const mainDisplayDefault = "Is This What You Selected?";
const mainDisplayAdditional = "Additional Inputs";
const mainDisplayLoading = "Loading...";
const mainDisplayVerifyError = "Unable to Verify";
const mainDisplayScheduleError = "Schedule Error";

const ScraperBuild = (props) => {
  // get onShow and isActive from props
  const { onShow, isActive, currentEvent } = props;

  // pull event options from props
  const [event, setEvent] = React.useState(props.event ?? null);

  // if there is an event, set the event options
  if (currentEvent !== null) {
    console.log(currentEvent);
  } else {
    console.log("No event");
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [evtAnchorEl, setEvtAnchorEl] = React.useState(null);
  const [submitDisabledEl, setSubmitDisabled] = React.useState(true);
  const [tempEventScrape, setTemp] = React.useState(null);
  const [selectedEventList, setEventList] = React.useState([]);
  const [addBtn, setAddBtn] = React.useState(true);
  const [clearBtn, setClearBtn] = React.useState(true);
  const [scheduleText, setSchedule] = React.useState("Schedule");
  const [eventOpt, setEventOpt] = React.useState(
    {
    label: "Event Options",
    value: undefined,
    });
  const [mainDisplayText, setMainDisplay] = React.useState(mainDisplayDefault);
  const [scrapedText, setScrapedText] = React.useState();
  const [showAdditionalEl, setShowAdditional] = React.useState();
  const [cbsa, setCbsa] = React.useState("");
  const [countyFips, setCountyFips] = React.useState("");
  const [stateFips, setStateFips] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [name, setName] = React.useState("");
  
  // set verify success message
  const [verifySuccessMessage, setVerifySuccessMessage] = React.useState(null);

  const open = Boolean(anchorEl);
  const evtOpen = Boolean(evtAnchorEl);
  const submitDisabled = Boolean(submitDisabledEl);
  const addBtnDisabled = Boolean(addBtn);
  const clearBtnDisabled = Boolean(clearBtn);
  const showAdditional = Boolean(showAdditionalEl);

  // set event on load if props.event is not null
  onload = () => {
    if (props.event !== null) {
      setEvent(props.event);
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.scrapeThis === "Add to scrape builder") {
        // remove additonal new lines
        var textC = request.data.textC.replace(/(\r\n|\n|\r)/gm, "");
        // if mainDisplayText is an IMG
        if (request.data.tagName === "IMG") {
          var img = document.createElement("img");
          img.src = request.data.src;
          img.classNameName = "img-fluid";
        }
  
        // make the event thing
        var ok = {
          key: request.data.value , 
          val : {
            "textContent": textC,
            "innerHTML": request.data.innerH ?? "",
            "innerText": request.data.innerT ?? "",
            "className": request.data.cName ?? "",
            "tagName": request.data.tagName ?? "",
            "url": request.data.url ?? "",
            "label": request.data.label,
            "value": request.data.value,
          },
          "label": request.data.label,
          "value": request.data.value,
          "textContent": textC,
        }
    
        setScrapedText(textC);
        setAddBtn(false);
        setClearBtn(false);
        setTemp(ok);
      }
    
      if (request.reloadScrapeBuilder === "Reload scrape builder") {
        window.location.reload(true);
      }
    });
  }, []);

  // a function to pass to the child component to set the event
  const setEventFromChild = (event) => {
    setEvent(event);
  }

  const handleEvtClick = (event) => {
    setEvtAnchorEl(event.currentTarget);
    setMainDisplay(mainDisplayDefault);
    setShowAdditional(false);
  };

  const handleEvtClose = (item) => {
    if(item && item.value) {
      document.getElementById("submitScrape").disabled = true;
      chrome.runtime.sendMessage({
        selectElements: "Select elements",
        field: item.value,
        label: item.label,
      });
      setEventOpt(item);
    }
    setAddBtn(true);
    setClearBtn(true);
    setEvtAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMainDisplay(mainDisplayDefault);
    setShowAdditional(false);
  };

  const handleClose = (label) => {
    if(label) {
      setSchedule(label);
    }
    setAnchorEl(null);
  };

  const removeItem = (item) => {
    // add it from the event selected list
    eventOptions.push(item);

    chrome.runtime.sendMessage({
      msg: "removeElement",
      field: item.value,
    });

    let evtList = selectedEventList.filter(x => x.value !== item.value);

    setEventList([
      ...evtList
    ]);
  }

  const removeEventProperty = () => {
    if(tempEventScrape) {
      setAddBtn(true);
      setClearBtn(true);

      setEventOpt(
        {
          label: "Event Options",
          value: undefined,
        }
      );

      setScrapedText("");

      // add it from the event selected list
      eventOptions.push( {
        label: tempEventScrape.label,
        value: tempEventScrape.value,
      });

      chrome.runtime.sendMessage({
        msg: "removeElement",
        field: tempEventScrape.value,
      });

      setTemp(null);
    }
  }

  const disableSelection = () => {
    chrome.runtime.sendMessage({
      disableSelect: "Disable select",
    });
  }

  const addEventProperty = () => {
    console.log("adding evt prop")
    if(tempEventScrape) {
      // add it to some collection
      let selected = structuredClone(selectedEventList);
      let temp = structuredClone(tempEventScrape);

      setEventList([
        ...selected,
        temp,
        ])

      console.log(selectedEventList);

      setEventOpt(
        {
          label: "Event Options",
          value: undefined,
        }
      )

      setScrapedText("");
      setAddBtn(true);
      setClearBtn(true);

      // remove it from the event selected list
      eventOptions = eventOptions.filter(x => x.label !== tempEventScrape.label)
    }
  }

  const displayAdditional = () => {
    setMainDisplay(mainDisplayAdditional);
    setShowAdditional(true);
    setScrapedText("");
  }

  const hereWeGo = () => {
    var mapped = selectedEventList.map(item => ({ [item.key]: item.val }) );
    var newObj = Object.assign({}, ...mapped );
    return newObj;
  }

  const verify = async () => {
    // check schedule
    if(scheduleText === "Schedule") {
      setMainDisplay(mainDisplayScheduleError);
      setScrapedText("Please select a schedule.");
      return;
    }

    setShowAdditional(false);
    let metaData = {
      frequency: scheduleText,
      cbsa: cbsa,
      stateFips: stateFips,
      countyFips: countyFips,
      latitude: latitude,
      longitude: longitude,
    };

    let eventData = hereWeGo();

    let combined = { ... eventData, ...metaData };

    // call the backend
    console.log(combined);

    setMainDisplay(mainDisplayLoading);
    setScrapedText("");

    await getScrapeBuilderData(combined);
  }

  const submit = async () => {
    setShowAdditional(false);

    console.log(verifySuccessMessage);

    scrape.verified({
      mapId: verifySuccessMessage.mapId,
      enabled: true,
    })

    setMainDisplay(mainDisplayDefault);
    setScrapedText("Your scrape has been submitted!");

    // reset the eventOptions from the selectedEventList
    selectedEventList.forEach((item) => {
      eventOptions.push(item);
      chrome.runtime.sendMessage({
        msg: "removeElement",
        field: item.value,
      });
    });

    // remove all the selectedEventList
    setEventList([]);

  }

  const getScrapeBuilderData = async (combined) => {
    scrape.scrapeBuilderPost(combined).then( (res) => {
      if(res) {
        setSubmitDisabled(false);
        setMainDisplay(mainDisplayDefault);
        setScrapedText(res["message"])
        setVerifySuccessMessage(res);
        // display success message
      } else {
        setSubmitDisabled(true);
        setMainDisplay(mainDisplayVerifyError);
        setScrapedText("There was an error verifying your scrape. Please try again.")
      }
    });
  }
  
  if(isActive) {
    return (
      <div className="container" id="mainContainer">
          <div className="row">
            <div className="col-6 scrape-schedule">
            <TextField 
              id="standard-basic" 
              label="Scraper Name" 
              variant="standard"
              onChange={(event) => setName(event.target.value)}
            />  
            </div>
          </div>
          <div className="row">
            <div className="col-4 scrape-schedule">
                <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle drp-button-size" type="button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    id="basic-button">
                      {scheduleText}
                </button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => handleClose(undefined)}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {scheduleOptions && scheduleOptions.map((item) => (
                    <MenuItem key={item.label} value={item.label} onClick={() => handleClose(item.label)} disableRipple>
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
                </div>
            </div>
            <div className="col-4 scrape-schedule">
            <div className="dropdown">
            <button className="btn btn-success dropdown-toggle drp-button-size" 
                    type="button"
                    aria-controls={evtOpen ? 'basic-evt-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={evtOpen ? 'true' : undefined}
                    onClick={handleEvtClick}
                    id="event-button">
                {eventOpt.label}
            </button>
            <Menu
              id="basic-evt-menu"
              anchorEl={evtAnchorEl}
              open={evtOpen}
              onClose={() => handleEvtClose(undefined)}
              MenuListProps={{
                'aria-labelledby': 'event-button',
              }}
            >
              {eventOptions && eventOptions.map((item) => (
                <MenuItem key={item.label} onClick={() => handleEvtClose(item)} disableRipple>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
            </div>
          </div>
            <div className="col-4 scrape-schedule">
                <button className="btn btn-success dropdown-toggle drp-button-size" onClick={() => displayAdditional()}>
                  Additional
                </button>
            </div>
          </div>
          <form id="setupScrape">
            <div className="row">
                <div className="selected-display col-11">
                  <div className="main-display-container">
                      <figcaption className="text-area-caption">
                      <b>{mainDisplayText}</b>
                      <div id="mainDisplay scrape-preview">
                        {scrapedText}
                        <FormControl sx={{ input: {color: 'white'} }}>
                          {showAdditional && <TextField 
                                                id="standard-basic" 
                                                label="CBSA" 
                                                variant="standard"
                                                value={cbsa}
                                                onChange={(event) => {
                                                  setCbsa(event.target.value);
                                                }} />}
                          {showAdditional && <TextField 
                                                id="standard-basic" 
                                                label="County FIPS" 
                                                variant="standard"
                                                value={countyFips}
                                                onChange={(event) => {
                                                  setCountyFips(event.target.value);
                                                }} />}
                          {showAdditional && <TextField 
                                                id="standard-basic" 
                                                label="State FIPS" 
                                                variant="standard"
                                                value={stateFips}
                                                onChange={(event) => {
                                                  setStateFips(event.target.value);
                                                }} />}
                          {showAdditional && <TextField 
                                                id="standard-basic" 
                                                label="Latitude" 
                                                variant="standard"
                                                value={latitude}
                                                onChange={(event) => {
                                                  setLatitude(event.target.value);
                                                }} />}
                          {showAdditional && <TextField 
                                                id="standard-basic" 
                                                label="Longitude" 
                                                variant="standard"
                                                value={longitude}
                                                onChange={(event) => {
                                                  setLongitude(event.target.value);
                                                }} />}
                        </FormControl>
                      </div>
                      </figcaption>
                  </div>
                </div>
                <div className="selected-btn-container col-1">
                  <div>
                <IconButton sx={{ color: 'white' }} edge="end" title="Add" disabled={addBtnDisabled} onClick={() => addEventProperty()}>
                  <AddIcon />
                </IconButton>
                </div>
                <div>
                <IconButton sx={{ color: 'white' }} edge="end" title="Clear" disabled={clearBtnDisabled} onClick={() => removeEventProperty()}>
                  <RemoveIcon />
                </IconButton>
                </div>
                </div>
            </div>
            <div className="row">
            <div className="col-4 scrape-select">
              <button id="disableSelect" type="button" className="btn btn-primary btn-danger nav-button reg-button-size" onClick={() => disableSelection()}>
                Disable
              </button>
              </div>
              <div className="col-3 scrape-select">
              <button id="downloadRecent" type="button" className="btn btn-primary btn-warning nav-button reg-button-size">
                Download Recent
              </button>
            </div>
            </div>
            <div className="row">
                <div className="col-3 scrape-verify">
                <button id="verify" type="button" className="btn btn-primary reg-button-size" onClick={() => verify()}>
                    Verify
                </button>
                <button disabled={submitDisabled} id="submitScrape" type="button" className="btn btn-success reg-button-size" onClick={() => submit()}>
                    Submit
                </button>
                <button id="clearSelected" type="button submit" className="btn btn-primary reg-button-size">
                    Clear
                </button>
                </div>
                <div className="col-9">
                <div className="list-contain">
                <figcaption className="text-area-caption">
                    Currently Selected
              </figcaption>
                    <List
                      sx={{
                        width: '100%',
                        maxWidth: 360,
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 'fit-content',
                        '& ul': { padding: 0 },
                      }} 
                      dense={true}>
                  {selectedEventList && selectedEventList.map(item => (
                    <ListItem
                      key={item.label}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => removeItem(item)}>
                          <RemoveIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={item.label}
                      />
                    </ListItem>
                  ))}
                </List>
                </div>
                </div>
            </div>
          </form>      
      </div>         
    );
  } else {
    // return nothing
    return null;
  }
}

const Scraper = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentEvent, setEvent] = useState(null);

  const setMyEvent = (event) => {
    setEvent(event);
    setActiveIndex(0);
  }

//  scrapersClick(e) {
//     console.log("scrapersClick");
//     if (!document.getElementById("scrapers").classNameList.contains("active")) {
//         e.preventDefault();
//         document.getElementById("scrapers").classNameList.add("active");
//         sb.classNameList.remove("active");
//         orginalSb = document.getElementById("mainContainer");
//         var tempSb = document.getElementById("mainContainer");
//         tempSb.remove();
    
//         var scrapersPage = document.createElement("DIV");
//         scrapersPage.id = "scrapersPage";
    
//         scrapersPage.innerHTML = `<div className="container"> 
//         <div className="card" style="width: 18rem;">
//          <div className="card-header">
//           My Event Scrapers
//             </div>
//             <ul className="list-group list-group-flush">
//             </ul>
//           </div>
//         </div>`;
    
//         document.body.appendChild(scrapersPage);
    
//         // find list-group-flush
//         var listGroup = document.querySelector(".list-group-flush");
    
//         // grab scrapeEvents from local session storage
//         chrome.storage.session.get("scrapeEvents", function (result) {
//           var scrapeEvents = result.scrapeEvents;
//           var hadItem = false;
    
//           if (scrapeEvents) {
//             // loop through scrapeEvents
//             for (var i = 0; i < scrapeEvents.length; i++) {
//               hadItem = true;
//               // create list item
//               var listItems = document.createElement("LI");
//               listItems.classNameList.add("list-group-item");
//               // make freuency dropdown menu
//               var frequencyDropdown = document.createElement("SELECT");
//               frequencyDropdown.classNameList.add("form-select");
//               frequencyDropdown.classNameList.add("frequencyDropdown");
//               // make option for once
//               var once = document.createElement("OPTION");
//               once.value = "once";
//               once.textContent = "Just Once";
//               // make option for every day
//               var everyDayOption = document.createElement("OPTION");
//               everyDayOption.value = "Every Day";
//               everyDayOption.textContent = "Every Day";
//               // make option for every other day
//               var everyOtherDayOption = document.createElement("OPTION");
//               everyOtherDayOption.value = "Every Other Day";
//               everyOtherDayOption.textContent = "Every Other Day";
//               // make option for every week
//               var everyWeekOption = document.createElement("OPTION");
//               everyWeekOption.value = "Every Week";
//               everyWeekOption.textContent = "Every Week";
//               // make option for every other week
//               var everyOtherWeekOption = document.createElement("OPTION");
//               everyOtherWeekOption.value = "Every Other Week";
//               everyOtherWeekOption.textContent = "Every Other Week";
//               // make option for every month
//               var everyMonthOption = document.createElement("OPTION");
//               everyMonthOption.value = "Every Month";
//               everyMonthOption.textContent = "Every Month";
//               // append options to dropdown
//               frequencyDropdown.appendChild(once);
//               frequencyDropdown.appendChild(everyDayOption);
//               frequencyDropdown.appendChild(everyOtherDayOption);
//               frequencyDropdown.appendChild(everyWeekOption);
//               frequencyDropdown.appendChild(everyOtherWeekOption);
//               frequencyDropdown.appendChild(everyMonthOption);
    
//               // create unique id for each dropdown
//               frequencyDropdown.id = "frequencyDropdown" + i;
    
//               // set frequency dropdown to correct value
//               if (scrapeEvents[i].frequency === "Every Day") {
//                 frequencyDropdown.value = "Every Day";
//               } else if (scrapeEvents[i].frequency === "Every Other Day") {
//                 frequencyDropdown.value = "Every Other Day";
//               } else if (scrapeEvents[i].frequency === "Every Week") {
//                 frequencyDropdown.value = "Every Week";
//               } else if (scrapeEvents[i].frequency === "Every Other Week") {
//                 frequencyDropdown.value = "Every Other Week";
//               } else if (scrapeEvents[i].frequency === "Every Month") {
//                 frequencyDropdown.value = "Every Month";
//               }
    
//               // make deep copy of scrapeEvent
//               var scrapeEventCopy = JSON.parse(JSON.stringify(scrapeEvents[i]));
//               // console.log(scrapeEventCopy);
//               frequencyDropdown.scrapeEvent = scrapeEventCopy;
    
//               // add event listener to frequency dropdown
//               frequencyDropdown.addEventListener("change", function (event) {
//                 console.log("frequencyDropdown change event");
//                 console.log(event);
//                 console.log(event.target.scrapeEvent);
//                 // get value of dropdown
//                 var frequency = event.target.value;
    
//                 // update scrapeEvent
//                 event.target.scrapeEvent.frequency = frequency;
//                 console.log(event.target.scrapeEvent);
//                 event.preventDefault();
    
//                 // update through scrape-fetch.js
//                 chrome.runtime.sendMessage({
//                   msg: "updateScrape",
//                   data: event.target.scrapeEvent,
//                 });
//               });
    
//               listItems.innerHTML =
//                 "<div><b>URL:</b> " +
//                 scrapeEvents[i].url +
//                 "</div>" +
//                 '<div><b className="freq' +
//                 i +
//                 '"">Frequency:</b> ' +
//                 "</div>" +
//                 '<div><b className="enabledDisplay' +
//                 [i] +
//                 '">Enabled: ' +
//                 scrapeEvents[i].enabled +
//                 "</b> " +
//                 "</div>";
    
//               // add frequency dropdown to className=freq+i
//               listItems.querySelector(".freq" + i).appendChild(frequencyDropdown);
    
//               // add button to list item
//               var button = document.createElement("BUTTON");
//               button.classNameList.add("btn", "btn-primary");
    
//               // add unique id to button
//               button.id = "button" + i;
//               // text for button enabled or disabled
//               var buttonText = "";
//               if (scrapeEvents[i].enabled == true) {
//                 button.style.backgroundColor = "red";
//                 buttonText = "Disable";
//               } else {
//                 button.style.backgroundColor = "blue";
//                 buttonText = "Enable";
//               }
//               button.textContent = buttonText;
    
//               // add scrapeEvent to button
//               button.scrapeEvent = scrapeEventCopy;
//               button.specialID = i;
    
//               button.addEventListener("click", function (event) {
//                 console.log(event);
//                 event.target.scrapeEvent.enabled =
//                   !event.target.scrapeEvent.enabled;
    
//                 // find enabledDisplay
//                 var enabledDisplay = document.querySelector(
//                   ".enabledDisplay" + event.target.specialID
//                 );
//                 // change button text
//                 if (button.textContent === "Enable") {
//                   enabledDisplay.textContent = "Enabled: true";
//                   event.target.style.backgroundColor = "red";
//                   event.target.textContent = "Disable";
//                 } else {
//                   enabledDisplay.textContent = "Enabled: false";
//                   event.target.style.backgroundColor = "blue";
//                   event.target.textContent = "Enable";
//                 }
//                 event.preventDefault();
    
//                 // update through scrape-fetch.js
//                 chrome.runtime.sendMessage({
//                   msg: "updateScrape",
//                   data: event.target.scrapeEvent,
//                 });
//               });
//               // add button to list item
//               listItems.appendChild(button);
    
//               // make delete button
//               var deleteButton = document.createElement("BUTTON");
//               deleteButton.classNameList.add("btn", "btn-danger");
//               deleteButton.textContent = "Delete";
//               deleteButton.scrapeEvent = scrapeEvents[i];
    
//               deleteButton.addEventListener("click", function (event) {
//                 // delete scrapeEvent
//                 chrome.runtime.sendMessage({
//                   msg: "deleteScrape",
//                   data: event.target.scrapeEvent,
//                 });
//                 // remove list item
//                 event.target.parentElement.remove();
//                 event.preventDefault();
//               });
    
//               // add delete button to list item
//               listItems.appendChild(deleteButton);
//               listGroup.appendChild(listItems);
//             }
//           }
    
//           if (hadItem == false) {
//             var listItems = document.createElement("LI");
//             listItems.classNameList.add("list-group-item");
//             listItems.textContent = "No items";
//             listGroup.appendChild(listItems);
//           }
//         });
//       }
// }

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                <Navbar.Brand>Scrape Builder</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#builder" onClick={() => setActiveIndex(0)}>
                        Builder
                    </Nav.Link>
                    <Nav.Link href="#scrapers" onClick={() => setActiveIndex(1)}>
                        Scrapers
                    </Nav.Link>
                    {props.user.is_admin &&
                    <Nav.Link href="#admin" onClick={() => setActiveIndex(2)}>
                        Admin
                    </Nav.Link>
                    }
                </Nav>
                <Back />
                </Container>
            </Navbar>
            <ScraperBuild
              isActive={activeIndex === 0}
              currentEvent={currentEvent}
            />
            <ScrapersPage
              isActive={activeIndex === 1}
            />
            <AdminPage
              isActive={activeIndex === 2}
              setEvent={setMyEvent}
            />
        </div>
    );
}

export default Scraper;