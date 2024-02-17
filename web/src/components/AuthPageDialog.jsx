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
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoadingButton from '@mui/lab/LoadingButton';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SyncedAppConfig from '../middleware/SyncedAppConfig';

const AuthPageDialog = (props) => {
    /* Configure React Router Parameters */
    const location = useLocation();
    const navigate = useNavigate();

    /* Set React States */
    const [isLoading, setIsLoading] = React.useState(false);

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
        /* Set Required States */
        const [isAnonAuthLoading, setIsAnonAuthLoading] = React.useState(false);
        const [anonAuthUsername, setAnonAuthUsername] = React.useState("");

        const handleAnonymousAuthPageCancel = () => {
            setAuthPage(internal_props.previousPage);
        }

        const handleAnonymousAuthPageLogin = () => {
            setIsAnonAuthLoading(true);
            if (anonAuthUsername.trim().length >= 5)
                axios
                    .post(`${SyncedAppConfig.getServerURL()}/auth/login`, {
                        anonymous: true,
                        username: anonAuthUsername
                    }, { withCredentials: true })
                    .then((res) => {
                        const searchList = location.search.substring(1).split("=");
                        const params = {};

                        /* Populate the Params Object */
                        for (let i = 0; i < searchList.length; i += 2) {
                            params[searchList[i]] = searchList[i + 1];
                        }

                        /* Navigate to For Link, if exists */
                        if (params.for) navigate(params.for)
                        else navigate("/");
                    })
                    .catch((err) => { console.error(err) })
                    .finally(() => {
                        setTimeout(() => { setIsAnonAuthLoading(false) }, 800);
                    });
        }

        return (
            <>
                <TextField value={anonAuthUsername} onChange={(e) => { setAnonAuthUsername(e.target.value) }} autoFocus label="Username" sx={{ width: { xs: '100%', md: '60%' } }} variant='outlined'></TextField>
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: '40%' }, alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingButton loading={isAnonAuthLoading} disabled={(anonAuthUsername.trim().length < 5)} onClick={handleAnonymousAuthPageLogin} sx={{ marginTop: '15px', flexGrow: 1 }} variant='contained'>Login</LoadingButton>
                    <Button disabled={isAnonAuthLoading} onClick={handleAnonymousAuthPageCancel} sx={{ marginTop: '15px', flexGrow: 0.3 }} variant='outlined'>Cancel</Button>
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

export default AuthPageDialog;