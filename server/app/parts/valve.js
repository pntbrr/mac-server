import { Socket } from 'socket.io'
import state from '../state'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpValve (socket, steps, { watch }) {
    const updateValve = () => {
        socket.emit('setvalve', state.press.isMoving.value ? "on" : "off")
    }
     watch(state.press.isMoving, (newVal) => {

         if (newVal && steps.currentStep === 'press') {
            updateValve()
             return
         }
         if (!newVal) {
            updateValve()
            return
         }
    })
    steps.on('press', updateValve)
}
