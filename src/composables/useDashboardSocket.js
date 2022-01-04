import useSocket from './useSocket'
import useStore from '../store'

export default function () {
    const {socket, socketConnected} = useSocket('dashboard')

    socket.on('state', state => {
        const store = useStore()
        store.serverState = state
    })

    const nextStep = () => {
        socket.emit('next step')
    }
    const prevStep = () => {
        socket.emit('prev step')
    }
    const togglePress = () => {
        socket.emit('toggle press')
    }
    const gaugeUp = () => {
        socket.emit('gauge up')
    }
    const gaugeDown = () => {
        socket.emit('gauge down')
    }
    const gaugeVal = val => {
        socket.emit('gauge val', val)
    }

    return {
        socket,
        socketConnected,
        nextStep,
        prevStep,
        togglePress,
        gaugeUp,
        gaugeDown,
        gaugeVal,
    }
}
