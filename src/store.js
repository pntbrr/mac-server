import { createPinia, defineStore } from 'pinia'

export const pinia = createPinia()
export const useStore = defineStore('main', {
    state: () => ({
        currentStep: 'idle',
        feetAnimSpeed: 0,
        sundialAnim: {
            duration: 0,
            loops: 0,
        },
    }),
    actions: {
        playSundial({ duration, loops }) {
            console.log(loops)
            this.sundialAnim.loops = loops
            this.sundialAnim.duration = duration
        }
    }
})
