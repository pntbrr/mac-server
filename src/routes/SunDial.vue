<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import LottieAnimation from '../components/lib/LottieAnimation.vue'
import useAnimPlay from '../composables/useAnimPlay'
import useStore from '../store'
import { ref } from 'vue'
import useSunDialSocket from '../composables/useSunDialSocket'

useSunDialSocket()

const {animSpeed, setAnimController} = useAnimPlay()
const store = useStore()

const anim = ref(null)
const animLoaded = controller => {
  anim.value = controller
  setAnimController(controller)
}
store.$onAction(({name, after}) => {
  after(() => {
    if (name === 'playSundial') {
      anim.value.goToAndPlay(0)
      setTimeout(() => anim.value.pause(), store.sundialAnim.duration * 1000)
    }
  })
})
</script>

<template>
  <LottieAnimation
      ref="lottie"
      class="lottie"
      path="/lottiefiles/sundial.json"
      :auto-play="false"
      :loop="true"
      :speed="animSpeed"
      @AnimControl="animLoaded"
  />
<!--  <div v-if="store.currentStep === 'sun rises'" class="lightpanel"></div>-->
</template>

<style>
body {
  background-color: #000;
}
.lottie {
  width: 100vw;
  height: 100vh;
}

.lightpanel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  animation: sunLight 20s linear;
}

@keyframes sunLight {
  from {
    background-color: #000;
  }
  10% {
    background-color: #0b0e1e;
  }
  50% {
    background-color: #fff5eb;
  }
  90% {
    background-color: #1e0a03;
  }
  to {
    background-color: #000;
  }
}
</style>
