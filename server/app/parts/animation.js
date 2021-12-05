import { Socket } from 'socket.io'
import { get, watch } from '../../lib/reactive.js'
/**
 * @param {Socket} socket
 * @param {StepsManager} steps
 * @param {state} state
 */
export default function setUpAnimation (socket, steps, state) {
    const updateState = () => socket.emit('setAnimSpeed', get(state.press.isMoving))

    steps.on("sun bath", () => {
        // socket.emit("", () => {
        //
        // })
    })

    steps.on("", () => {
        // socket.emit("", () => {
        //
        // })
    })

    updateState()
    const unwatch = watch(state.press.isMoving, () => {
        updateState()
    })

    socket.on('disconnect', unwatch)

    // Sun dial
    const playSundialAnin = duration => {
        socket.emit('playSundialAnim', duration)
    }
}
