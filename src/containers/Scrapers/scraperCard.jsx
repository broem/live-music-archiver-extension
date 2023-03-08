import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ScheduleDropdown from "../Common/scheduleDropdown.jsx";
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import * as scrape from "../../pages/Background/scrape-fetch.js";


const ScraperCard = (props) => {
    const [currentScraper, setCurrentScraper] = React.useState(props.scraper);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [enabled, setEnabled] = React.useState(props.scraper.enabled);
    const [updateDisabled, setUpdateDisabled] = React.useState(true);
    const [name, setName] = React.useState(props.scraper.name);
    const open = Boolean(anchorEl);

    const handleFrequencyClick = (event, row) => {
        setAnchorEl(event.currentTarget);
      };
    
    const handleFrequencyClose = (row, label) => {
        if(label) {
            // set current scraper to row with new frequency
            currentScraper.frequency = label;
            setCurrentScraper(currentScraper);
            setUpdateDisabled(false);
        }
        setAnchorEl(null);
    };

    const downloadRecent = (scraper) => {
        scrape.downloadRecent(scraper).then( (res) => {
          if(res) {
            var blob = new Blob([res], { type: "text/csv" });
            var resultURL = window.URL.createObjectURL(blob);
            // create download link
            var downloadLink = document.createElement("a");
            downloadLink.href = resultURL;
            downloadLink.download = "recent.csv";
            // click download link
            downloadLink.click();
          }
        });
      }

    const handleEnabledClick = () => {
        // set current scraper to have new enabled value
        currentScraper.enabled = !currentScraper.enabled;
        setCurrentScraper(currentScraper);
        setEnabled(!enabled);
        setUpdateDisabled(false);
    };

    const handleSetName = (event) => {
        currentScraper.name = event.target.value;
        setName(event.target.value);
        setCurrentScraper(currentScraper);
        setUpdateDisabled(false);
    };

    const handleUpdate = () => {
        scrape.updateScrape(currentScraper).then((data) => {
            setUpdateDisabled(true);
        });
    };

    return (
        <Card variant="outlined" className='scraperCard'>
            <CardContent>
                <div style={{marginBottom: '0.5em'}}>
                <TextField 
                    id="standard-basic" 
                    label="Scraper Name" 
                    variant="standard"
                    value={name}
                    onChange={(event) => handleSetName(event)}
                />
                </div>
            <div className="row">
                <Typography className='col-2' sx={{ mb: 1.5 }} color="text.secondary">
                Frequency:
                </Typography>
                <div className='col-10'>
                    <ScheduleDropdown
                    row={currentScraper}
                    scheduleText={currentScraper.frequency}
                    anchorEl={anchorEl}
                    open={open}
                    handleClick={handleFrequencyClick}
                    handleClose={handleFrequencyClose}
                    />
                </div>
            </div>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                URL: {currentScraper.url}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Enabled: 
                <Checkbox
                checked={enabled}
                inputProps={{ 'aria-label': 'controlled' }}
                onChange={() => handleEnabledClick()}
                />
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Last Run: {currentScraper.lastRun}
            </Typography>
            </CardContent>
            <CardActions>
            <Button disabled={updateDisabled} size="small" onClick={() => handleUpdate(currentScraper)}>Update</Button>
            <Button size="small" onClick={() => props.setEvent(currentScraper)}>Rebuild</Button>
            <Button size="small" onClick={() => downloadRecent(currentScraper)}>Download Recent</Button>
            <Button 
                size="small" 
                color='error'
                onClick={() => props.onDelete(currentScraper)}
            >
                Delete
            </Button>
            </CardActions>
        </Card>
    );
};

export default ScraperCard;