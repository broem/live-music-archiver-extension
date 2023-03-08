import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ScheduleDropdown from "../Common/scheduleDropdown.jsx";
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import * as scrape from "../../pages/Background/scrape-fetch.js";

const ProfileCard = (props) => {
    const [currentProfile, setCurrentProfile] = React.useState(props.profile);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [enabled, setEnabled] = React.useState(props.profile.enabled);
    const [updateDisabled, setUpdateDisabled] = React.useState(true);
    const [name, setName] = React.useState(props.profile.profile);
    const open = Boolean(anchorEl);

    const handleFrequencyClick = (event, row) => {
        setAnchorEl(event.currentTarget);
      };
    
    const handleFrequencyClose = (row, label) => {
        if(label) {
            // set current scraper to row with new frequency
            currentProfile.frequency = label;
            setCurrentProfile(currentProfile);
            setUpdateDisabled(false);
        }
        setAnchorEl(null);
    };

    const handleSetName = (event) => {
        currentProfile.profile = event.target.value;
        setName(event.target.value);
        setCurrentProfile(currentProfile);
        setUpdateDisabled(false);
    };

    const handleEnabledClick = () => {
        // set current scraper to have new enabled value
        currentProfile.enabled = !currentProfile.enabled;
        setCurrentProfile(currentProfile);
        setEnabled(!enabled);
        setUpdateDisabled(false);
    };

    const downloadRecent = (profile) => {
        scrape.downloadIGRecent(profile).then( (res) => {
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

    const handleUpdate = () => {
        // update scraper in background
        scrape.updateIGScraper(currentProfile).then( (res) => {
            if(res) {
                setUpdateDisabled(true);
            }
        });
        setUpdateDisabled(true);
    }

    return (
        <Card variant="outlined" className='profileCard'>
            <CardContent>
                <div style={{marginBottom: '0.5em'}}>
                <TextField
                    disabled={true}
                    id="standard-basic" 
                    label="IG Profile Name" 
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
                        scheduleText={currentProfile.frequency}
                        anchorEl={anchorEl}
                        open={open}
                        handleClick={handleFrequencyClick}
                        handleClose={handleFrequencyClose}
                    />
                </div>
            </div>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Enabled: 
                <Checkbox
                checked={enabled}
                inputProps={{ 'aria-label': 'controlled' }}
                onChange={() => handleEnabledClick()}
                />
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Last Run: {currentProfile.lastRun}
            </Typography>
            </CardContent>
            <CardActions>
            <Button disabled={updateDisabled} size="small" onClick={() => handleUpdate(currentProfile)}>Update</Button>
            <Button size="small" onClick={() => downloadRecent(currentProfile)}>Download Recent</Button>
            <Button 
                size="small" 
                color='error'
                onClick={() => props.onDelete(currentProfile)}
            >
                Delete
            </Button>
            </CardActions>
        </Card>
    )
}

export default ProfileCard;