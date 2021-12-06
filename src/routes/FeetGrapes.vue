<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { computed, ref, watch } from 'vue'
import gsap from 'gsap'
import LottieAnimation from '../components/lib/LottieAnimation.vue'
import { useStore } from '../store'
import { storeToRefs } from 'pinia'

const {feetAnimSpeed: speed} = storeToRefs(useStore())
const tweenedSpeed = ref(0)
const realSpeed = computed(() => +tweenedSpeed.value.toFixed(2))

let prevAnim
watch(speed, (newVal, oldVal) => {
  let duration = 0.5
  if (newVal > oldVal) duration = 2

  if (prevAnim) prevAnim.kill()
  prevAnim = gsap.to(tweenedSpeed, { duration, value: newVal });
})
</script>

<template>
  <LottieAnimation
      ref="lottie"
      class="lottie"
      path="https://assets3.lottiefiles.com/packages/lf20_riok2joc.json"
      :auto-play="true"
      :loop="true"
      :speed="realSpeed"
  />
</template>

<style>
.lottie {
  width: 100vw;
  height: 100vh;
}
</style>
