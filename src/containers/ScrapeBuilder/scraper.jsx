import React, { useLayoutEffect } from "react";
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
import * as constants from "../constants.js";
import { useEffect } from "react";
import ScrapersPage from "../Scrapers/scrapers";
import AdminPage from "../Admin/admin";
import ScheduleDropdown from "../Common/scheduleDropdown";
import { alpha, styled } from '@mui/material/styles';

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

const ScraperTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'white',
    '&.Mui-focused': {
      color: 'white',
    },
  }, 
  marginBottom: '1.5em',
  input: {
    color: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: 'white',
  },
  '& .MuiInput-underline:hover': {
    borderBottomColor: 'white',
  },
}));

const ScraperBuild = (props) => {
  // get onShow and isActive from props
  const { onShow, isActive, currentEvent } = props;

  // pull event options from props
  // const [currentEvent, setCurrentEvent] = React.useState(props.currentEvent);
  const [event, setEvent] = React.useState(null);
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
  const [facebookURL, setFacebookURL] = React.useState("");
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

  // useEffect to set the event
  useEffect(() => {
      if(currentEvent !== null) {
        console.log("Setting my cool event");
        setSchedule(currentEvent.frequency);
        setName(currentEvent.name);

        // send message to background to open a new tab to the event url
        chrome.runtime.sendMessage({msg: "openTab", url: currentEvent.url}).then((response) => {
          // resize the window
          window.resizeTo(628, 628);
              // grab the builder from the backend
            scrape.getBuilder(currentEvent.mapID).then((data) => {
              setMainDisplay(mainDisplayDefault);

              setCbsa(data.cbsa);
              setCountyFips(data.countyFips);
              setStateFips(data.stateFips);
              setLongitude(data.longitude);
              setLatitude(data.latitude);

              // set the selected event list, go through each property and add it to the list
              let eventList = [];
              for (let property in data) {
                if (data.hasOwnProperty(property)) {
                  console.log(property);
                  console.log(data[property]);
                  // if there is a filled label, add it to the list
                  if(data[property].label && data[property].label !== "") {
                    eventList.push({
                      key: data[property].value,
                      label: data[property].label, 
                      value: data[property].value, 
                      selectable: data[property],
                      val: data[property]
                    });
                    // filter eventoptions to remove any that are not in the event list
                    eventOptions = eventOptions.filter(x => x.label !== data[property].label)
                  }

                  // sort the event list so label === Event Area is first. this will make it easier. 
                  eventList.sort(function(a, b) {
                    if(a.label === "Event Area") {
                      return -1;
                    } else {
                      return 1;
                    }
                  });
                }
              }
              // wait for 1 second to send the event list to the background
              setTimeout(function() {
                console.log("sending event list");
                // send event list to background to highlight the elements
                chrome.runtime.sendMessage({msg: "highlightElements", data: eventList})
              }, 1000);
              setEventList(eventList);
            });
          });
    }
  }, [currentEvent]);

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

  const handleClose = (row, label) => {
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
      venueFacebookURL: facebookURL,
      frequency: scheduleText,
      cbsa: cbsa,
      stateFips: stateFips,
      countyFips: countyFips,
      latitude: latitude,
      longitude: longitude,
      name: name,
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
    // TODO handle error
    scrape.verified({
      mapId: verifySuccessMessage.mapId,
      enabled: true,
    });

    clear();
  }

  const clear = () => {
    setShowAdditional(false);
    // reset the eventOptions from the selectedEventList
    selectedEventList.forEach((item) => {
      eventOptions.push(item);
      chrome.runtime.sendMessage({
        msg: "removeElement",
        field: item.value,
      });
    });

    setMainDisplay(mainDisplayDefault);
    setScrapedText("");

    // remove all the selectedEventList
    setEventList([]);
    setFacebookURL("");
    setName("");
    setLatitude("");
    setLongitude("");
    setCountyFips("");
    setStateFips("");
    setCbsa("");


    // reset the schedule
    handleClose("Schedule");

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

  const temp = () => {
    chrome.runtime.sendMessage({msg: "highlightElements", data: selectedEventList});
  }

  
  if(isActive) {
    return (
      <div className="container" id="mainContainer">
          <div className="row">
            <div className="col-6 scrape-schedule">
            <ScraperTextField
              id="standard-basic" 
              label="Scraper Name" 
              variant="standard"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />  
            </div>
          </div>
          <div className="row">
            <div className="col-4 scrape-schedule">
                <div className="dropdown">
                  <ScheduleDropdown
                    scheduleText={scheduleText}
                    anchorEl={anchorEl}
                    open={open}
                    handleClick={handleClick}
                    handleClose={handleClose}
                  />
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
                        {showAdditional && <ScraperTextField 
                                                id="standard-basic" 
                                                label="Facebook URL" 
                                                variant="standard"
                                                value={facebookURL}
                                                onChange={(event) => {
                                                  setFacebookURL(event.target.value);
                                                }} />}
                          {showAdditional && <ScraperTextField 
                                                id="standard-basic" 
                                                label="CBSA" 
                                                variant="standard"
                                                value={cbsa}
                                                onChange={(event) => {
                                                  setCbsa(event.target.value);
                                                }} />}
                          {showAdditional && <ScraperTextField 
                                                id="standard-basic" 
                                                label="County FIPS" 
                                                variant="standard"
                                                value={countyFips}
                                                onChange={(event) => {
                                                  setCountyFips(event.target.value);
                                                }} />}
                          {showAdditional && <ScraperTextField 
                                                id="standard-basic" 
                                                label="State FIPS" 
                                                variant="standard"
                                                value={stateFips}
                                                onChange={(event) => {
                                                  setStateFips(event.target.value);
                                                }} />}
                          {showAdditional && <ScraperTextField 
                                                id="standard-basic" 
                                                label="Latitude" 
                                                variant="standard"
                                                value={latitude}
                                                onChange={(event) => {
                                                  setLatitude(event.target.value);
                                                }} />}
                          {showAdditional && <ScraperTextField 
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
              <div className="col-4 scrape-select">
              </div>
              <div className="col-4 scrape-select">
              <button id="repopulateBtn" type="button" className="btn btn-primary btn-warning nav-button reg-button-size" onClick={() => temp()}>
                Repopulate Page
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
                <button id="btnCleared" type="button" className="btn btn-primary reg-button-size" onClick={() => clear()}>
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

  const setAdminActive = () => {
    setActiveIndex(2);
    // set window to full height and width
    window.resizeTo(screen.availWidth, screen.availHeight);
  }

  const setNonAdminActive = (index) => {
    setActiveIndex(index);
    // set window to default size
    window.resizeTo(628, 628);
  }


    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                <Navbar.Brand>Scrape Builder</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#builder" onClick={() => setNonAdminActive(0)}>
                        Builder
                    </Nav.Link>
                    <Nav.Link href="#scrapers" onClick={() => setNonAdminActive(1)}>
                        Scrapers
                    </Nav.Link>
                    {props.user.is_admin &&
                    <Nav.Link href="#admin" onClick={() => setAdminActive()}>
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
              setEvent={setMyEvent}
            />
            <AdminPage
              isActive={activeIndex === 2}
              setEvent={setMyEvent}
            />
        </div>
    );
}

export default Scraper;