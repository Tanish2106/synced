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

import { Box, Button, Paper, Typography } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import Groups2Icon from '@mui/icons-material/Groups2';

const CollabJoinOptions = (props) => {
    return (
        <Paper
            sx={{
                boxShadow: 0,
                border: 'solid',
                borderWidth: { xs: '0px', md: '1px' },
                borderColor: 'rgba(0, 0, 0, 0.12)',
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
            <Box sx={{ marginTop: '20px', display: 'flex', gap: '15px', flexDirection: { xs: 'column', md: 'row' } }}>
                <Button variant="contained" startIcon={<AddIcon />}>Create New Room</Button>
                <Button variant="outlined" startIcon={<GroupIcon />}>Join Existing Room</Button>
            </Box>
        </Paper>
    );
}

export default CollabJoinOptions;