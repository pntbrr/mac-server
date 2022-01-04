import useSocket from './useSocket'
import { onBeforeRouteLeave } from 'vue-router'
import useStore, { pinia } from '../store'

export default function () {
    const store = useStore(pinia)
    const {socket, socketConnected} = useSocket('animationPress')
    socket.on('setFeetAnimSpeed', (val) => {
        store.feetAnimSpeed = val
    })
    return {socket, socketConnected}
}
