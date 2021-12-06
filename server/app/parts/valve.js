import { Socket } from 'socket.io'
import state from '../state'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpValve (socket, steps, { watch }) {
     watch(state.press.isMoving, () => {
        socket.emit('setvalve', state.press.isMoving.value ? "on" : "off")
    })
}
