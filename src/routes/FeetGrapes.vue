<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { computed, ref, watch } from 'vue'
import gsap from 'gsap'
import LottieAnimation from '../components/lib/LottieAnimation.vue'
import useStore from '../store'
import { storeToRefs } from 'pinia'

const {feetAnimSpeed: speed, currentStep} = storeToRefs(useStore())
const tweenedSpeed = ref(0)
const realSpeed = computed(() => +tweenedSpeed.value.toFixed(2))
let prevAnim
watch(speed, (newVal, oldVal) => {
  let duration = 0.5
  if (newVal > oldVal) duration = 2

  if (prevAnim) prevAnim.kill()
  prevAnim = gsap.to(tweenedSpeed, {duration, value: newVal});
})
let feetAnim
const setFeetController = anim => {
  feetAnim = anim
}

// pre press
const prepressSpeed = ref(0)
const showPrepress = ref(true)
let prepressAnim
const setPrepressController = (anim) => {
  prepressAnim = anim
}
watch(currentStep, newStep => {
  if ([
    'idle',
    'start',
    'pickup',
    'sun rises',
    'sun bath',
    'get on',
    'press',
  ].includes(newStep)) {
    showPrepress.value = true
    prepressSpeed.value = 0
    prepressAnim?.goToAndPlay(0)
    feetAnim.goToAndPlay(0)
  } else {
    showPrepress.value = false
    prepressSpeed.value = 0
  }

  if (newStep === 'press') {
    prepressSpeed.value = 1
    setTimeout(() => {
      console.log('switch')
      showPrepress.value = false
    }, 700)
  }
})

</script>

<template>
  <LottieAnimation
      ref="lottie"
      class="lottie"
      path="/lottiefiles/press.json"
      :auto-play="true"
      :loop="true"
      :speed="showPrepress ? 0 : realSpeed"
      @AnimControl="setFeetController"
  />
  <LottieAnimation
      v-show="showPrepress"
      ref="lottie"
      class="lottie"
      path="/lottiefiles/prepress.json"
      :auto-play="true"
      :loop="false"
      :speed="prepressSpeed"
      @AnimControl="setPrepressController"
  />
</template>

<style>
.lottie {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  cursor: none;
}
</style>
