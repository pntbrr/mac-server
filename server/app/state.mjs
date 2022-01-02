import { ref } from '../lib/reactive.mjs'

const state = {
    sunRise: {
        liftOffDuration: ref(5),
        arcDuration: ref(10),
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
    },
    connectedDevices: {
        spherosb: ref(false),
        blueTile: ref(false),
        animations: ref(0),
        gauge: ref(false),
        valve: ref(false),
        drone: ref(false),
    },
    logs: ref(''),
}
export function log(...data) {
    data.forEach(d => {
        state.logs.value += d.toString()
        state.logs.value += "\n"
    })
}
export default state
