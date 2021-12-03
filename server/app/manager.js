const { EventEmitter } = require('events')
const { Socket } = require('socket.io')
const {ref, watch} = require('../lib/reactive')

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true)


function createManager () {
    let iPhoneSocket
    let iPadSocket
    let valveSocket
    let animationSocket
    let ledsSocket
    const isMoving = ref(0)

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

    function nextStep () {
        if (currentStepIndex >= steps.length - 1) return
        currentStepIndex++
        stepsEvents.emit(steps[currentStepIndex])
    }
    function prevStep () {
        if (currentStepIndex <= 0) return
        currentStepIndex--
        stepsEvents.emit(steps[currentStepIndex])
    }

    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        }
        if (key.name === 'n' || key.name === 'space') {
            console.log('next step')
            nextStep()
            return
        }
        if (key.name === 'p') {
            console.log('prev step')
            prevStep()
            return
        }
    });

    /**
     * @param {Socket} socket
     */
    function setUpIphone(socket) {
        iPhoneSocket = socket

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
            isMoving.value = movingVal
        })
    }
    /**
     * @param {Socket} socket
     */
    function setUpIpad (socket) {
        iPadSocket = socket
        stepsEvents.on("sun rises", () => {
            socket.emit("rise")
        })
        socket.on("rise end", () => {
            stepsEvents.emit("sun bath")
        })
        stepsEvents.on("sun bath", () => {
            socket.emit("spread sunlight")
        })
    }

    /**
     * @param {Socket} socket
     */
    function setUpValve (socket) {
        valveSocket = socket
        const unwatch = watch(isMoving, () => {
            socket.emit('setvalve', isMoving.value ? "on" : "off")
        })
        socket.on('disconnect', unwatch)
    }

    /**
     * @param {Socket} socket
     */
    function setUpAnimation(socket) {
        animationSocket = socket
        const updateState = () => socket.emit('setAnimSpeed', isMoving.value)

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
        const unwatch = watch(isMoving, () => {
            updateState()
        })

        socket.on('disconnect', unwatch)
    }


    /**
     * Connect a socket
     * @param {String} name
     * @param {Socket} socket
     */
    function connectDevice(name, socket) {
        socket.on('disconnect', () => {
            console.log(`${name} disconnected`)
        })
        switch (name) {
            case "iPhone":
                setUpIphone(socket)
                break;
            case "iPad":
                setUpIpad(socket)
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

    return {
        connectDevice
    }
}
module.exports = createManager
