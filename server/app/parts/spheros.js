import { Socket } from 'socket.io'
import chalk from "chalk";

const log = console.log

/**
 * @param {Socket} socket
 * @param {StepsManager} steps
 * @param state
 */
export default function setUpSpheros (socket, steps, state) {
    // TODO : register all off for stepsEvent
    const off = steps.on("step", (step) => {
        socket.emit("step", step)
    })

    socket.on("spherosConnected", () => {
        log(chalk.cyan("[INFO] All spheros connected"))

        steps.on("pickup", () => {
            socket.emit("grow")
        })

        steps.on("sun bath", () => {
            socket.emit("solar", 8)
        })

        socket.on('winemaker', (movingVal) => {
            state.press.isMoving.value = movingVal
        })
    })
    socket.on('disconnect', () => {
        off()
    })
}
