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
  restart,
  goStep,
} = useDashboardSocket()

const stepsComp = ref(null)
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
    case 11:
      stepsComp.value.onConfirmSelect()
      break

  }
})

const stepSelect = ref(0)
onAxis(axis => {
  const val = -axis[1] * 5
  if (val !== 0) {
    gaugeVal((serverState.value.alcohol.gaugeVal * 10) + val)
  }

  const selectVal = axis[3]
  if (selectVal > 0.2) stepSelect.value = 1
  else if (selectVal < -0.2) stepSelect.value = -1
  else stepSelect.value = 0
})

const {
  space,
  right,
  left,
  r,
  t,
  up,
  down,
  digit1,
  digit2,
  digit3,
  digit4,
  digit5,
  digit6,
  digit7,
  digit8,
  digit9,
  digit0,
} = useMagicKeys()
watch(space, (v) => {  console.log('hey'); if (v) nextStep() })
watch(right, (v) => { if (v) nextStep() })
watch(left, (v) => { if (v) prevStep() })
watch(down, (v) => { if (v) gaugeDown() })
watch(up, (v) => { if (v) gaugeUp() })
watch(r, (v) => { if (v) restart() })
watch(t, (v) => { if (v) togglePress() })
watch(t, (v) => { if (v) togglePress() })
watch(digit1, (v) => {console.log(v); if (v) goStep('idle') })
watch(digit2, (v) => { if (v) goStep('start') })
watch(digit3, (v) => { if (v) goStep('pickup') })
watch(digit4, (v) => { if (v) goStep('sun rises') })
watch(digit5, (v) => { if (v) goStep('sun bath') })
watch(digit6, (v) => { if (v) goStep('get on') })
watch(digit7, (v) => { if (v) goStep('press') })
watch(digit8, (v) => { if (v) goStep('idle3') })
watch(digit9, (v) => { if (v) goStep('shake') })
watch(digit0, (v) => { if (v) goStep('pour water') })


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
        ref="stepsComp"
        class="area-steps"
        :step-select="stepSelect"
        @prev-step="prevStep"
        @next-step="nextStep"
        @restart="restart"
        @step="goStep"
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
