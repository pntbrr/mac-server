import { EventEmitter } from 'events'

/**
 *
 * @param  device
 */
export function createDroneSocket (device) {
    const emitter = new EventEmitter()
    device.on('data', data => {
        console.log(data)
        const parsed = data.split(':')
        emitter.emit(...parsed)
    })
    emitter.on('rise', () => {
        device.emit('send', 'rise')
    })
    return emitter
}
