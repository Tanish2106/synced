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

import { Box, Dialog, DialogContent, Paper } from "@mui/material";
import AuthPageDialog from "../components/AuthPageDialog";

const SyncedAuthPage = (props) => {
    return (
        <Box className="gradient-background" sx={{ width: "100%", height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <AuthPageDialog />
            </Paper>
        </Box>
    );
}

export default SyncedAuthPage;