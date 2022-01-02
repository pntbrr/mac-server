import chalk from 'chalk'
import express from 'express'
import history from 'connect-history-api-fallback'
import http from 'http'
import { Server } from 'socket.io'

import PeerTalk from 'peertalk'
import { createDroneSocket } from './app/droneSocket.mjs'
import createManager from './app/manager.mjs'
import { log } from './app/state.mjs'

// hook console.log
console.nativeLog = console.log.bind(console)
console.log = log

console.log('Starting server...')

const app = express();
const server = http.createServer(app);


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
        manager.connectDevice(device, socket)
    })
});

const peerTalk = new PeerTalk();
peerTalk.then((device) => {
    const socket = createDroneSocket(device)
    manager.connectDevice('drone', socket)
}).catch(e => {
    log(chalk.yellow`[WARN] No PeerTalk device detected. The drone controller won't be available until relaunch of server`)
});

server.listen(3000, () => {
    log('listening on *:3000');
});
