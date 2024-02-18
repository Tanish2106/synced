import * as React from 'react';
import Person2Icon from '@mui/icons-material/Person2';
import { Alert, Avatar, Box, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import SyncedCollabController from '../middleware/SyncedCollabController';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useLocation } from 'react-router-dom';

const CollabRoomPanelUsers = (props) => {
    const socket = props.socket;
    const location = useLocation();
    const roomId = SyncedCollabController.getRoomId(location.pathname);
    const [activeUsers, setActiveUsers] = React.useState([]);
    const [waitlistUsers, setWaitlistUsers] = React.useState([]);

    React.useEffect(() => {
        /* Listen for RTC Events */
        socket.on('be-rooms-guestJoinRequest', (req) => {
            /* Guest Waitlist Join Requests */
            setWaitlistUsers((waitlistUsers) => [...waitlistUsers, req]);
        });

        socket.on('be-rooms-guestJoinRevoke', (req) => {
            /* Take User off Wailist since some host has acted */
            setWaitlistUsers((waitlistUsers) =>
                waitlistUsers.filter((waitlistUser) => (waitlistUser.userId != req.userId))
            );
        })

        socket.on('be-users-cache', (req) => {
            /* Add Users to ActiveUsers List, Response is array of users */
            setActiveUsers((activeUsers) => [...activeUsers, ...req]);
        })

        socket.on('be-rooms-userJoined', (req) => {
            /* Update Active Users List */
            setActiveUsers((activeUsers) => [...activeUsers, req]);
        })

        socket.on('be-users-disconnect', (req) => {
            /* Take User who disconnected off waitlist */
            setWaitlistUsers((waitlistUsers) =>
                waitlistUsers.filter((waitlistUser) => (waitlistUser.userId != req.userId))
            );

            /* Take User who disconeected off activeUsers */
            setActiveUsers((activeUsers) =>
                activeUsers.filter((activeUser) => (activeUser.userId != req.userId))
            );
        })
    }, []);

    const handleWaitlistAction = (userId, approved) => {
        /* Send Approval for usedId to Join back */
        socket.emit(
            "fe-rooms-guestJoinAction",
            { userId, approved, roomId },
            () => { }
        );
    }

    return (
        <Box sx={{ ...props.sx, flexDirection: 'column', height: '100%', maxHeight: '100%' }}>
            {
                (!waitlistUsers.length > 0) ?
                    <></> :
                    <>
                        <Typography sx={{ padding: '10px 10px 0px 10px' }} variant="h5">Waiting Room</Typography>
                        <List>
                            {
                                waitlistUsers.map((user) => (
                                    <ListItem sx={{ padding: '0px 20px 0px 20px', ":hover": { bgcolor: 'action.hover' } }} onClick={(e) => { e.preventDefault() }} key={user.userId} disablePadding>
                                        <ListItemText primaryTypographyProps={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} secondaryTypographyProps={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} primary={user.fullName} secondary={(user.anonymous) ? "Temporary Account" : user.email} />
                                        <IconButton onClick={() => { handleWaitlistAction(user.userId, true) }} color='success'><CheckCircleIcon /></IconButton>
                                        <IconButton onClick={() => { handleWaitlistAction(user.userId, false) }} color='error'><CancelIcon /></IconButton>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </>
            }

            { /* Active Users List */}
            <Typography sx={{ padding: '10px 10px 0px 10px' }} variant="h5">Active Users</Typography>
            <List>
                {
                    activeUsers.map((user) => (
                        <ListItem sx={{ padding: '0px 20px 0px 20px', ":hover": { bgcolor: 'action.hover' } }} onClick={(e) => { e.preventDefault() }} key={user.userId} disablePadding>
                            <ListItemText primaryTypographyProps={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} secondaryTypographyProps={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} primary={user.fullName} secondary={(user.anonymous) ? "Temporary Account" : user.email} />
                        </ListItem>
                    ))
                }
            </List>
        </Box>
    );
}

export default CollabRoomPanelUsers;