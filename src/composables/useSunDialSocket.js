import useSocket from './useSocket'
import { onBeforeRouteLeave } from 'vue-router'
import useStore, { pinia } from '../store'

export default function () {
    const store = useStore(pinia)
    const socket = useSocket('animationSunDial')

    socket.on('playSundialAnim', store.playSundial)
}
