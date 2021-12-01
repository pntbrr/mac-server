import { ref } from 'vue'
import { io } from 'socket.io-client'

const socket = io("http://192.168.2.1:3000")

const animSpeed = ref(0)

socket.on('connect', () => {
    socket.emit('hello', { device: 'animation' })
    socket.on('setAnimSpeed', (val) => {
        animSpeed.value = val
    })
})

export default function useAnimSpeed() {
    return { animSpeed }
}
