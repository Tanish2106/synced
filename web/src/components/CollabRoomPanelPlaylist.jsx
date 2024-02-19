import * as React from 'react';
import { Alert, Box, Button, IconButton, Paper, TextField, Typography } from "@mui/material";
import SyncedVideoSource from '../structs/SyncedVideoSource';
import { useLocation } from 'react-router-dom';
import SyncedCollabController from '../middleware/SyncedCollabController';

const CollabRoomPanelPlaylist = (props) => {
    const socket = props.socket;
    const location = useLocation();
    const roomId = SyncedCollabController.getRoomId(location.pathname);

    const [sourcePlaylist, setSourcePlaylist] = React.useState([]);
    const [addSourceText, setAddSourceText] = React.useState("");

    const handleSourceLoad = () => {
        const source = new SyncedVideoSource(addSourceText);
        //props.loadSource(source);
        //setSourcePlaylist((sourcePlaylist) => [...sourcePlaylist, source]);

        /* Send Source Load to Backend */
        socket.emit(
            'fe-sources-add', 
            { sourceURL: source.uri, sourceType: source.srcType, roomId },
            (e) => { console.log(e) }
        );

        /* Reset The Source Text */
        setAddSourceText("");
    }

    return (
        <Box sx={{ ...props.sx, flexDirection: 'column', height: '100%', maxHeight: '100%', padding: '20px' }}>
            {
                (!props.isHost) ? <></> :
                    <>
                        <TextField
                            autoFocus
                            value={addSourceText}
                            onChange={(e) => { setAddSourceText(e.target.value) }}
                            variant="outlined"
                            label="Enter Video or Playlist URL"
                        />

                        { /* Load Source Button */}
                        <Button
                            onClick={handleSourceLoad}
                            disabled={!SyncedVideoSource.isValidSource(addSourceText)}
                            variant="contained" sx={{ marginTop: '10px', width: '100%' }}
                        >
                            Load Source
                        </Button>

                        {/* Media Controls */}
                        {
                            (!props.controls) ? <></> :
                                <>
                                    <Typography variant="h5" sx={{ marginTop: '30px', marginBottom: '10px' }}>Media Controls</Typography>
                                    <Paper elevation={4} sx={{ padding: '5px', display: 'flex', gap: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                        {
                                            props.controls.map((control) => (<IconButton onClick={control.onClick}>{control.icon}</IconButton>))
                                        }
                                    </Paper>
                                </>
                        }
                    </>
            }

            { /* View Playlist */}
            <Typography variant="h5" sx={{ marginTop: (props.isHost) ? '30px' : '0px', marginBottom: '10px' }}>Up Next</Typography>
            {
                (sourcePlaylist.length < 1) ?
                    <Alert severity='warning'>No Sources in Playlist</Alert> :
                    <></>
            }
        </Box>
    );
}

export default CollabRoomPanelPlaylist;