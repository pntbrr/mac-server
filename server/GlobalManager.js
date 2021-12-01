class GlobalManager {
    iPhoneSocket
    valveSocket
    feetAnimationSocket
    solarAnimationSocket
    ledsSocket
    isMoving = false

    constructor() {


    }

    hello(name, socket) {
        switch (name) {
            case "iPhone":
                this.iPhoneSocket = socket
                this.setUpIphone()
                break;
            case "valve":
                this.valveSocket = socket
                break;
            case "feetAnimation":
                this.feetAnimationSocket = socket
                break;
            case "solarAnimation":
                this.solarAnimationSocket = socket
                break;
            case "leds":
                this.ledsSocket = socket
                break;
            default:
                break;
        }
    }

    setUpIphone() {
        this.iPhoneSocket.on('winemaker', (isMoving) => {
            this.isMoving = isMoving
            this.valveSocket.emit('setvalve', this.isMoving ? "on" : "off")
        })
    }


}
module.exports = GlobalManager
