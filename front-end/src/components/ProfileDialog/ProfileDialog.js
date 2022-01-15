import React,  { useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import UserContext from '../../contexts/UserContext';
import './ProfileDialog.css';

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const ProfileDialog = (props) => {
  const {user, setUser} = useContext(UserContext);
  const open = props.openDialog;
  const profilePicUrl = user.profile.profilePicUrl;
/**
 * Handler to close the Dialog. 
 */
  const handleClose = () => {
      if(props.handleProfileDialogClose) {
        props.handleProfileDialogClose();
      }
  };

  /**
   * Handle the user sign-out.
   */
  const handleSignOut = () => {
        localStorage.setItem("todouserinfo", null);
        setUser(null);
  };


  return (
    <div className='ProfileDialog'>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle className='ProfileDialog-header-wrapper' style={{ cursor: 'move' }} id="draggable-dialog-title">
            <img src={profilePicUrl} className="AppBar-user-profile-pic" />
            <p>{user?.profile?.name}</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSignOut} className='ProfileDialog-sign-out'>Sign Out</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProfileDialog;
