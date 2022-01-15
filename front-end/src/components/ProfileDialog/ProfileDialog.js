import React,  { useEffect, useContext, useState } from 'react';
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
import axios from 'axios';
import SnackbarContext  from '../../contexts/SnackbarContext';
import ProgressBar from 'react-customizable-progressbar';
import ScreenWidthContext from '../../contexts/ScreenWidthContext';

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
    const {raiseSnackbarMessage} = useContext(SnackbarContext);
    const [userStats, setUserStats] = useState(null);
    const open = props.openDialog;
    const profilePicUrl = user.profile.profilePicUrl;
    const token = user?.token;
    const width = useContext(ScreenWidthContext);
    if(!token) {
        raiseSnackbarMessage('Unable to Authenticate the User. Please login again', 'error');
        localStorage.setItem("todouserinfo", null);
        setUser(null);
    }

    const averageCompleted = userStats ? (userStats.completedTasks / (userStats.currentTasks || 0 + userStats.completedTasks || 0)) * 100 : 0;

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

    /**
     * Fetch the user's stats on component load.
     */
    useEffect(async() => {
        try {
            const response = await axios({
                method: 'GET',
                url: process.env.REACT_APP_SERVER_URL + '/api/tasks/stats',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            setUserStats(response.data);
        }
        catch(err) {
            if(err?.response?.status === 401) {
                raiseSnackbarMessage(err.response.data.message, 'error');
                localStorage.setItem("todouserinfo", null);
                setUser(null);
            }
            else {
                raiseSnackbarMessage(err.response.data.message, 'error');
            }
        }
    }, [open]);


    return (
        <div className='ProfileDialog'>
        <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            className={`ProfileDialog ${width < 700 ? 'mobile700' : null}`}
        >
            <DialogTitle className='ProfileDialog-header-wrapper' style={{ cursor: 'move' }} id="draggable-dialog-title">
                <img src={profilePicUrl} className="AppBar-user-profile-pic" />
                <p>{user?.profile?.name}</p>
            </DialogTitle>
            <DialogContent>
                { userStats ?
                    <div className='ProfileDialog-stats-wrapper'>
                        <div className='ProfileDialog-progress-wrapper'>
                            <ProgressBar
                                progress={averageCompleted.toFixed(2)}
                                radius={100}
                                className={`${averageCompleted > 75 ? 'green' : averageCompleted > 50 ? 'orange' : 'red'}`}
                            >
                                <span className="Profile-stats-rating-content">{userStats.completedTasks || 0} / {userStats.completedTasks || 0 + userStats.currentTasks || 0}</span>
                            </ProgressBar>
                        </div>
                        <div className='ProfileDialog-stats-content-wrapper'>
                            <p>{userStats.completedTasks || 0} tasks Completed</p>
                            <p>{userStats.currentTasks || 0} tasks In-progress</p>
                        </div>
                    </div>
                    : <p className='ProfileDialog-no-stats'>No Stats to display</p>
                }
            </DialogContent>
            <DialogActions>
            <Button onClick={handleSignOut} className='ProfileDialog-sign-out'>Sign Out</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default ProfileDialog;
