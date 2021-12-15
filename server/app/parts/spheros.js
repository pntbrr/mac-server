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

        // Pickup: mûrir
        steps.on("pickup", () => {
            socket.emit("grow")
        })

        // Sun bath : gorger de sucre
        steps.on("sun bath", () => {
            socket.emit("solar", state.sunBath.animationDuration.value)
        })

        // Get On: Détecter on monte sur la presse
        let received = false
        socket.on('get on', () => {
            if (steps.currentStep === 'get on') {
                if (!received) {
                    received = true
                    setTimeout(() => {
                        steps.nextStep()
                        received = false
                    }, 2000)
                }
            }
        })

        // Pressing: on est en train de presser.
        let ledsOff = 0
        steps.on('press', () => {
            const pressedInterval = setInterval(() => {
                socket.emit('pressed')
                if (state.press.isMoving.value) {
                    ledsOff++
                }
                if (ledsOff >= 64) {
                    clearInterval(pressedInterval)
                    steps.nextStep()
                }
            }, (state.press.fullPressDuration * 1000) / 64) // 64: number of leds in sphero
        })
        socket.on('pressing', (movingVal) => {
            if (movingVal && steps.currentStep !== 'press') return
            state.press.isMoving.value = !!movingVal
        })

        socket.on('shaking', (shakeVal) => {
            if (steps.currentStep === 'shake' && state.alcohol.gaugeVal.value < 10) {    //
                state.alcohol.gaugeVal.value += shakeVal / 100

                if (state.alcohol.gaugeVal.value >= 6) {
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
