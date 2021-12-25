import { EventEmitter } from 'events'
import chalk from 'chalk'
import stepsEvents from 'nodemon'
import { log } from './dashboard'

export default class StepsManager extends EventEmitter {
    steps = [
        'idle',
        'start',
        'pickup',
        'sun rises',
        'sun bath',
        'get on',
        'press',
        'idle3',
        'shake',
        'pour water'
    ]
    #_currentStepIndex = 0
    get currentStepIndex() {
        return this.#_currentStepIndex
    }
    set currentStepIndex(newVal) {
        const oldVal = this.#_currentStepIndex
        this.#_currentStepIndex = newVal

        this.updateStep(newVal, oldVal)
    }
    get currentStep() {
        return this.steps[this.currentStepIndex]
    }

    goTo(step) {
        const stepIndex = this.steps.indexOf(step)
        if (stepIndex === -1) return false
        log(step)
        this.currentStepIndex = stepIndex
    }

    nextStep () {
        if (this.currentStepIndex >= this.steps.length - 1) return
        this.currentStepIndex++
    }
    prevStep () {
        if (this.currentStepIndex <= 0) return
        this.currentStepIndex--
    }

    updateStep(newVal, oldVal) {
        log(chalk.green(`[STEPS] Moving to step "${(this.steps)[this.currentStepIndex]}"`))

        const direction = newVal - oldVal

        this.emit(this.steps[this.currentStepIndex], direction)
        this.emit("step", this.steps[this.currentStepIndex], direction)
    }

    on(event, cb) {
        super.on(event, cb)
        return () => {
            this.off(event, cb)
        }
    }
    newContext() {
        return new StepsContext(this)
    }
}

export class StepsContext {
    manager
    listeners = []
    /**
     *
     * @param { StepsManager} manager
     */
    constructor(manager) {
        this.manager = manager
        this.nextStep = manager.nextStep.bind(manager)
        this.prevStep = manager.prevStep.bind(manager)
        this.goTo = manager.goTo.bind(manager)
        this.steps = manager.steps
        this.off = this.unbindAll
    }
    get currentStep() {
        return this.manager.currentStep
    }
    on (event, cb) {
        this.listeners.push({ event, cb })
        this.manager.on(event, cb)
    }
    unbindAll() {
        this.listeners.forEach(listener => {
            this.manager.off(listener.event, listener.cb)
        })
    }
}
