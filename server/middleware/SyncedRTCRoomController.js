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

const SyncedRTCRoom = require('../structs/SyncedRTCRoom');

const SyncedRTCRoomController = class {
    constructor() {
        this.rooms = {};
        this.clearInactiveRooms();
    }

    /* Define Express and IO Middleware */
    isRoomAccessAuthorized = (roomId) => {
        /* Always Calls Next, Indicates Successful authorization */
        next();
    }

    /* This function delete rooms with an Inactivity over 10 minutes */
    clearInactiveRooms = () => {
        setInterval(() => {
            Object.keys(this.rooms).forEach((room) => {
                let rtcRoom = this.rooms[room];
                if (Date.now() - rtcRoom.lastModified > 1800000)
                    delete this.rooms[room];
            });
        }, 900000);
    }

    createRoom = (creator) => {
        /* this.rtcUserController.getUser(creatorId) */
        const newRoom = new SyncedRTCRoom(creator);
        this.rooms[newRoom.roomId] = newRoom;

        /* Return Room ID */
        return newRoom.roomId;
    }

    joinRoom = (roomId, user) => {
        const room = this.getRoom(roomId);
        if (!room) return false;

        /* Check if user is a host */
        if (room.hosts.includes(user)) {
            /* Add User to Room directly */
            //room.addToOnline(user);
            //user.socket.join(room.roomId);
        } else {
            room.addToWaitingRoom(user);
        }
    }

    getRoom = (roomId) => {
        /* Update Room Last Modified */
        if (this.rooms[roomId])
            this.rooms[roomId].lastModified = Date.now();

        return this.rooms[roomId];
    }
};

module.exports = SyncedRTCRoomController;