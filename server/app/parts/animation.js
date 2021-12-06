import { Socket } from 'socket.io'
import state from '../state'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpAnimation (socket, steps, { watch }) {
    const updateState = () => {
        console.log('updateAnim')
        socket.emit('setFeetAnimSpeed', state.press.isMoving.value ? 1 : 0)
    }

    const playSundialAnim = duration => {
        socket.emit('playSundialAnim', duration)
    }

    steps.on("sun bath", direction => {
        console.log(direction)
        if (direction > 0) {
            playSundialAnim(1)
        }
    })

    updateState()
    watch(state.press.isMoving, updateState)
}
