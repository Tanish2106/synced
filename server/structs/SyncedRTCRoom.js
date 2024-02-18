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

const uuid = require("uuid");

const SyncedRTCRoom = class {
    /*
        Designing A Souce Workflow:
        1. Have a sources list in the server.
        2. Have a currently playing source in the server

        sourceList = Map of Sources
        sourcePlaying = URI of Source

        Have a sources struct:
        and Source Types as defined in SyncedRTCSource.js
    */

    /* Creator is a SyncedRTCUser */
    constructor(creator) {
        this.roomId = uuid.v4();
        this.hosts = [creator];
        this.online = [];
        this.sourceList = new Map();
        this.sourcePlaying = null;
        this.lastModified = Date.now();
    }

    addSource = (source) => {
        /* Check if source exists already */
        if (!this.sourceList.get(source.uri))
            this.sourceList.set(source.uri, source);

        /* Update Last Modified */
        this.lastModified = Date.now();
    }

    removeSource = (sourceURI) => {
        /* Take source off and Update Last Modified */
        this.sourceList.delete(sourceURI);
        this.lastModified = Date.now();
    }

    setSourcePlaying = (sourceURI) => {
        /* Update Source and Last Modified */
        this.sourcePlaying = sourceURI;
        this.lastModified = Date.now();
    }

    /* Middleware */
    isUserHost = (user) => {
        return room.hosts.includes(user);
    }

    /* Online User Manipulation Functions */
    removeOnlineUser = (user) => {
        const userIndex = this.online.indexOf(user);
        if (userIndex > -1) this.online.splice(userIndex, 1);

        /* Update Last Modified */
        this.lastModified = Date.now();
    }

    addOnlineUser = (user) => {
        /* Push and Update Last Modified */
        this.online.push(user);
        this.lastModified = Date.now();
    }
}

module.exports = SyncedRTCRoom;