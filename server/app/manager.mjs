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
import setUpDashboard from './parts/dashboard.mjs'


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

        const stepsContext = stepsManager.newContext()
        const w = watcher()

        socket.on('disconnect', () => {
            log(chalk.red(`[INFO] Device named ${name} disconnected`))
            if (state.connectedDevices[name]) state.connectedDevices[name].value = false
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
            case "gauge":
                setUpGauge(socket, stepsContext, w)
                break;
            case "dashboard":
                setUpDashboard(socket, stepsContext, w)
                break;
            default:
                if (name.startsWith('animation')) {
                    setUpAnimation(name, socket, stepsContext, w)
                }
                break;
        }
    }
    return {
        connectDevice
    }
}
