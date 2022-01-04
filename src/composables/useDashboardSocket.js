import useSocket from './useSocket'
import useStore from '../store'

export default function () {
    const {socket, socketConnected} = useSocket('dashboard')

    socket.on('state', state => {
        const store = useStore()
        store.serverState = state
    })
    return {socket, socketConnected}
}
