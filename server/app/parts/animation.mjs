import { Socket } from 'socket.io'
import state from '../state.mjs'
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
    steps.on("sun rises", direction => {
        if (direction > 0) {
            setTimeout(() => {
                playSundialAnim(state.sunRise.arcDuration.v ,1)

            }, state.sunRise.liftOffDuration.v * 1000)
        }
    })
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
