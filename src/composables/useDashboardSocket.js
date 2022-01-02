import useSocket from './useSocket'
import useStore from '../store'

export default function () {
    const socket = useSocket('dashboard')

    socket.on('state', state => {
        const store = useStore()
        store.serverState = state
    })
}
