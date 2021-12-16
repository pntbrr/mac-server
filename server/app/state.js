import { ref } from '../lib/reactive.js'

const state = {
    sunRise: {
        liftOffDuration: ref(7),
        arcDuration: ref(5.45),
        landingDuration: ref(10),
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
