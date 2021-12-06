import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
    state: () => ({
        feetAnimSpeed: 0,
        sundialAnimDuration: 0,
    }),
})
