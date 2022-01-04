import { Capacitor } from '@capacitor/core'
import { io } from 'socket.io-client'
import useStore, { pinia } from '../store'
import { onBeforeRouteLeave } from 'vue-router'
import { ref } from 'vue'

export default function useSocket(deviceName) {
    const socketConnected = ref(false)
    const store = useStore(pinia)
    const socket = import.meta.env.DEV || Capacitor.isNativePlatform()
        ? io(import.meta.env.VITE_SERVER_URL)
        : io()

    socket.on('connect', () => {
        socketConnected.value = true
        socket.emit('hello', {device: deviceName})

        socket.on('step', (step) => {
            store.currentStep = step
        })
    })
    socket.on('disconnect', () => {
        socketConnected.value = false
    })
    onBeforeRouteLeave(() => {
        socket.disconnect()
    })
    return {
        socket,
        socketConnected
    }
}
