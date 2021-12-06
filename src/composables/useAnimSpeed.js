import { ref } from 'vue'
import socket from '../socket'

const animSpeed = ref(0)
socket.on('setFeetAnimSpeed', (val) => {
    animSpeed.value = val
    console.log('feetAnimSpeed Updated', animSpeed.value)
})

export default function useAnimSpeed() {
    return { animSpeed }
}
