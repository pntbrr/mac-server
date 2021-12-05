import { ref } from '../lib/reactive.js'

const state = {
    sunBath: {
        animationDuration: ref(0)
    },
    press: {
        isMoving: ref(false)
    },
}
export default state
