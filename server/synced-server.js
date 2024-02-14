const express = require('express')
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const port = 5000

/* Init Required Modules */
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})