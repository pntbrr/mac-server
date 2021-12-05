import { EventEmitter } from 'events'
import { Socket } from 'socket.io'
import { ref, watch, get } from '../lib/reactive.js'

import readline from 'readline'
import chalk from 'chalk'

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true)
const log = console.log

export default function createManager () {
    let valveSocket
    let animationSocket
    let ledsSocket

    // Steps
    const steps = [
      "idle",
      "pickup",
      "sun rises",
      "sun bath",
      "get on",
      "press",
      "shake",
      "pour water",
      "re-shake"
    ]
    let currentStepIndex = 0
    const stepsEvents = new EventEmitter()
    function goToStep(step) {
        const stepIndex = steps.indexOf(step)
        if (stepIndex === -1) return false

        currentStepIndex = stepIndex
        updateStep()
    }

    // States
    const state = {
        sunBath: {
            animationDuration: ref(0)
        },
        press: {
            isMoving: ref(false)
        },
    }

    function nextStep () {
        if (currentStepIndex >= steps.length - 1) return
        currentStepIndex++
        updateStep()
    }
    function prevStep () {
        if (currentStepIndex <= 0) return
        currentStepIndex--
        updateStep()
    }

    function updateStep() {
        log(chalk.green(`[STEPS] Moving to step "${steps[currentStepIndex]}"`))
        stepsEvents.emit(steps[currentStepIndex])
    }

    /**
     * @param {Socket} socket
     */
    function setupSpheros(socket) {

        stepsEvents.on("pickup", () => {
            socket.emit("grow")
        })
        socket.on("grape picked", () => {
            console.log("grape pick detected")
        })

        stepsEvents.on("sun bath", () => {
            socket.emit("solar", 8)
        })

        stepsEvents.on("get on", () => {
            // socket.emit("", () => {
            //
            // }
        })

        stepsEvents.on("press", () => {

        })
        socket.on('winemaker', (movingVal) => {
            state.press.isMoving.value = movingVal
        })
    }
    /**
     * @param {Socket} socket
     */
    function setUpDrone (socket) {
        stepsEvents.on("sun rises", () => {
            socket.emit("rise")
        })
        socket.on("start arc", (duration) => {
            state.sunBath.animationDuration.value = duration
            goToStep('sun bath')
        })
    }

    /**
     * @param {Socket} socket
     */
    function setUpValve (socket) {
        valveSocket = socket
        const unwatch = watch(state.press.isMoving, () => {
            socket.emit('setvalve', get(state.press.isMoving) ? "on" : "off")
        })
        socket.on('disconnect', unwatch)
    }

    /**
     * @param {Socket} socket
     */
    function setUpAnimation(socket) {
        animationSocket = socket
        const updateState = () => socket.emit('setAnimSpeed', get(state.press.isMoving))

        stepsEvents.on("sun bath", () => {
            // socket.emit("", () => {
            //
            // })
        })

        stepsEvents.on("", () => {
            // socket.emit("", () => {
            //
            // })
        })

        updateState()
        const unwatch = watch(state.press.isMoving, () => {
            updateState()
        })

        socket.on('disconnect', unwatch)

        const playSundialAnin = duration => {
            socket.emit('playSundialAnim', duration)
        }
    }


    /**
     * Connect a socket
     * @param {String} name
     * @param {Socket} socket
     */
    function connectDevice(name, socket) {
        log(chalk.cyan(`[INFO] Device connected, named ${name}`))
        socket.on('disconnect', () => {
            log(chalk.red(`[INFO] Device named ${name} disconnected`))
        })
        switch (name) {
            case "iPhone":
                setupSpheros(socket)
                break;
            case "drone":
                setUpDrone(socket)
                break;
            case "valve":
                setUpValve(socket)
                break;
            case "animation":
                setUpAnimation(socket)
                break;
            case "leds":
                ledsSocket = socket
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
            nextStep()
            return
        }
        if (['p', 'backspace', 'left'].includes(key.name)) {
            prevStep()
            return
        }
    });

    return {
        connectDevice
    }
}
