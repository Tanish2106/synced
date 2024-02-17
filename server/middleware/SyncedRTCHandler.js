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

const SyncedAuthController = require("./SyncedAuthController");
const SyncedRTCRoomController = require("./SyncedRTCRoomController");
const SyncedRTCUserController = require("./SyncedRTCUserController");

const parseCookies = (cookieString) => {
    const searchList = cookieString.split("=");
    const params = {};

    /* Populate the Params Object */
    for (let i = 0; i < searchList.length; i += 2) {
        params[searchList[i]] = searchList[i + 1];
    }

    return params;
}

const SyncedRTCHandler = class {
    constructor(app, io) {
        /* Get Server Definitions */
        this.app = app;
        this.io = io;

        /* Create Sub Handlers */
        this.rtcUserController = new SyncedRTCUserController();
        this.rtcRoomController = new SyncedRTCRoomController();
        new SyncedAuthController(this.app, this.rtcUserController).init();

        /* Perform Initialization */
        this.io.on('connection', (socket) => {
            /* Disconnect on Invalid Headers */
            if (!socket.request.headers.cookie) return socket.disconnect();

            /* Verify Auth Token */
            const cookies = parseCookies(socket.request.headers.cookie);
            SyncedAuthController.verifyToken(cookies.authToken, (err, user) => {
                /* Disconnect on Error */
                if (err) return socket.disconnect();
                if (!this.rtcUserController.getUser(user.userId))
                    return socket.disconnect();

                /* Set UserData in Socket */
                socket.rtcUser = this.rtcUserController.getUser(user.userId);

                /* Map socket to user */
                this.rtcUserController.getUser(user.userId).socket = socket;

                /* Listen for Socket Events */
                this.defineSocketEvents(socket);
            });
        });
    }

    defineSocketEvents = (socket) => {
        socket.on("fe-rooms-create", (callback) => {
            const roomId = this.rtcRoomController.createRoom(socket.rtcUser);
            callback(roomId);
        });

        socket.on("fe-rooms-join", (roomId, callback) => {
            const room = this.rtcRoomController.getRoom(roomId);
            if (!room) return callback("Room Not Found!", null);

            /* Room Exists, Check if User is Host/Guest */
            if (room.hosts.includes(socket.rtcUser)) {
                /* User Is Host, Join Room */
                socket.join(roomId);
                socket.join(`${roomId}::hosts`);

                /* Inform Users Host Joined */
                this.io.in(roomId).emit(
                    "be-rooms-userJoined",
                    {
                        username: socket.rtcUser.username,
                        userId: socket.rtcUser.userId
                    }
                );

                /* Callback to Inform Successful connection */
                return callback(null, {})
            } else {
                /* User Is Guest, Join Waitlist Group */
                socket.join(`${roomId}::waitlist`);

                /* Inform Hosts about Waiting Guest */
                this.io.in(`${roomId}::hosts`).emit(
                    "be-rooms-guestJoinRequest",
                    {
                        username: socket.rtcUser.username,
                        userId: socket.rtcUser.userId,
                        roomId: roomId
                    }
                );

                /* Tell User they're waitlisted */
                return callback(null, { waitlisted: true })
            }
        });

        socket.on("fe-rooms-guestJoinAction", (req, callback) => {
            /* 
                Hosts Respond to Guest In Waiting List.
                req Structure:
                    roomId
                    userId
                    approved
            */

            /* Check if Room Exists */
            const room = this.rtcRoomController.getRoom(req.roomId);
            if (!room) return callback("Room Not Found!", null);

            /* Check if User is Host */
            if (!room.hosts.includes(socket.rtcUser))
            return callback("Only Hosts Can Approve Guests");

            /* Check if Requested User Exists */
            const user = this.rtcUserController.getUser(req.userId);
            if (!user) return callback("User Not Found!", null);

            /* Instance Variables */
            const roomId = room.roomId;

            /* Revoke Guest Join Request for all Hosts. One Acted. */
            this.io.in(`${roomId}::hosts`).emit(
                "be-rooms-guestJoinRevoke",
                { username: user.username, userId: user.userId }
            );

            /* Apply Approval Actions */
            if (req.approved) {
                /* Join Client to Room */
                user.socket.join(roomId);

                /* Inform Users Guest Joined */
                this.io.in(roomId).emit(
                    "be-rooms-userJoined",
                    { username: user.username, userId: user.userId }
                );
            }

            /*
                be-rooms-waitlistResolution Structure:
                    userId
                    approved
            */

            /* Inform Client about Approval Status */
            user.socket.emit(
                "be-rooms-waitlistResolution",
                {
                    userId: req.userId,
                    approved: req.approved
                }
            );

            /* Take Client Off Waitlist Channel */
            user.socket.leave(`${roomId}::waitlist`);

            /* Return A Success Message */
            return callback(null, { status: true });
        });
    }
};

module.exports = SyncedRTCHandler;