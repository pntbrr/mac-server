class GlobalManager {
    iPhoneSocket
    valveSocket
    feetAnimationSocket
    solarAnimationSocket
    ledsSocket
    isMoving = 0

    constructor() {


    }

    hello(name, socket) {
        switch (name) {
            case "iPhone":
                this.iPhoneSocket = socket
                this.iPhoneSocket.on('disconnect', () => console.log('iPhone Disconnected'))
                this.setUpIphone()
                break;
            case "valve":
                this.valveSocket = socket
                this.valveSocket.on('disconnect', () => console.log('Valve Disconnected'))
                break;
            case "feetAnimation":
                this.feetAnimationSocket = socket
                this.feetAnimationSocket.on('disconnect', () => console.log('feetAnimation Disconnected'))
                break;
            case "solarAnimation":
                this.solarAnimationSocket = socket
                this.solarAnimationSocket.on('disconnect', () => console.log('solarAnimation Disconnected'))
                break;
            case "leds":
                this.ledsSocket = socket
                this.ledsSocket.on('disconnect', () => console.log('leds Disconnected'))
                break;
            default:
                break;
        }
    }

    setUpIphone() {
        this.iPhoneSocket.on('winemaker', (isMoving) => {
            this.isMoving = isMoving
            this.valveSocket?.emit('setvalve', this.isMoving ? "on" : "off")
            this.feetAnimationSocket?.emit('setAnimSpeed', this.isMoving)
        })
    }


}
module.exports = GlobalManager
