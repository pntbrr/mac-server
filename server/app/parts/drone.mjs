import { Socket } from 'socket.io'
import state from '../state.mjs'
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
}
