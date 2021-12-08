import { Socket } from 'socket.io'
import state from '../state'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpAnimation (socket, steps, { watch }) {

    // Sundial
    const playSundialAnim = duration => {
        socket.emit('playSundialAnim', duration)
    }
    steps.on("sun bath", direction => {
        if (direction > 0) {
            playSundialAnim(state.sunBath.animationDuration.value)
        }
    })

    // Feet press animation
    const updateFeetAnimation = () => {
        socket.emit('setFeetAnimSpeed', state.press.isMoving.value ? 1 : 0)
    }
    updateFeetAnimation()
    watch(state.press.isMoving, () => {
        if (steps.currentStep === 'press') {
            updateFeetAnimation()
        }
    })
}
