import { isRef, ref, watch } from '../lib/reactive.mjs'
import { EventEmitter } from 'events'

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
        gauge: ref(false),
        valve: ref(false),
        drone: ref(false),
        animationPress: ref(false),
        animationSunDial: ref(false),
        dashboard: ref(false),
    },
    logs: ref(''),
}

export function log(...data) {
    data.forEach(d => {
        state.logs.value += d
        state.logs.value += "\n"
    })
}

function iterateState(func, obj = state) {
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] == "object")
                if (isRef(obj[property])) {
                    func(obj[property], property)
                } else {
                    iterateState(func, obj[property]);
                } else {
                func(obj)
            }
        }
    }
}


const stateWatcher = new EventEmitter()
const stateUpdated = () => stateWatcher.emit('update')

iterateState((prop, key) => {
    if (isRef(prop)) {
        watch(prop, stateUpdated)
    }
})

export function watchState(callback) {
    stateWatcher.on('update', callback)
}

export default state
