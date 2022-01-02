import { Socket } from 'socket.io'
import chalk from "chalk";

import state, { log } from '../state.mjs'

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

    socket.on('disconnect', () => {
        state.connectedDevices.spherosb.value = false
        state.connectedDevices.blueTile.value = false

    })
    // spheros
    socket.on("spherosConnected", () => {
        log(chalk.bgBlue("[DEVICE:spheros] All spheros connected"))
        state.connectedDevices.spherosb.value = true

        steps.on("start", () => {
            socket.emit("start")
        })

        // Pickup: mûrir
        steps.on("pickup", () => {
            socket.emit("grow")
        })

        // Sun bath : gorger de sucre
        steps.on("sun bath", () => {
            socket.emit("solar", state.sunBath.animationDuration.value)
        })

        // Get On: Détecter on monte sur la presse
        steps.on('get on', () => {
            socket.emit('beforePressed')
        })
        let received = false
        socket.on('get on', () => {
            if (steps.currentStep === 'get on') {
                if (!received) {
                    received = true
                    setTimeout(() => {
                        steps.goTo('press')
                        received = false
                    }, 2000)
                }
            }
        })

        // Pressing: on est en train de presser.
        let pressedInterval
        steps.on('press', () => {
            let ledsOff = 0
            clearInterval(pressedInterval)
            pressedInterval = setInterval(() => {
                if (ledsOff >= 64) {
                    clearInterval(pressedInterval)
                    state.press.isMoving.value = false
                    steps.nextStep()
                    return
                }
                if (state.press.isMoving.value) {
                    ledsOff++
                    log(ledsOff)
                    socket.emit('pressed')
                }
            }, (state.press.fullPressDuration * 1000) / 64) // 64: number of leds in sphero
        })
        socket.on('pressing', (movingVal) => {
            if (movingVal && steps.currentStep !== 'press') return
            state.press.isMoving.value = !!movingVal
        })
        steps.on('idle3', () => {
            clearInterval(pressedInterval)
        })

        socket.on('shaking', (shakeVal) => {
            if (steps.currentStep === 'shake' && state.alcohol.gaugeVal.value < 10) {    //
                state.alcohol.gaugeVal.value += shakeVal / 100

                if (state.alcohol.gaugeVal.value >= 6) {
                    state.alcohol.gaugeVal.value = 9
                    steps.nextStep()
                }
            }
        })
    })

    socket.on("bluetileConnected", () => {
        log(chalk.bgBlue("[DEVICE:spheros] Bluetile connected"))
        state.connectedDevices.blueTile.value = true

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
                log("pourVal", pourVal)
                state.alcohol.gaugeVal.value -= pourVal
            }
        })
    })
}
