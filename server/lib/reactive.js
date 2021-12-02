const { EventEmitter } = require('events')

class Ref extends EventEmitter {
    #value
    /**
     *
     * @type {[Function]}
     */
    subscribers = []

    constructor(value) {
        super()
        this.#value = value
    }

    get value() {
        return this.#value
    }
    set value(newVal) {
        if (this.#value === newVal) return
        const oldVal = this.#value
        this.#value = newVal
        this.emit('change', newVal, oldVal)
    }
    get v() {
        return this.value
    }
    get () {
        return this.value
    }
    set (newVal) {
        this.value = newVal
    }
}

const ref = value => {
    return new Ref(value)
}

/**
 * @param {Ref} ref
 * @param {Function} callback
 */
const watch = (ref, callback) => {
    ref.on('change', callback)
}

module.exports = {
    ref,
    watch
}
