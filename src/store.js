import { createPinia, defineStore } from 'pinia'

export const pinia = createPinia()
export const useStore = defineStore('main', {
    state: () => ({
        feetAnimSpeed: 0,
        sundialAnimDuration: 0,
    }),
    actions: {
        playSundial(duration) {
            console.log(duration)
            this.sundialAnimDuration = duration
        }
    }
})
