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

const SyncedRTCUserController = class {
    constructor() {
        this.users = {};
    }

    clearInactiveUsers = () => {
        Object.keys(this.users).forEach((user) => {
            if (Date.now() - this.users[user].lastModified > 1800000)
                delete this.users[user.userId]
        });
    }

    createUser = (username) => {
        const newUser = new SyncedRTCUser(username);
        this.users[newUser.userId] = newUser;

        /* Returns UserID of created User */
        return newUser.userId;
    }
}

module.exports = SyncedRTCUserController;