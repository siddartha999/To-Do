import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import UserContext from '../../contexts/UserContext';
import "./AppBar.css";
import "../ProfileDialog/ProfileDialog";
import ProfileDialog from '../ProfileDialog/ProfileDialog';

const ButtonAppBar = () => {
    const {user} = useContext(UserContext);
    const profilePicUrl = user.profile.profilePicUrl;
    const profileName = user.profile.name;
    const [openProfileDialog, setOpenProfileDialog] = useState(false);

    /**
     * Handler to open the Profile dialog.
     */
    const handleProfileDialogOpen = () => {
        setOpenProfileDialog(true);
    };

    /**
     * Handler to close the Profile dialog.
     */
    const handleProfileDialogClose = () => {
        setOpenProfileDialog(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    To Dos
                </Typography>
                <Button color="inherit" onClick={handleProfileDialogOpen}>
                    <img src={profilePicUrl} className="AppBar-user-profile-pic" title={profileName} />
                </Button>
                </Toolbar>
            </AppBar>
            <ProfileDialog openDialog={openProfileDialog} handleProfileDialogClose={handleProfileDialogClose} />
        </Box>
    );
};

export default ButtonAppBar;
