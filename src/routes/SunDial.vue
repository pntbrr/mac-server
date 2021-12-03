<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import LottieAnimation from '../components/lib/LottieAnimation.vue'
import useAnimPlay from '../composables/useAnimPlay'

const {animSpeed, setAnimController} = useAnimPlay()
</script>

<template>
  <LottieAnimation
      ref="lottie"
      class="lottie"
      path="https://assets10.lottiefiles.com/packages/lf20_19m6hu.json"
      :auto-play="true"
      :loop="false"
      :speed="animSpeed"
      @AnimControl="setAnimController"
  />
</template>

<style>
.lottie {
  width: 100vw;
  height: 100vh;
}
</style>
