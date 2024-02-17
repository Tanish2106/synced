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

import { Box, Button, Divider, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SyncedErrorPage from "./SyncedErrorPage";
import { Route, Routes } from "react-router-dom";
import CollabJoinOptions from "../components/CollabJoinOptions";
import CollabRoomCore from "../components/CollabRoomCore";
import Groups2Icon from '@mui/icons-material/Groups2';

const SyncedRouterPage = (props) => {
    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ boxShadow: 0, display: 'flex', alignItems: 'center' }}>
                <Stack sx={{ flexGrow: 1 }} direction="row" spacing={1}>
                    <Groups2Icon sx={{ color: 'primary.main', fontSize: '2rem' }} />
                    <Typography variant='h5' sx={{ lineHeight: 1.6 }}>Synced</Typography>
                </Stack>

                { /* Sign In or Avatar */}
                <Button sx={{ borderRadius: '10px' }} variant="contained">Sign In</Button>
            </Toolbar>
            <Divider />
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
                    <Route path="/collab" element={<CollabJoinOptions />} />
                    <Route path="/collab/*" element={<CollabRoomCore />} />
                    <Route path='/*' element={<SyncedErrorPage />} />
                </Routes>
            </Box>
        </Box>
    );
}

export default SyncedRouterPage;