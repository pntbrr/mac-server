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
        stepsEvents.emit((this.steps)[this.currentStepIndex])
    }
}
