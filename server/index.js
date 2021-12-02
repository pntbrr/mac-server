const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const createManager = require('./app/manager')

const io = new Server(server, {
    allowEIO3: true,
    cors: {
        origin: '*',
    }
});

app.get('/', (req, res) => {
    res.end('bonjou')
});

const manager = createManager()

io.on('connection', (socket) => {
    socket.on('hello', ({device}) => {
        console.log('a device connected, named', device)
        manager.connectDevice(device, socket)
        // if (device === 'animation') {
        //     console.log('animation connected')
        //     setTimeout(() => {
        //         socket.emit('setAnimSpeed', 1)
        //     }, 3000)
        // }
        // socket.emit('setvalve', 'on')
        // setTimeout(() => socket.emit('setvalve', 'off'), 3000)
    })
});



server.listen(3000, () => {
    console.log('listening on *:3000');
});
