import { Socket } from 'socket.io'
import chalk from "chalk";

const log = console.log

import state from '../state'

/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpSpheros(socket, steps, {watch}) {
    // Maintien de l'état de la step
    const updateStep = () => socket.emit("step", steps.currentStep)
    steps.on("step", updateStep)
    updateStep()

    // spheros
    socket.on("spherosConnected", () => {
        log(chalk.bgBlue("[DEVICE:spheros] All spheros connected"))

        steps.on("pickup", () => {
            socket.emit("grow")
        })

        steps.on("sun bath", () => {
            socket.emit("solar", state.sunBath.animationDuration.value)
        })

        socket.on('winemaker', (movingVal) => {
            if (movingVal && steps.currentStep !== 'press') return
            state.press.isMoving.value = !!movingVal
        })

        socket.on('shake', (shakeVal) => {
            if (steps.currentStep === 'shake') {
                state.shake.gaugeVal.value += shakeVal
                console.log('La jauge est à', state.shake.gaugeVal.value.toFixed(2))
            }
        })
    })
}
