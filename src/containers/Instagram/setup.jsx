import React from "react";
import Back from "../Common/back";
import ScheduleDropdown from "../Common/scheduleDropdown";
import * as scrape from "../../pages/Background/scrape-fetch.js";

const Setup = (props) => {
    const { isActive } = props;
    const [scheduleText, setSchedule] = React.useState("Schedule");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
    const handleClose = (row, label) => {
        if(label) {
            setSchedule(label);
        }

        setAnchorEl(null);
    };

    const handleSave = () => {
        const profile = document.getElementById("profileText").value;
        if(profile) {
            scrape.saveIGProfile({profile: profile, frequency: scheduleText}).then( (res) => {
                if(res) {
                    props.setActive(false);
                }
            });
        }

        // clear text
        document.getElementById("profileText").value = "";
        setSchedule("Schedule");
    };

    if(!isActive) {
        return null;
    }

    return (
    <div>
        <div className="container" id="mainContainer" style={{ marginTop: '4%' }}>
            <div className="row">
            <div className="col">
                <div className="input-group mb-3">
                <input id="profileText" type="text" className="form-control" placeholder="Instagram Profile"
                    aria-label="ig-profile" aria-describedby="button-addon1" />
                </div>
            </div>
            </div>
            <div className="row">
                <div className="col">
                    <ScheduleDropdown
                        scheduleText={scheduleText}
                        anchorEl={anchorEl}
                        open={open}
                        handleClick={handleClick}
                        handleClose={handleClose}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-primary nav-button reg-button-size" type="button" id="scrape" onClick={() => handleSave()}>
                    Save
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Setup;