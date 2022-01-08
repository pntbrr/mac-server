<script setup>
import { storeToRefs } from 'pinia'
import useStore from '../store'
import useDashboardSocket from '../composables/useDashboardSocket'
import { ref, watch } from 'vue'
import Logs from '../components/dashboard/Logs.vue'
import Steps from '../components/dashboard/Steps.vue'
import Devices from '../components/dashboard/Devices.vue'
import Press from '../components/dashboard/Press.vue'
import Gauge from '../components/dashboard/Gauge.vue'
import useGamePad from '../composables/useGamePad'
import { useMagicKeys } from '@vueuse/core'

const {serverState} = storeToRefs(useStore())

const {
  socketConnected,
  togglePress,
  prevStep,
  nextStep,
  gaugeUp,
  gaugeDown,
  gaugeVal,
  restart
} = useDashboardSocket()

const {gamePadConnected, onAxis, onButton} = useGamePad()
onButton(b => {
  switch (b) {
    case 14:
      prevStep()
      break
    case 15:
      nextStep()
      break
    case 0:
      togglePress()
      break
    case 1:
      gaugeVal(0)
      break
    case 2:
      gaugeVal(90)
      break
    case 3:
      gaugeVal(60)
      break
    case 9:
      restart()
      break

  }
})
onAxis(axis => {
  const val = -axis[1] * 5
  if (val !== 0) {
    gaugeVal((serverState.value.alcohol.gaugeVal * 10) + val)
  }
})

const { space, right, left, r, t, up, down } = useMagicKeys()
watch(space, (v) => {
  if (v) nextStep()
})
watch(right, (v) => {
  if (v) nextStep()
})
watch(left, (v) => {
  if (v) prevStep()
})
watch(down, (v) => {
  if (v) gaugeDown()
})
watch(up, (v) => {
  if (v) gaugeUp()
})
watch(r, (v) => {
  if (v) restart()
})
watch(t, (v) => {
  if (v) togglePress()
})

</script>
<template>
  <main
      v-if="socketConnected"
      class="bg-base-100 h-screen p-4 grid gap-6 grid-dashboard"
  >
    <Devices
        :devices="serverState.connectedDevices"
        :gamepad-connected="gamePadConnected"
        class="area-devices"/>
    <Steps
        class="area-steps"
        @prev-step="prevStep"
        @next-step="nextStep"
        @restart="restart"
    />
    <Gauge
        :val="serverState.alcohol.gaugeVal * 10"
        class="area-gauge"
        @gauge-up="gaugeUp"
        @gauge-down="gaugeDown"
        @gauge-val="gaugeVal"
    />
    <Press :pressing="serverState.press.isMoving" class="area-pouring" @toggle="togglePress"/>
    <Logs :logs="serverState.logs" class="area-logs"/>
  </main>
  <main v-else class="bg-base-100 h-screen p-12 text-center">Connexion en cours...</main>
</template>
<style>
.grid-dashboard {
  grid-template-columns: 5fr 4fr 6fr;
  grid-template-rows: repeat(6, 1fr);
  grid-template-areas:
      "devices steps logs"
      "devices steps logs"
      "devices steps logs"
      "gauge   steps logs"
      "gauge   steps logs"
      "gauge pouring logs";
}

.area-devices {
  grid-area: devices;
}

.area-logs {
  grid-area: logs;
}

.area-steps {
  grid-area: steps;
}

.area-pouring {
  grid-area: pouring;
}

.area-gauge {
  grid-area: gauge;
}

.no-before::before {
  display: none;
}
</style>
