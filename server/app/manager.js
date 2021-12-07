import { Socket } from 'socket.io'
import readline from 'readline'
import chalk from 'chalk'
import StepsManager from './StepsManager.js'

import setUpDrone from './parts/drone.js'
import setUpValve from './parts/valve.js'
import setUpSpheros from './parts/spheros.js'
import setUpAnimation from './parts/animation.js'
import { watcher } from '../lib/reactive'
import state from './state'

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true)
const log = console.log

export default function createManager () {

    // Steps
    const stepsManager = new StepsManager()

    /**
     * Connect a socket
     * @param {String} name
     * @param {Socket} socket
     */
    function connectDevice(name, socket) {
        log(chalk.cyan(`[INFO] Device connected, named ${name}`))

        const stepsContext = stepsManager.newContext()
        const w = watcher()

        socket.on('disconnect', () => {
            log(chalk.red(`[INFO] Device named ${name} disconnected`))
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
                // TODO
                break;
            default:
                break;
        }
    }

    // Bind keyboard
    process.stdin.on('keypress', (str, key) => {
        if (process.argv[2] === '--debug-keys') console.log(key)
        if (key.ctrl && key.name === 'c') {
            process.exit();
        }
        if (['n', 'space', 'right'].includes(key.name)) {
            stepsManager.nextStep()
            return
        }
        if (['p', 'backspace', 'left'].includes(key.name)) {
            stepsManager.prevStep()
            return
        }
        if (['t'].includes(key.name)) {
            state.press.isMoving.value = !state.press.isMoving.value
            return
        }
    });

    return {
        connectDevice
    }
}
