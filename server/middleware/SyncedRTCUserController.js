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
const uuid = require('uuid');

const SyncedRTCUserController = class {
    constructor() {
        this.users = {};
    }

    createUser = (username) => {
        const userId = uuid.v4();
        this.users[userId] = {
            username,
            lastModified: Date.now()
        };

        /* Set Self-Destruction Timer */
        this.users[userId].expiryTimer
            = setInterval(() => {
                if (Date.now() - this.users[userId].lastModified > 600000) {
                    clearInterval(this.users[userId].expiryTimer);
                    delete this.users[userId];
                }
            }, 600000);
    }

}

module.exports(SyncedRTCUserController);