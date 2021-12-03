import { ref } from 'vue'
import socket from '../socket'

const animSpeed = ref(0)



export default function useAnimPlay() {
    let animDuration
    socket.on('playSundialAnim', (duration = 1) => {
        if (animDuration) {
            animSpeed.value = animDuration / duration
        }
    })
    const setAnimController = (anim) => {
        animDuration = anim.totalFrames / anim.frameRate
    }
    return { animSpeed, setAnimController }
}
