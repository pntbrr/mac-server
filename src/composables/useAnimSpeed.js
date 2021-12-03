import { ref } from 'vue'
import socket from '../socket'

const animSpeed = ref(0)
socket.on('setFeetAnimSpeed', (val) => {
    animSpeed.value = val
})

export default function useAnimSpeed() {
    return { animSpeed }
}
