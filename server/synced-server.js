/*
    Synced
    Copyright (C) 2024  Atheesh Thirumalairajan

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

const express = require('express')
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const SyncedRTCHandler = require('./middleware/SyncedRTCHandler');
const SyncedDatabaseMiddleware = require('./middleware/SyncedDatabaseMiddleware');
const SyncedRTCRoomController = require('./middleware/SyncedRTCRoomController');
const port = 8000

/* Init Required Modules */
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

/* Add Body Parser Module */
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  new SyncedDatabaseMiddleware(app).init();
  new SyncedRTCHandler(io).init();
  new SyncedRTCRoomController(app, io).init();
})