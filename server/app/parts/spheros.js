import { Socket } from 'socket.io'
import chalk from "chalk";
const log = console.log

import state from '../state'
/**
 * @param {Socket} socket
 * @param {StepsContext} steps
 * @param watcher
 */
export default function setUpSpheros (socket, steps, { watch }) {
     steps.on("step", (step) => {
        socket.emit("step", step)
    })
    steps.on("pickup", () => {
        socket.emit("grow")
    })
    socket.on("grape picked", () => {
        console.log("grape pick detected")
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
}
