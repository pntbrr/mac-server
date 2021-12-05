import { Socket } from 'socket.io'
/**
 * @param {Socket} socket
 * @param {StepsManager} steps
 * @param state
 */
export default function setUpSpheros (socket, steps, state) {
    steps.on("pickup", () => {
        socket.emit("grow")
    })
    socket.on("grape picked", () => {
        console.log("grape pick detected")
    })

    steps.on("sun bath", () => {
        socket.emit("solar", 8)
    })

    steps.on("get on", () => {
        // socket.emit("", () => {
        //
        // }
    })

    steps.on("press", () => {

    })
    socket.on('winemaker', (movingVal) => {
        state.press.isMoving.value = movingVal
    })
}
