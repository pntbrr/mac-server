import { EventEmitter } from 'events'
import chalk from 'chalk'
import stepsEvents from 'nodemon'
const log = console.log

export default class StepsManager extends EventEmitter {
    steps = [
        "idle",
        "pickup",
        "sun rises",
        "sun bath",
        "get on",
        "press",
        "shake",
        "pour water",
        "re-shake"
    ]
    currentStepIndex = 0
    goTo(step) {
        const stepIndex = this.steps.indexOf(step)
        if (stepIndex === -1) return false

        this.currentStepIndex = stepIndex
        this.updateStep()
    }


    nextStep () {
        if (this.currentStepIndex >= this.steps.length - 1) return
        this.currentStepIndex++
        this.updateStep()
    }
    prevStep () {
        if (this.currentStepIndex <= 0) return
        this.currentStepIndex--
        this.updateStep()
    }

    updateStep() {
        log(chalk.green(`[STEPS] Moving to step "${(this.steps)[this.currentStepIndex]}"`))
        this.emit(this.steps[this.currentStepIndex])
        this.emit("step", this.steps[this.currentStepIndex])
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
