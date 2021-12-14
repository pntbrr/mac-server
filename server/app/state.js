import { ref } from '../lib/reactive.js'

const state = {
    sunBath: {
        animationDuration: ref(10)
    },
    press: {
        isMoving: ref(false)
    },
    alcohol: {
        gaugeVal: ref(0)
    }
}
export default state
