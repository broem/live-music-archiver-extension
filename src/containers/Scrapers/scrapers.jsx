import React from "react";
import Box from '@mui/material/Box';
import { useEffect } from "react";
import * as scrape from "../../pages/Background/scrape-fetch.js";
import ScraperCard from "./scraperCard.jsx";
import AlertDialog from "../Common/alertDialog.jsx";

const ScrapersPage = (props) => {
  const { isActive } = props;
  const [scrapers, setScrapers] = React.useState([]);
  const [currentScraper, setCurrentScraper] = React.useState(null);
  const [deleteRequest, setDeleteRequest] = React.useState(false);

  // pull scraper from props
  // return a card with the scraper name
 
  const updateScrapers = () => {
    let newScrapers = scrapers;
    newScrapers.forEach((scraper) => {
      if(scraper.mapID === currentScraper.mapID) {
        scraper.frequency = currentScraper.frequency;
        scraper.enabled = currentScraper.enabled;
      }
    });
    setScrapers(newScrapers);
  }

  const removeScraper = (incoming) => {
    let newScrapers = scrapers;
    newScrapers.forEach((scraper, index) => {
      if(incoming.mapID === scraper.mapID) {
        newScrapers.splice(index, 1);
      }
    });
    setScrapers(newScrapers);
  }

  const onDelete = (scraper) => {
    setCurrentScraper(scraper);
    setDeleteRequest(true);
  }

  const handleAlertConfirm = () => {
    setDeleteRequest(false);
    scrape.deleteScrape({mapID: currentScraper.mapID}).then((data) => {
    });
    removeScraper(currentScraper);
  };

  const handleAlertClose = () => {
    setDeleteRequest(false);
  }

  useEffect(() => {
    if(!isActive) { return; }
    scrape.getCurrentScrapeEvents().then((data) => {
      if(!!!data) {
        return;
      }
      setScrapers(data);
    });
  }, [isActive]);

  onload = () => {
    console.log("scrapers loaded");
  }

  if(isActive) {
    return (
      <div>
        <div className="scraperTitle">
          My Event Scrapers
        </div>
        <Box className="scraperContainer" sx={{ minWidth: 275 }}>
        {scrapers.map((scraper) => (
          <ScraperCard
            className="scraperCard"
            key={scraper.mapID}
            scraper={scraper}
            onDelete={onDelete}
            setEvent={props.setEvent}
          />
        ))}
        </Box>
        {deleteRequest ? <AlertDialog
          open={deleteRequest}
          onClose={handleAlertClose}
          title="Delete Scraper"
          message="Are you sure you want to delete this scraper?"
          onConfirm={handleAlertConfirm}
        /> : null}
      </div>
    );
  } else {
    return null;
  }
}

export default ScrapersPage;