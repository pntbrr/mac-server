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

    socket.on('next step', () => {
        steps.nextStep()
    })
    socket.on('prev step', () => {
        steps.prevStep()
    })
    socket.on('toggle press', () => {
        state.press.isMoving.value = !state.press.isMoving.value
    })
    socket.on('gauge up', () => {
        state.alcohol.gaugeVal.value += 0.2
    })
    socket.on('gauge down', () => {
        state.alcohol.gaugeVal.value -= 0.2
    })
    socket.on('gauge val', percentage => {
        state.alcohol.gaugeVal.value = percentage / 10
    })
    socket.on('restart', () => {
        steps.goTo("start")
    })
    socket.on('go step', (step) => {
        steps.goTo(step)
    })
}
