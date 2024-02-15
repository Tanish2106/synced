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
import SyncedAppThemeController from "../middleware/SyncedAppThemeController";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SyncedErrorPage from "./SyncedErrorPage";
import { Route, Routes } from "react-router-dom";
import CollabJoinOptions from "../components/CollabJoinOptions";

const SyncedRouterPage = (props) => {
    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
                <Stack sx={{ flexGrow: 1 }} direction="row" spacing={1}>
                    <OndemandVideoIcon sx={{ color: '#e71302', fontSize: '2rem' }} />
                    <Typography variant='h5' sx={{ lineHeight: 1.5 }}>Synced</Typography>
                </Stack>

                { /* Dark Mode Switch Button */}
                <IconButton onClick={props.toggleTheme} sx={{ color: 'inherit', marginRight: '15px', borderRadius: '50%' }}>
                    {
                        (SyncedAppThemeController.isLightMode()) ?
                            <DarkModeIcon /> :
                            <LightModeIcon />
                    }
                </IconButton>

                { /* Sign In or Avatar */}
                <Button variant="outlined">Sign In</Button>
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
                    <Route path='/*' element={<SyncedErrorPage />} />
                </Routes>
            </Box>
        </Box>
    );
}

export default SyncedRouterPage;