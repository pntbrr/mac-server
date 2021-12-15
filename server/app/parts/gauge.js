import { Socket } from 'socket.io'
import state from '../state'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpGauge (socket, steps, { watch }) {
    const updateGaugeVal = (newVal) => {

        if(steps.currentStep === 'shake' || steps.currentStep === 'pour water') {
            newVal = Math.round(newVal * 100) / 1000
            socket.emit("setGauge", newVal)
            console.log("newVal", newVal)
        }
    }
    setTimeout(() => {
        updateGaugeVal(state.alcohol.gaugeVal.value)
    },1000)
    watch(state.alcohol.gaugeVal, updateGaugeVal)
}
