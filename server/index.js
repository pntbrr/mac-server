const express = require('express');
const app = express();
const history = require('connect-history-api-fallback');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const createManager = require('./app/manager')

const io = new Server(server, {
    allowEIO3: true,
    cors: {
        origin: '*',
    },
});

const staticFileMiddleware = express.static('dist');
// 1st call for unredirected requests
app.use(staticFileMiddleware);

// Support history api
// this is the HTTP request path not the path on disk
app.use(history({
    index: '/index.html'
}));

// 2nd call for redirected requests
app.use(staticFileMiddleware);

const manager = createManager()

io.on('connection', (socket) => {
    socket.on('hello', ({device}) => {
        console.log('a device connected, named', device)
        manager.connectDevice(device, socket)
    })
});



server.listen(3000, () => {
    console.log('listening on *:3000');
});
