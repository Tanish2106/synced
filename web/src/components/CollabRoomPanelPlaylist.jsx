import * as React from 'react';
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import SyncedCollabController from "./../middleware/SyncedCollabController";

const CollabRoomPanelPlaylist = (props) => {
    const [sourcePlaylist, setSourcePlaylist] = React.useState([]);

    return (
        <Box sx={{ ...props.sx, flexDirection: 'column', height: '100%', maxHeight: '100%', padding: '20px' }}>
            <TextField
                autoFocus
                variant="outlined"
                label="Enter Video or Playlist URL"
            />
            <Button variant="contained" sx={{ marginTop: '10px', width: '100%' }}>Load Source</Button>

            { /* View Playlist */ }
            <Typography variant="h5" sx={{ marginTop: '30px', marginBottom: '10px' }}>Up Next</Typography>
            {
                (sourcePlaylist.length < 1) ?
                <Alert severity='warning'>No Sources in Playlist</Alert> :
                <></>
            }
        </Box>
    );
}

export default CollabRoomPanelPlaylist;