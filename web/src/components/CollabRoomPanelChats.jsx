import * as React from 'react';
import { Box, IconButton, Paper, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import { InputAdornment, OutlinedInput } from '@mui/material';
import SyncedCollabController from '../middleware/SyncedCollabController';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

const CollabRoomPanelChats = (props) => {
    const socket = props.socket;
    const location = useLocation();
    const roomId = SyncedCollabController.getRoomId(location.pathname);
    const commentBottomRef = React.useRef();
    const [comments, setComments] = React.useState([]);
    const [msgValue, setMsgValue] = React.useState("");

    const sendMessage = () => {
        if (msgValue.trim().length > 0) {
            /* Send Message */
            socket.emit(
                "fe-chats-message",
                { roomId, message: msgValue },
                (e) => { console.log(e) }
            );

            /* Clear Message Box */
            setMsgValue("");
        }
    }

    React.useEffect(() => {
        if (commentBottomRef.current) commentBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, [comments]);

    React.useEffect(() => {
        /* Server Sends new Chat Message */
        socket.on('be-chats-message', (req) => {
            setComments((comments) => [...comments, req])
        });
    }, []);

    return (
        <Box sx={{ ...props.sx, flexDirection: 'column', padding: '10px', height: '100%', maxHeight: '100%' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {
                    (!comments.length > 0) ?
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <SmsFailedIcon sx={{ color: 'text.disabled', fontSize: '4rem' }} />
                            <Typography variant='h5' mt={2} sx={{ color: 'text.disabled' }}>No Messages</Typography>
                        </Box> :
                        <Box sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                            {
                                comments.map((comment) => {
                                    return (
                                        <Box sx={{ display: 'flex', margin: '5px', flexDirection: 'column' }}>
                                            <Paper sx={{ padding: '5px', display: 'flex', flexDirection: 'column' }} variant="outlined">
                                                <Typography variant="caption">{comment.fullName}</Typography>
                                                <Typography variant="p">{comment.message}</Typography>
                                            </Paper>
                                            <Typography mt="3px" sx={{ alignSelf: 'end' }} variant="caption">
                                                {moment(comment.time).local().format("hh:mm A")}
                                            </Typography>
                                        </Box>
                                    )
                                })
                            }
                            <Box ref={commentBottomRef}></Box>
                        </Box>
                }
            </Box>
            <Box sx={{ display: 'flex' }}>
                <OutlinedInput placeholder='Message' variant="outlined" value={msgValue} onKeyDown={(k) => { if (k.key == 'Enter') sendMessage() }} onChange={(e) => { setMsgValue(e.target.value) }} endAdornment={
                    <InputAdornment position='end'>
                        <IconButton disabled={(msgValue.trim().length == 0)} style={{ marginLeft: '3px', borderRadius: '10%' }} onClick={sendMessage} size="small">
                            <SendIcon />
                        </IconButton>
                    </InputAdornment>
                } />
            </Box>
        </Box>
    );
}

export default CollabRoomPanelChats;