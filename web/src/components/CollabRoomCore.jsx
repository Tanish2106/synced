/*
    Synced
    Copyright (C) 2024  Atheesh Thirumalairajan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import * as React from 'react';
import { Badge, Box, Button, Dialog, DialogContent, Divider, LinearProgress, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import Drawer from '@mui/material/Drawer';
import SettingsIcon from '@mui/icons-material/Settings';
import CollabRoomPanelPlaylist from './CollabRoomPanelPlaylist';
import CollabRoomPanelChats from './CollabRoomPanelChats';
import SyncedCollabController from '../middleware/SyncedCollabController';
import CollabRoomPanelUsers from './CollabRoomPanelUsers';

/* Static variable for re-renders */
let staticCurrentTab = 0;

const CollabRoomCore = (props) => {
    /* React Router Objects */
    const socket = props.socket;
    const navigate = useNavigate();
    const location = useLocation();

    const DialogLoadingPage = (props) => {
        return (
            <Box
                sx={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }}
            >
                <Typography sx={{ fontWeight: 'bold' }} variant='h6'>{props.title}</Typography>
                <LinearProgress sx={{ width: '90%', marginTop: '5px' }} variant='indeterminate' />
            </Box>
        );
    }

    const DialogRoomJoinError = (props) => {
        return (
            <Box
                sx={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }}
            >
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <ErrorIcon sx={{ color: 'primary.main', fontSize: '3.5rem' }} />
                    <Typography mt="6px" sx={{ color: 'primary.main' }} variant='h5'>{props.title}</Typography>
                </Box>
                <Button onClick={() => { navigate("/") }} variant="contained" sx={{ marginTop: '25px', minWidth: { xs: '80%', md: '40%' } }}>Go Back</Button>
            </Box>
        );
    }

    /* Set Tab Names */
    const PLAYLIST_TAB = 0;
    const MESSAGES_TAB = 1;
    const USERS_TAB = 2;
    const SETTINGS_TAB = 3;

    /* Set Required States */
    const [currentTab, setCurrentTab] = React.useState(PLAYLIST_TAB);
    const [dialogPage, setDialogPage] = React.useState(<DialogLoadingPage title="📡 Establishing Connection..." />);
    const [dialogOpen, setDialogOpen] = React.useState(true);
    const [isJoined, setIsJoined] = React.useState(false);

    /* Set Message Notification States */
    const [unreadMessages, setUnreadMessages] = React.useState(0);

    /* Split Pathname to get RoomId */
    const roomId = SyncedCollabController.getRoomId(location.pathname);

    const initRTCMiddleware = () => {
        /* Configure SocketIO Middleware */
        socket.emit("fe-rooms-join", roomId, (err, res) => {
            if (err) return setDialogPage(<DialogRoomJoinError title={err} />);
            if (res.waitlisted) return setDialogPage(<DialogLoadingPage title="🔒 Asking to be let in..." />);

            /* We've Joined the Room */
            setIsJoined(true);
            setDialogOpen(false);
        });

        /* Waitlist Resolution Message, ::waitlist group */
        socket.on('be-rooms-waitlistResolution', (req) => {
            if (req.approved) {
                setIsJoined(true);
                setDialogOpen(false);
            } else {
                setDialogPage(<DialogRoomJoinError title="You can't join this Room" />)
            }
        });
    }

    /* Define Handlers */
    const handleDrawerTabChange = (e, newValue) => {        
        /* Change Tab */
        staticCurrentTab = newValue;
        setCurrentTab(newValue);

        /* Clear Notifications */
        if (staticCurrentTab == MESSAGES_TAB) setUnreadMessages(0);
    }

    React.useEffect(() => {
        /* Configure RTC Middleware */
        initRTCMiddleware();
    }, []);

    React.useEffect(() => {
        if (isJoined == true) {
            /* Listen for Tab Change Events */
            socket.on('be-rooms-guestJoinRequest', (req) => {
                setCurrentTab(2);
            });

            socket.on('be-chats-message', (req) => {
                if (staticCurrentTab != MESSAGES_TAB) setUnreadMessages((unreadMessages) => unreadMessages + 1);
            })
        }
    }, [isJoined]);

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Drawer
                open
                variant="permanent"
                anchor="right"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: { xs: '35%', md: '25%' },
                    },
                }}
            >
                { /* Add Toolbar for TopMargin */}
                <Toolbar />

                { /* Add Drawer Components Here */}
                <Box sx={{ display: 'flex', height: 'calc(100% - 64px)', width: '100%' }}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={currentTab}
                        onChange={handleDrawerTabChange}
                        sx={{
                            width: '90px'
                        }}
                    >
                        <Tab icon={<LiveTvIcon />} />
                        <Tab icon={<Badge color='primary' badgeContent={unreadMessages} max={99}><MessageIcon /></Badge>} />
                        <Tab icon={<GroupIcon />} />
                        <Tab icon={<SettingsIcon />} />
                    </Tabs>
                    <Divider orientation='vertical' />
                    <Box sx={{ flexGrow: 1, overflow: 'auto', maxWidth: 'calc(100% - 90px)', maxHeight: '100%' }}>
                        <CollabRoomPanelPlaylist sx={{ display: (currentTab == PLAYLIST_TAB ? 'flex' : 'none') }} />
                        <CollabRoomPanelChats socket={socket} sx={{ display: (currentTab == MESSAGES_TAB ? 'flex' : 'none') }} />
                        <CollabRoomPanelUsers socket={socket} sx={{ display: (currentTab == USERS_TAB ? 'flex' : 'none') }} />
                    </Box>
                </Box>
            </Drawer>
            <Dialog PaperProps={{ sx: { minHeight: "60%" } }} fullWidth maxWidth="md" open={dialogOpen}>
                { /* If height: 1px; not set, Child will not inherit 100% height */}
                <DialogContent sx={{ height: '1px' }}>{dialogPage}</DialogContent>
            </Dialog>
        </Box>
    );
}

export default CollabRoomCore;