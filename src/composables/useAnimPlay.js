import { computed, ref } from 'vue'
import useStore, { pinia } from '../store'

const animSpeed = ref(0)



export default function useAnimPlay() {
    const store = useStore(pinia)
    let animDuration
    const animSpeed = computed(() => {
        const duration = store.sundialAnim.duration
        const loops = store.sundialAnim.loops
        if (duration === 0) return 0
        if (animDuration) {
             return (animDuration / duration) * loops
        }
    })
    const setAnimController = (anim) => {
        animDuration = anim.totalFrames / anim.frameRate
    }
    return { animSpeed, setAnimController }
}
