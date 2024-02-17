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

/* Import Required Libraries */
const SyncedRTCUser = require('../structs/SyncedRTCUser');
const SyncedAuthController = require('./SyncedAuthController');

const SyncedRTCUserController = class {
    constructor() {
        this.users = {};
        this.clearInactiveUsers();
    }

    // handleSocketComm = () => {
    //     this.io.on("connection", (socket) => {
    //         /* Disconnect on Invalid Headers */
    //         if (!socket.request.headers.cookie) return socket.disconnect();

    //         /* Verify Auth Token */
    //         const cookies = parseCookies(socket.request.headers.cookie);
    //         SyncedAuthController.verifyToken(cookies.authToken, (err, user) => {
    //             /* Disconnect on Error */
    //             if (err) return socket.disconnect();
    //             if (!this.getUser(user.userId)) return socket.disconnect();

    //             /* Listen for Socket Events */
    //             this.defineSocketEvents(socket, user);
                
    //             /* Map socket to user */
    //             this.getUser(user.userId).socket = socket;
    //         });
    //     });
    // }

    // defineSocketEvents = (socket, user) => {
    //     socket.on("fe-users-heartbeat", () => {
    //         /* Getting a User Resets Last Modified */
    //         this.getUser(user.userId);
    //     });
    // }

    clearInactiveUsers = () => {
        setInterval(() => {
            Object.keys(this.users).forEach((user) => {
                console.log(Date.now() - this.users[user].lastModified);
                if (Date.now() - this.users[user].lastModified > 1800000)
                    delete this.users[user] /* Tanish helped me fix this! */
            });
        }, 900000);
    }

    createUser = (username) => {
        const newUser = new SyncedRTCUser(username);
        this.users[newUser.userId] = newUser;
        this.lastModified = Date.now();
        this.socket = null;

        /* Returns UserID of created User */
        return newUser.userId;
    }

    getUser = (userId) => {
        /* User is Modified or Accessed. */
        if (this.users[userId]) 
            this.users[userId].lastModified = Date.now();

        return this.users[userId];
    }
}

module.exports = SyncedRTCUserController;