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

    steps.on("sun bath", () => {
        console.log('step sunbath !')
    })

    updateState()
    watch(state.press.isMoving, updateState)

    // Sun dial
    const playSundialAnin = duration => {
        socket.emit('playSundialAnim', duration)
    }
}
