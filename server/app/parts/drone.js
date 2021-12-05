import { Socket } from 'socket.io'
/**
 * @param {Socket} socket
 */
export default function setUpDrone (socket, steps, state) {

    steps.on("sun rises", () => {
        socket.emit("rise")
    })
    socket.on("start arc", (duration) => {
        state.sunBath.animationDuration.value = +duration
        steps.goTo('sun bath')
    })

}
