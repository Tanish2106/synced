/*
    Synced
    Copyright (C) 2024  Atheesh Thirumalairajan
    Copyright (C) 2024  Tanish Anandababu

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

const uuid = require('uuid');

const isRoomAccessAuthorized = (roomId) => {
    /* Always Calls Next, Indicates Successful authorization */
    next();
}

const isOnboarded = (req, res, next) => {
    /* Express Middlware that checks if user has registered */
    
}

const SyncedRTCRoomController = class {
    constructor(app, io, rtcUserController) {
        this.app = app;
        this.io = io;
        this.rtcUserController = rtcUserController;
        this.rooms = {};

        /* Create Handler for SocketIO Communications */
        this.handleSocketComm();
    }

    handleSocketComm = () => {
        this.io.on('connection', (socket) => {
            socket.on('fe-rooms-join', (data, callback) => {
                if (this.rooms[data.roomId]) {
                    
                } else {
                    /* Callback Error */
                    callback({ status: false })
                }
            });

            socket.on('fe-rooms-waitlistaction', (data) => {
                if (data.roomId && data.username && data.jwt) {

                }
            });
        });
    }

    createRoom = (creatorId) => {
        const roomId = uuid.v4();
        this.rooms[roomId] = {
            hosts: [creatorId],
            online: [],
            waitingRoom: [],
            lastModified: Date.now()
        };
        
        /* Set Self-Destruction Timer */
        this.rooms[roomId].expiryTimer
            = setInterval(() => {
                if (Date.now() - this.rooms[roomId].lastModified > 600000) {
                    clearInterval(this.rooms[roomId].expiryTimer);
                    delete this.rooms[roomId];
                }
            }, 600000);

        return roomId;
    }

    init = () => {
        this.app.post("/rooms/create", isOnboarded, (req, res) => {
            /* Should be req.token.userId */
            let createdRoomId = this.createRoom(req.body.userId);
            res.status(200).json({ roomId: createdRoomId });
        });
    }
};

module.exports = SyncedRTCRoomController;