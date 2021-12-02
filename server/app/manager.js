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
    }

    /**
     * @param {Socket} socket
     */
    function setUpValve (socket) {
        valveSocket = socket
        watch(isMoving, () => {
            socket.emit('setvalve', isMoving.value ? "on" : "off")
        })
    }

    /**
     * @param {Socket} socket
     */
    function setUpFeetAnimation(socket) {
        feetAnimationSocket = socket
        watch(isMoving, () => {
            socket.emit('setAnimSpeed', isMoving.value)
        })
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
