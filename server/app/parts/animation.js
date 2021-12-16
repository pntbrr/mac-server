import { Socket } from 'socket.io'
import state from '../state'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpAnimation (socket, steps, { watch }) {

    const updateStep = () => socket.emit("step", steps.currentStep)
    steps.on("step", updateStep)
    updateStep()

    // Sundial
    const playSundialAnim = (duration, loops) => {
        socket.emit('playSundialAnim', { duration, loops })
    }
    steps.on("sun bath", direction => {
        if (direction > 0) {
            playSundialAnim(state.sunBath.animationDuration.value,state.sunBath.loops.value)
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
