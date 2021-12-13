import { Socket } from 'socket.io'
import state from '../state'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpGauge (socket, steps, { watch }) {
    watch(state.shake.gaugeVal, newVal => {
        newVal = Math.round(newVal * 100) / 100
        console.log(newVal)
        socket.emit("setGauge", newVal)
    })
}
