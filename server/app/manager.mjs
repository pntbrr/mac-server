import { Socket } from 'socket.io'
import chalk from 'chalk'
import StepsManager from './StepsManager.mjs'

import setUpDrone from './parts/drone.mjs'
import setUpValve from './parts/valve.mjs'
import setUpSpheros from './parts/spheros.mjs'
import setUpAnimation from './parts/animation.mjs'
import { watcher } from '../lib/reactive.mjs'
import state, { log } from './state.mjs'
import setUpGauge from './parts/gauge.mjs'
import createDashboard from './dashboard.mjs'


export default function createManager () {

    // Steps
    const stepsManager = new StepsManager()
    createDashboard(stepsManager)

    /**
     * Connect a socket
     * @param {String} name
     * @param {Socket} socket
     */
    function connectDevice(name, socket) {
        log(chalk.cyan(`[INFO] Device connected, named ${name}`))
        if (state.connectedDevices[name]) state.connectedDevices[name].value = true
        if (name === 'animation') {
            state.connectedDevices.animations.value++
        }

        const stepsContext = stepsManager.newContext()
        const w = watcher()

        socket.on('disconnect', () => {
            log(chalk.red(`[INFO] Device named ${name} disconnected`))
            if (state.connectedDevices[name]) state.connectedDevices[name].value = false
            if (name === 'animation') {
                state.connectedDevices.animations.value--
            }
            stepsContext.unbindAll()
            w.unWatchAll()
        })
        switch (name) {
            case "spheros":
                setUpSpheros(socket, stepsContext, w)
                break;
            case "drone":
                setUpDrone(socket, stepsContext, w)
                break;
            case "valve":
                setUpValve(socket, stepsContext, w)
                break;
            case "animation":
                setUpAnimation(socket, stepsContext, w)
                break;
            case "gauge":
                setUpGauge(socket, stepsContext, w)
                break;
            default:
                break;
        }
    }

    // Bind keyboard
    // process.stdin.on('keypress', (str, key) => {
    //     if (process.argv[2] === '--debug-keys') console.log(key)
    //     if (key.ctrl && key.name === 'c') {
    //         process.exit();
    //     }
    //
    //     const isKey = (...keys) => {
    //         return keys.includes(key.name)
    //     }
    //
    //     if (isKey('n', 'space', 'right')) {
    //         stepsManager.nextStep()
    //         return
    //     }
    //     if (isKey('p', 'backspace', 'left')) {
    //         stepsManager.prevStep()
    //         return
    //     }
    //     if (isKey('t')) {
    //         state.press.isMoving.value = !state.press.isMoving.value
    //         return
    //     }
    //     if (isKey('up')) {
    //         state.alcohol.gaugeVal.value += 0.1
    //         return
    //     }
    //     if (isKey('down')) {
    //         state.alcohol.gaugeVal.value -= 0.1
    //         return
    //     }
    //     if (isKey('r')) {
    //         stepsManager.goTo("start")
    //     }
    // });

    return {
        connectDevice
    }
}
