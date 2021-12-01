const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    allowEIO3: true,
    cors: {
        origin: '*',
    }
});

app.get('/', (req, res) => {
    res.end('bonjou')
});

io.on('connection', (socket) => {
    socket.on('hello', ({device}) => {
        console.log('a device connected, named', device)
        if (device === 'iPhone') {
            socket.on('winemaker', () => {

            })
        }
        if (device === 'animation') {
            console.log('animation connected')
            setTimeout(() => {
                socket.emit('setAnimSpeed', 1)
            }, 3000)
        }
        // socket.emit('setvalve', 'on')
        // setTimeout(() => socket.emit('setvalve', 'off'), 3000)
    })
    socket.on('bonjour', (data) => {
        console.log('bonjour: ', data)
        socket.emit('salut')
    })
});



server.listen(3000, () => {
    console.log('listening on *:3000');
});
