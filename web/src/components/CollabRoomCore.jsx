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
import { Box, Button, Dialog, DialogContent, LinearProgress, Typography } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';
import SyncedAppConfig from '../middleware/SyncedAppConfig';

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

    /* Set Required States */
    const [dialogPage, setDialogPage] = React.useState(<DialogLoadingPage title="📡 Establishing Connection..." />);
    const [dialogOpen, setDialogOpen] = React.useState(true);
    const [isJoined, setIsJoined] = React.useState(false);

    const initRTCMiddleware = () => {
        /* Split Pathname to get RoomId */
        const roomId = location.pathname.split("/").pop();

        /* Configure SocketIO Middleware */
        socket.emit("fe-rooms-join", roomId, (err, res) => {
            if (err) return setDialogPage(<DialogRoomJoinError title={err} />);
            if (res.waitlisted) return setDialogPage(<DialogLoadingPage title="🔒 Asking to be let in..." />);

            /* We've Joined the Room */
            setIsJoined(true);
            setDialogOpen(false);
        });

        /* Listen for RTC Events */
        socket.on('be-rooms-guestJoinRequest', (req) => {
            /* Guest Waitlist Join Requests */
            setTimeout(() => {
                beRoomsGuestJoinRequestAction(req.userId, req.roomId, false);
            }, 5000);
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

    const beRoomsGuestJoinRequestAction = (userId, roomId, approved) => {
        /* Send Approval for usedId to Join back */
        socket.emit(
            "fe-rooms-guestJoinAction",
            { userId, approved, roomId },
            () => { }
        );
    }

    React.useEffect(() => {
        /* Configure RTC Middleware */
        initRTCMiddleware();
    }, []);

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Dialog PaperProps={{ sx: { minHeight: "60%" } }} fullWidth maxWidth="md" open={dialogOpen}>
                { /* If height: 1px; not set, Child will not inherit 100% height */}
                <DialogContent sx={{ height: '1px' }}>{dialogPage}</DialogContent>
            </Dialog>
        </Box>
    );
}

export default CollabRoomCore;