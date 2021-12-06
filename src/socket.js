import { io } from 'socket.io-client'
import { pinia, useStore } from './store'


const socket = import.meta.env.DEV
    ? io("http://localhost:3000")
    : io()

socket.on('connect', () => {
    socket.emit('hello', {device: 'animation'})
})

export function linkSocketToStore() {
    const store = useStore(pinia)
    socket.on('setFeetAnimSpeed', (val) => {
        store.feetAnimSpeed = val
    })
    socket.on('playSundialAnim', store.playSundial)
}

export default socket

