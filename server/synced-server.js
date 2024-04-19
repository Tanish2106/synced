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
const port = 8000

/* Set Cors Config */
const corsConfig = {
  origin: ['http://localhost:8000', 'http://synced.atheesh.org:8000'],
  methods: ['GET', 'POST'],
  credentials: true
};

/* Init Required Modules */
const app = express();
const cors = require('cors')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const httpServer = createServer(app);
const io_collab = new Server(httpServer, {
  cors: corsConfig,
  path: "/rtc/collab"
});

/* Get ENV Variables */
dotenv.config();

/* Add Body Parser Module */
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));

app.get('/api', (req, res) => {
  res.send('Synced Server Listening to API Requests!')
})

httpServer.listen(port, () => {
  console.log(`Synced Server listening on port ${port}`)

  /* Define Required Contollers */
  new SyncedRTCHandler(app, io_collab);

  /* Serving the Public Folder */
  app.use(express.static(__dirname + '/public'));
  app.get('*', (req,res) => res.sendFile(__dirname+'/public/index.html'))
})