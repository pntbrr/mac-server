import { EventEmitter } from 'events'

/**
 *
 * @param  device
 */
export function createDroneSocket (device) {
    const emitter = new EventEmitter()
    device.on('data', data => {
        const parsed = data.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").split(':')
        emitter.emit(...parsed)
    })
    emitter.on('rise', () => {
        device.emit('send', 'rise')
    })
    return emitter
}
