import React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect } from "react";
import * as scrape from "../../pages/Background/scrape-fetch.js";

const card = (props) => {
  console.log("card");
  console.log(props);

  // pull scraper from props
  // return a card with the scraper name
  let scraper = props;

  return (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {scraper.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Frequency: {scraper.frequency}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          URL: {scraper.url}
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Update</Button>
      </CardActions>
    </React.Fragment>
  );
  } 

const ScrapersPage = (props) => {
  const { isActive } = props;
  const [scrapers, setScrapers] = React.useState([]);
  
  useEffect(() => {
    scrape.getCurrentScrapeEvents().then((data) => {
      console.log(data);
      if(!!!data) {
        return;
      }
      setScrapers(data);
    });
  }, []);

  if(isActive) {

    // call server to get scrapers
    // map over scrapers and create a card for each one
    // return the cards

    let cards = [];

    // only call the server if we just switched to this tab
    return (
      <div>
        <div className="scraperTitle">
          My Event Scrapers
        </div>
        <Box className="scraperCard" sx={{ minWidth: 275 }}>
          <Card variant="outlined">
            {scrapers.map((scraper) => {
              return card(scraper);
            })}
          </Card>
        </Box>
      </div>
    );
  } else {
    return null;
  }
}

export default ScrapersPage;