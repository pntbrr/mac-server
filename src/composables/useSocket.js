import { Capacitor } from '@capacitor/core'
import { io } from 'socket.io-client'
import useStore, { pinia } from '../store'

export default function useSocket(deviceName) {
    const store = useStore(pinia)
    const socket = import.meta.env.DEV || Capacitor.isNativePlatform()
        ? io(import.meta.env.VITE_SERVER_URL)
        : io()

    socket.on('connect', () => {
        socket.emit('hello', {device: deviceName})

        socket.on('step', (step) => {
            store.currentStep = step
        })
    })
    return socket
}
