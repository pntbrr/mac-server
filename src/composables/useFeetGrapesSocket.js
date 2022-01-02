import useSocket from './useSocket'
import { onBeforeRouteLeave } from 'vue-router'
import useStore, { pinia } from '../store'

export default function () {
    const store = useStore(pinia)
    const socket = useSocket('animationPress')
    socket.on('setFeetAnimSpeed', (val) => {
        store.feetAnimSpeed = val
    })
}
