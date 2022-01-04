import useSocket from './useSocket'
import { onBeforeRouteLeave } from 'vue-router'
import useStore, { pinia } from '../store'

export default function () {
    const store = useStore(pinia)
    const {socket, socketConnected} = useSocket('animationSunDial')

    socket.on('playSundialAnim', store.playSundial)
    return {socket, socketConnected}
}
