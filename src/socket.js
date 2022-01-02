import { io } from 'socket.io-client'
import useStore, { pinia } from './store'
import { Capacitor } from '@capacitor/core'


const socket = import.meta.env.DEV || Capacitor.isNativePlatform()
    ? io(import.meta.env.SERVER_URL)
    : io()

socket.on('connect', () => {
    socket.emit('hello', {device: 'animation'})
})

export function linkSocketToStore() {
    const store = useStore(pinia)

    socket.on('step', (step) => {
        store.currentStep = step
    })

    socket.on('setFeetAnimSpeed', (val) => {
        store.feetAnimSpeed = val
    })
    socket.on('playSundialAnim', store.playSundial)
}

export default socket

