import { io } from 'socket.io-client'
import { useStore } from './store'


const socket = import.meta.env.DEV
    ? io("http://localhost:3000")
    : io()

socket.on('connect', () => {
    socket.emit('hello', {device: 'animation'})
})

export function linkStore() {
    const store = useStore()
    socket.on('setFeetAnimSpeed', (val) => {
        store.feetAnimSpeed = val
    })
}

export default socket

