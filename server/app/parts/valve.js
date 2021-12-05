import { Socket } from 'socket.io'
import { get, watch } from '../../lib/reactive.js'
/**
 * @param {Socket} socket
 * @param {StepsManager} steps
 * @param state
 */
export default function setUpValve (socket, steps, state) {
    const unwatch = watch(state.press.isMoving, () => {
        socket.emit('setvalve', get(state.press.isMoving) ? "on" : "off")
    })
    socket.on('disconnect', unwatch)
}
