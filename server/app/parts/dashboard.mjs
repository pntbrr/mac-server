import { Socket } from 'socket.io'
import state, { log, watchState } from '../state.mjs'
import { unwrap } from '../../lib/reactive.mjs'
import Convert from 'ansi-to-html'
const convert = new Convert({
    newline: true,
    fg: '#fff',
    bg: '#3d4451'
})

/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpDashboard (socket, steps, { watch }) {
    const updateStep = () => socket.emit("step", steps.currentStep)
    steps.on("step", updateStep)
    updateStep()

    const updateState = () => {
        const s = unwrap(state)
        s.logs = convert.toHtml(s.logs)
        socket.emit('state', s)
    }
    watchState(() => {
        // No alter state in here
        updateState()
    })
    updateState()
}
