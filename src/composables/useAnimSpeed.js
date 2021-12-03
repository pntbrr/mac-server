import { ref } from 'vue'
import { io } from 'socket.io-client'

// const socket = io("http://localhost:3000")
const socket = io("http://192.168.3.1:3000")

const animSpeed = ref(0)

socket.on('connect', () => {
    socket.emit('hello', { device: 'feetAnimation' })

    socket.on('setAnimSpeed', (val) => {
        animSpeed.value = val
    })
})

export default function useAnimSpeed() {
    return { animSpeed }
}
