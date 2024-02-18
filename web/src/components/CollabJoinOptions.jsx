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
import { Box, Paper, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Groups2Icon from '@mui/icons-material/Groups2';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom'

const CollabJoinOptions = (props) => {
    /* Define Required React State Variables */
    const socket = props.socket;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);

    /* Define Required Middleware Functions */
    const handleCreateRoom = async () => {
        /* Set Loading */
        setIsLoading(true);

        /* Create a New Room */
        socket.emit("fe-rooms-create", (roomId) => {
            /* Navigate to New Page */
            return navigate(`/room/${roomId}`);
        });
    }

    return (
        <Box sx={{ width: "100%", height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper
                sx={{
                    boxShadow: { xs: 0, md: 5 },
                    borderRadius: '10px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: { xs: '100%', md: '50%' },
                    height: { xs: '100%', md: '60%' },
                    justifyContent: 'center',
                }}
            >
                <Groups2Icon sx={{ fontSize: '8rem' }} />
                <Typography variant="h4">Stream Together.</Typography>
                <LoadingButton loading={isLoading} onClick={handleCreateRoom} sx={{ marginTop: '20px', borderRadius: '10px' }} variant="contained" startIcon={<AddIcon />}>Create New Room</LoadingButton>
            </Paper>
        </Box>
    );
}

export default CollabJoinOptions;