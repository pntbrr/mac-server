import { computed, ref } from 'vue'
import socket from '../socket'
import { useStore } from '../store'

const animSpeed = ref(0)



export default function useAnimPlay() {
    const store = useStore()
    let animDuration
    const animSpeed = computed(() => {
        const duration = store.sundialAnimDuration
        if (duration === 0) return 0
        if (animDuration) {
             return animDuration / duration
        }
    })
    const setAnimController = (anim) => {
        animDuration = anim.totalFrames / anim.frameRate
    }
    return { animSpeed, setAnimController }
}
