import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from "react";
import * as scrape from "../../pages/Background/scrape-fetch.js";

const AdminDialog = (props) => {
  const [open, setOpen] = React.useState(props.open);
  // grab the data from the props
  const [data, setData] = React.useState(props.data);
  const [headers, setHeaders] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [bodyText, setBodyText] = React.useState("");
  const fullWidth = true;

  console.log("Admin Dialog");
  console.log(data);

  useEffect(() => {
    // timeout for 1 second

      // set the open to the props
      setBodyText("Loading...");

    scrape.adminRecentEvents({
      id: props.data.mapID,
      user: props.data.userID,
    }).then((data) => {
      if(!!!data) {
        setBodyText("No Events!");
        return;
      }

      // set the rows to the data
      setBodyText("Recent Events" + " (" + data.events.length + ")");
      setHeaders(data.headers);
      setRows(data.events);
    });
  }, []);

  const handleClose = () => {
    props.setClose();
  };

  const displayScraperName = () => {
    console.log(props.data);
    if (props.data && props.data.name && props.data.name.length > 0) {
        return props.data.name;
    } else {
        return "Untitled Scraper";
    }
  }

  const displayTableHeaders = () => {
    console.log("displayTableHeaders");
      return (
      <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={headers}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
      );
  }


  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth='false'
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{displayScraperName()}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {bodyText}
          </DialogContentText>
            {headers.length > 0 && displayTableHeaders()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminDialog;