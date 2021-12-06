import { EventEmitter } from 'events'

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

export const ref = value => {
    return new Ref(value)
}

/**
 * @param {Ref} ref
 * @param {Function} callback
 */
export const watch = (ref, callback) => {
    ref.on('change', callback)
    return () => {
        ref.off('change', callback)
    }
}

/**
 *
 * @param {Ref} val
 * @returns {*}
 */
export const get = val => {
    return val.value
}

export const watcher = () => {
    let watches = []

    const watchLocal = (ref, callback) => {
        watches.push(watch(ref, callback))
    }
    const unWatchAll = () => {
        watches.forEach(unWatch => unWatch())
    }
    return {
        watch: watchLocal,
        unWatchAll
    }
}
