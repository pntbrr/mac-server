const { Socket } = require('socket.io')
const {ref, watch} = require('../lib/reactive')

function createManager () {
    let iPhoneSocket
    let valveSocket
    let feetAnimationSocket
    let solarAnimationSocket
    let ledsSocket
    const isMoving = ref(0)

    /**
     * @param {Socket} socket
     */
    function setUpIphone(socket) {
        iPhoneSocket = socket
        socket.on('winemaker', (movingVal) => {
            isMoving.value = movingVal
        })
        socket.on('leds', () => {
            console.log('let the leds grow')
            socket.emit('grow')
        })
        socket.on('ledsGrew', () => {
            console.log('let the leds take a bathsun')
            socket.emit('solar', 8)
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
    function setUpFeetAnimation(socket) {
        feetAnimationSocket = socket
        const updateState = () => socket.emit('setAnimSpeed', isMoving.value)

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
            case "valve":
                setUpValve(socket)
                break;
            case "feetAnimation":
                setUpFeetAnimation(socket)
                break;
            case "solarAnimation":
                solarAnimationSocket = socket
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
