<script setup>
import { onMounted, ref, watch } from 'vue'
import useStore from '../store'
import { storeToRefs } from 'pinia'
import useFeetGrapesSocket from '../composables/useFeetGrapesSocket'

import prepressVideo from '../assets/video/prepress.mp4'
import pressVideo from '../assets/video/press.mp4'

useFeetGrapesSocket()

const {feetAnimSpeed, currentStep} = storeToRefs(useStore())
const feetAnim = ref(null)

// pre press
const showPrepress = ref(true)
const prepressAnim = ref(null)
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
    prepressAnim.value.playbackRate = 0
    prepressAnim.value.currentTime = 0
    prepressAnim.value.play()
    feetAnim.value.currentTime = 0
    feetAnim.value.play()
  } else {
    showPrepress.value = false
    prepressAnim.value.playbackRate = 0
  }

  if (newStep === 'press') {
    prepressAnim.value.playbackRate = 1
    setTimeout(() => {
      console.log('switch')
      showPrepress.value = false
    }, 700)
  }
})
const updateVideoSpeed = () => {
  feetAnim.value.playbackRate = showPrepress.value ? 0 : feetAnimSpeed.value
}
onMounted(() => {
  prepressAnim.value.playbackRate = 0
  updateVideoSpeed()
})
watch(feetAnimSpeed, updateVideoSpeed)

</script>

<template>
  <video
      :src="pressVideo"
      ref="feetAnim"
      class="lottie"
      loop
      autoplay
      muted
  ></video>
  <video
      v-show="showPrepress"
      :src="prepressVideo"
      ref="prepressAnim"
      class="lottie"
      autoplay
      muted
  ></video>
  <!--  <LottieAnimation-->
  <!--      ref="lottie"-->
  <!--      class="lottie"-->
  <!--      path="/lottiefiles/press.json"-->
  <!--      :auto-play="true"-->
  <!--      :loop="true"-->
  <!--      :speed="showPrepress ? 0 : realSpeed"-->
  <!--      @AnimControl="setFeetController"-->
  <!--  />-->
  <!--  <LottieAnimation-->
  <!--      v-show="showPrepress"-->
  <!--      ref="lottie"-->
  <!--      class="lottie"-->
  <!--      path="/lottiefiles/prepress.json"-->
  <!--      :auto-play="true"-->
  <!--      :loop="false"-->
  <!--      :speed="prepressSpeed"-->
  <!--      @AnimControl="setPrepressController"-->
  <!--  />-->
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
