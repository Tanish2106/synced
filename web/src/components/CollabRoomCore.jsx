import * as React from 'react';
import axios from 'axios';
import { io } from "socket.io-client";
import { Box, Button, CircularProgress, Dialog, DialogContent, LinearProgress, Link, OutlinedInput, TextField, Typography } from "@mui/material";
import SyncedAppConfig from '../middleware/SyncedAppConfig';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const DialogAuthPage = (props) => {
    /* Configure Page Types: Options, Anonymous Auth, DB Auth */
    const AuthOptions = (internal_props) => {
        return (
            <>
                <AccountBoxIcon sx={{ fontSize: '8rem' }} />
                <Button variant='contained' sx={{ marginTop: '25px', height: '40px', minWidth: { xs: '80%', md: '40%' }, borderRadius: "10px" }}>Sign In to Synced</Button>
                <Box sx={{ marginTop: '10px' }}>
                    <Typography variant='p'>Or </Typography>
                    <Link sx={{ cursor: 'pointer' }} onClick={handleAnonymousAuth} fontWeight="bold" color="inherit">continue anonymously</Link>
                </Box>
            </>
        );
    }

    const AnonymousAuthPage = (internal_props) => {
        const handleAnonymousAuthPageCancel = () => {
            setAuthPage(internal_props.previousPage);
        }

        return (
            <>
                <TextField autoFocus label="Username" sx={{ width: { xs: '100%', md: '60%' } }} variant='outlined'></TextField>
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: '40%' }, alignItems: 'center', justifyContent: 'center' }}>
                    <Button sx={{ marginTop: '15px', flexGrow: 1 }} variant='contained'>Join Room</Button>
                    <Button onClick={handleAnonymousAuthPageCancel} sx={{ marginTop: '15px', flexGrow: 0.3 }} variant='outlined'>Cancel</Button>
                </Box>
            </>
        );
    }

    /* Configure Helper Functions */
    const handleAnonymousAuth = () => {
        setAuthPage(<AnonymousAuthPage previousPage={<AuthOptions />} />);
    }

    /* Set States */
    const [authPage, setAuthPage] = React.useState(<AuthOptions />);
    const [anonAuthUsername, setAnonAuthUsername] = React.useState("");
    const [anonAuthDialogOpen, setAnonAuthDialogOpen] = React.useState(false);

    return (
        <Box
            sx={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
            }}
        >{authPage}</Box>
    );
}

const DialogLoadingPage = (props) => {
    return (
        <Box
            sx={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
            }}
        >
            <Typography sx={{ fontWeight: 'bold' }} variant='h6'>📡 Establishing Connection</Typography>
            <LinearProgress sx={{ width: '90%', marginTop: '5px' }} variant='indeterminate' />
        </Box>
    );
}

const CollabRoomCore = (props) => {
    /* Set Required States */
    const [dialogPage, setDialogPage] = React.useState(<DialogLoadingPage />);
    const [dialogOpen, setDialogOpen] = React.useState(true);
    const [isJoined, setIsJoined] = React.useState(false);

    React.useEffect(() => {
        /* Verify JWT Token */
        axios.get(`${SyncedAppConfig.getServerURL()}/auth/verify`)
            .then((res) => { console.log(res) })
            .catch((err) => {
                /* If Err Code is 401, Unauthorized, Try Authentication */
                if (err.response.status == 400) {
                    /* SetDialogPage to Auth */
                    setDialogPage(<DialogAuthPage />);
                }
            })

        const socket
            = io(SyncedAppConfig.getServerURL(), { withCredentials: true });
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