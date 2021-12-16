import { ref } from '../lib/reactive.js'

const state = {
    sunRise: {
        liftOffDuration: ref(5),
        arcDuration: ref(8),
        landingDuration: ref(7),
    },
    sunBath: {
        animationDuration: ref(20),
        loops: ref(8),
    },
    press: {
        isMoving: ref(false),
        fullPressDuration: 30,
    },
    alcohol: {
        gaugeVal: ref(0)
    }
}
export default state
