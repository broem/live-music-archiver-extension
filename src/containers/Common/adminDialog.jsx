import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AdminDialog = (props) => {
  const [open, setOpen] = React.useState(props.open);
  const fullWidth = true;

  const handleClose = () => {
    props.setClose();
  };

  const displayScraperName = () => {
    console.log(props.data);
    if (props.data && props.data.name && props.data.name.length > 0) {
        return props.data.name;
    } else {
        return "Untitled";
    }
    }


  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth='lg'
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{displayScraperName()}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminDialog;