import { ref } from '../lib/reactive.js'

const state = {
    sunBath: {
        animationDuration: ref(8)
    },
    press: {
        isMoving: ref(false)
    },
    shake: {
        gaugeVal: ref(0)

    }
}
export default state
