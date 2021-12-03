import { io } from 'socket.io-client'

// const socket = io("http://localhost:3000")
const socket = io("http://192.168.2.1:3000")

socket.on('connect', () => {
    socket.emit('hello', {device: 'animation'})
})

export default socket
