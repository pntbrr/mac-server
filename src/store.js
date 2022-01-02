import { createPinia, defineStore } from 'pinia'

export const pinia = createPinia()

const useStore = defineStore({
    id:'main',
    state: () => ({
        currentStep: 'idle',
        feetAnimSpeed: 0,
        sundialAnim: {
            duration: 0,
            loops: 0,
        },
        serverState: {
            press: {
                isMoving: false,
            },
            alcohol: {
                gaugeVal: 0,
            },
            connectedDevices: {
                spherosb: false,
                blueTile: false,
                gauge: false,
                valve: false,
                drone: false,
                animationPress: false,
                animationSunDial: false,
                dashboard: false,
            },
            logs: '',
        }
    }),
    actions: {
        playSundial({ duration, loops }) {
            console.log(loops)
            this.sundialAnim.loops = loops
            this.sundialAnim.duration = duration
        }
    }
})
export default useStore
