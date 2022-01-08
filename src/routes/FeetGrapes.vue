<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import {computed, ref, watch} from 'vue'
import gsap from 'gsap'
import LottieAnimation from '../components/lib/LottieAnimation.vue'
import useStore from '../store'
import {storeToRefs} from 'pinia'
import useFeetGrapesSocket from '../composables/useFeetGrapesSocket'

useFeetGrapesSocket()

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

// background musics
let bgAudio = new Audio("flute.mp3")
let fluteAudio = new Audio("flute.mp3")
let musics = [bgAudio, fluteAudio]
musics.forEach(audio => {
  audio.load()
  audio.autoplay = false
  audio.loop = true
  audio.volume = 0
  console.log(audio)
})

const fadeIn = (audio, everySecond) => {
  audio.play()
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      audio.volume += 0.1
      console.log("fade in volume", audio.volume)
    }, everySecond * i * 1000)
  }
}
const fadeOut = (audio, everySecond) => {
  for (let i = 0; i < 9; i++) {
    setTimeout(() => {
      audio.volume -= 0.1
      console.log("fade out volume", audio.volume)
    }, everySecond * i * 1000)
  }
  setTimeout(() => {
    audio.pause()
  }, everySecond * 10 * 1000)
  /*let time = setInterval(() => {
    console.log("fade out", audio, audio.volume)
    if (audio.volume <= 0) {
      console.log("stop")
      clearInterval(time)
      audio.pause()
    } else {
      audio.volume -= 0.1
    }
  }, 400);*/
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

  if ([
    'start',
    'pickup',
    'sun rises',
    'sun bath',
  ].includes(newStep)) {
    if (bgAudio.paused) {
      fadeIn(bgAudio, 2)
    }
  }

  if (newStep === "get on") {
    fadeOut(bgAudio, 0.5)
    setTimeout(() => fadeIn(fluteAudio, 1), 10000)
  }

  if (newStep === 'press') {
    prepressSpeed.value = 1
    setTimeout(() => {
      console.log('switch')
      showPrepress.value = false
    }, 700)
  }

  if (newStep !== "get on" || newStep !== "press") {
    fadeOut(fluteAudio)
  }
})

</script>

<template>
  <button @click=""/>
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
