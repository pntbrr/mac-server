<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import LottieAnimation from '../components/lib/LottieAnimation.vue'
import useAnimPlay from '../composables/useAnimPlay'
import { useStore } from '../store'
import { ref } from 'vue'

const {animSpeed, setAnimController} = useAnimPlay()
const store = useStore()

const anim = ref(null)
const animLoaded = controller => {
  anim.value = controller
  setAnimController(controller)
}

store.$onAction(({name, after}) => {
  if (name === 'playSundial') {
    anim.value.goToAndPlay(0)
  }
})
</script>

<template>
  <LottieAnimation
      ref="lottie"
      class="lottie"
      path="/lottiefiles/sundial.json"
      :auto-play="true"
      :loop="false"
      :speed="animSpeed"
      @AnimControl="animLoaded"
  />
  <div
      class="cache-click"
  >
  </div>
</template>

<style>
.lottie {
  width: 100vw;
  height: 100vh;
}
.cache-click {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
