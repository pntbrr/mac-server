import { onUnmounted, ref } from 'vue'
import throttle from 'lodash/throttle'

export default function() {
    let gamepadIndex = null
    let buttonsListeners = []
    let axesListeners = []
    const gamePadConnected = ref(false)

    window.addEventListener("gamepadconnected", function(e) {
        gamepadIndex = e.gamepad.index
        gamePadConnected.value = true
    });
    window.addEventListener("gamepaddisconnected", function(e) {
        gamepadIndex = null
        gamePadConnected.value = false
    });
    const pollGamePad = () => {
        if (gamepadIndex === null) {
            return
        }
        const gamePad = navigator.getGamepads()[gamepadIndex]
        gamePad.buttons.forEach((b, i) => {
            if (b.pressed) {
                if (!b.lastPressed) {
                    buttonsListeners.forEach(f => f(i))
                    b.lastPressed = true
                }
            } else {
                b.lastPressed = false
            }
        })
        axesListeners.forEach(f => f(gamePad.axes))
    }
    // requestAnimationFrame(pollGamePad)
    const pollInterval = setInterval(pollGamePad, 30)

    onUnmounted(() => {
        clearInterval(pollInterval)
    })

    const onButton = (onPressed) => {
        buttonsListeners.push(onPressed)
    }
    const onAxis = (cb, throttleVal = 100) => {
         axesListeners.push(throttle(cb, throttleVal))
    }

    return {
        onButton,
        onAxis,
        gamePadConnected
    }
}
