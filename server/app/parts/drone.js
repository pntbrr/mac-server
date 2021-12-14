import { Socket } from 'socket.io'
import state from '../state'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpDrone (socket, steps, { watch }) {

    steps.on("sun rises", (direction) => {
        if (direction > 0) {
            socket.emit("rise")
        }
    })
    socket.on("start arc", (duration) => {
        // state.sunBath.animationDuration.value = +duration
        state.sunBath.animationDuration.value = 8
        console.log('animation duration is ' + state.sunBath.animationDuration.value)
        steps.goTo('sun bath')
    })

}
