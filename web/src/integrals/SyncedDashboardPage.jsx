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

import { Avatar, Box, Divider, IconButton, Stack, Toolbar, Typography, ListItemAvatar, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SyncedAppThemeController from "../middleware/SyncedAppThemeController";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CollabJoinOptions from "../components/CollabJoinOptions";
import Groups2Icon from '@mui/icons-material/Groups2';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import React from "react";
import SyncedAppConfig from "../middleware/SyncedAppConfig";
import { io } from "socket.io-client";
import CollabRoomCore from "../components/CollabRoomCore";

const SyncedDashboardPage = (props) => {
    /* Establish SocketIO Connection */
    const establishWsConnection = () => {
        return io(
            SyncedAppConfig.getWsURL(),
            {
                path: '/rtc/collab',
                withCredentials: true
            }
        );
    }

    /* Define Required Instance Variables */
    const location = useLocation();
    const [socket, setSocket] = React.useState(establishWsConnection());
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [hasBackground, setHasBackground] = React.useState(false);

    React.useEffect(() => {
        /* If Path is dashboard, SetBackground */
        setHasBackground(location.pathname.includes("dashboard"));
    }, [location]);

    return (
        <Box sx={{ background: { xs: '', md: (hasBackground) ? 'url("/collab-planet.png");' : "" }, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ bgcolor: hasBackground ? 'transparent' : 'background.default', boxShadow: 0, display: 'flex', alignItems: 'center', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Stack sx={{ flexGrow: 1 }} direction="row" spacing={1}>
                    <Groups2Icon sx={{ color: SyncedAppThemeController.isLightMode() ? 'primary.light' : 'primary.main', fontSize: '2rem' }} />
                    <Typography variant='h5' sx={{ lineHeight: 1.6, color: hasBackground ? 'white' : 'text.primary' }}>Synced</Typography>
                </Stack>

                { 
                    /* Dark Mode Switch Button */
                    /*    
                        <IconButton onClick={props.toggleTheme} sx={{ color: hasBackground ? 'white' : 'text.primary', marginRight: '15px', borderRadius: '50%' }}>
                        {
                            (SyncedAppThemeController.isLightMode()) ?
                                <DarkModeIcon /> :
                                <LightModeIcon />
                        }
                        </IconButton> 
                    */   
                }
                
                { /* Set Avatar */}
                <IconButton onClick={(e) => { setMenuAnchorEl(e.currentTarget); setIsMenuOpen(!isMenuOpen); }}>
                    <Avatar sx={{ bgcolor: 'secondary.light' }} />
                </IconButton>

                {/* Define Menu Options for Avatar Button */}
                <Menu
                    slotProps={{ paper: { sx: { minWidth: '230px' } } }}
                    anchorEl={menuAnchorEl}
                    open={isMenuOpen}
                    onClose={() => { setIsMenuOpen(false); }}
                >
                    <MenuItem>
                        <ListItemAvatar><Avatar sx={{ bgcolor: 'secondary.light' }} /></ListItemAvatar>
                        <ListItemText
                            primary={props.userData.fullName}
                            secondary={(props.userData.anonymous) ? "Temporary Account" : props.userData.email}
                        />
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText>App Settings</ListItemText>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                    </MenuItem>
                </Menu>
            </Toolbar>
            <Divider sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, display: { xs: 'block', md: (hasBackground) ? 'none' : 'block' } }} />
            <Box
                sx={{
                    width: '100%',
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                }}
            >
                <Routes>
                    <Route path="/dashboard" element={<CollabJoinOptions socket={socket} />} />
                    <Route path="/room/*" element={<CollabRoomCore socket={socket} />} />
                    <Route path="/*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Box>
        </Box>
    );
}

export default SyncedDashboardPage;