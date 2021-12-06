import { Socket } from 'socket.io'
import state from '../state'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpDrone (socket, steps, { watch }) {

    steps.on("sun rises", () => {
        socket.emit("rise")
    })
    socket.on("start arc", (duration) => {
        state.sunBath.animationDuration.value = +duration
        steps.goTo('sun bath')
    })

}
