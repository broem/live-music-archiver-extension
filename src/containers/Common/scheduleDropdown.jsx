import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as constants from '../constants.js';

// props: scheduleText, anchorEl, open, handleClick, handleClose
const ScheduleDropdown = (props) => {
    const [scheduleText, setScheduleText] = React.useState(props.scheduleText);

    // handleClose
    const handleClose = (value) => {
        setScheduleText(value);
        props.handleClose(props.row, value);
    };

    return (
        <div className="dropdown">
        <button className="btn btn-secondary dropdown-toggle drp-button-size" type="button"
            aria-controls={props.open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={props.open ? 'true' : undefined}
            onClick={props.handleClick}
            id="basic-button">
              {props.scheduleText}
        </button>
        <Menu
          id="basic-menu"
          anchorEl={props.anchorEl}
          open={props.open}
          onClose={() => props.handleClose(undefined)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {constants.scheduleOptions && constants.scheduleOptions.map((item) => (
            <MenuItem key={item.label} value={item.label} onClick={() => handleClose(item.label)} disableRipple>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
}

export default ScheduleDropdown;