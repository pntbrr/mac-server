import { Socket } from 'socket.io'
import state from '../state.mjs'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpLamp (socket, steps, { watch }) {
    steps.on("sun rises", (direction) => {
        // Start lamp sequence
    })
}
