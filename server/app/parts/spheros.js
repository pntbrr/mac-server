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

        socket.on('pressing', (movingVal) => {
            if (movingVal && steps.currentStep !== 'press') return
            state.press.isMoving.value = !!movingVal
        })

        socket.on('shaking', (shakeVal) => {
            if (steps.currentStep === 'shake' && state.alcohol.gaugeVal.value < 10) {    //
                state.alcohol.gaugeVal.value += shakeVal/100

                if(state.alcohol.gaugeVal.value >= 6) {
                    state.alcohol.gaugeVal.value = 8.5
                    steps.nextStep()
                }
                console.log('La jauge est à', state.alcohol.gaugeVal.value.toFixed(2))
            }
        })
    })

    socket.on("bluetileConnected", () => {
        log(chalk.bgBlue("[DEVICE:spheros] Bluetile connected"))

        socket.on('pouring', (pourVal) => {
            if (steps.currentStep === 'pour water' && state.alcohol.gaugeVal.value > 6) {
                switch (true) {
                    case (pourVal > 300):
                        pourVal = 0.2
                        break;
                    case (pourVal > 150):
                        pourVal = 0.1
                        break;
                    case (pourVal > 0):
                        pourVal = 0.07
                        break;
                    case (pourVal > -200):
                        pourVal = 0.05
                        break;
                    case (pourVal > -700):
                        pourVal = 0.02
                        break;
                    default:
                        pourVal = 0
                        break;
                }
                console.log("pourVal", pourVal)
                state.alcohol.gaugeVal.value -= pourVal
                console.log('La jauge est à', state.alcohol.gaugeVal.value.toFixed(2))
            }
        })
    })
}
