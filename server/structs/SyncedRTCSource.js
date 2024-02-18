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

const SyncedRTCSource = class {
    static sourceType = {
        YOUTUBE: 1
    }
    
    constructor(srcType, uri) {
        this.srcType = srcType;
        this.uri = uri;
        this.currentPos = 0;
        this.paused = true;
    }
}