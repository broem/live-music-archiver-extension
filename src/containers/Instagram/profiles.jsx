import React from "react";
import { useEffect } from "react";
import Box from '@mui/material/Box';
import * as scrape from "../../pages/Background/scrape-fetch.js";
import ProfileCard from "./profileCard.jsx";

const Profiles = (props) => {
    const { isActive } = props;
    const [profiles, setProfiles] = React.useState([]);
    const [currentProfile, setCurrentProfile] = React.useState(null);
    const [deleteRequest, setDeleteRequest] = React.useState(false);

    useEffect(() => {
        if(!isActive) { return; }
        scrape.getCurrentIGScrapeEvents().then((data) => {
            if(!!!data) {
                return;
            }
            setProfiles(data);
        });
    }, [isActive]);

    const onDelete = (profile) => {
        setCurrentProfile(profile);
        setDeleteRequest(true);
      }
    
    const handleAlertConfirm = () => {
        setDeleteRequest(false);
        scrape.deleteIGScrape({mapID: currentScraper.mapID}).then((data) => {
        });
        removeProfile(currentScraper);
    };

    const handleAlertClose = () => {
        setDeleteRequest(false);
    }

    const removeProfile = (remove) => {
        let newProfiles = profiles;
        newProfiles.forEach((profile, index) => {
            if(remove.mapID === profile.mapID) {
                newProfiles.splice(index, 1);
            }
        });
        setProfiles(newProfiles);
    }


    if(!isActive) {
        return null;
    }

    return (
        <div>
            <div className="scraperTitle">
            My IG Profile Scrapers
            </div>
            <Box className="scraperContainer" sx={{ minWidth: 275 }}>
            {profiles.map((profile) => (
            <ProfileCard
                className="scraperCard"
                key={profile.mapID}
                profile={profile}
                onDelete={onDelete}
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
    )
}

export default Profiles;