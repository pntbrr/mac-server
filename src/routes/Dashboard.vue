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

const {serverState} = storeToRefs(useStore())

const {socketConnected} = useDashboardSocket()
</script>
<template>
  <main v-if="socketConnected" class="bg-base-100 h-screen p-4 grid gap-6 grid-dashboard">
    <Devices :devices="serverState.connectedDevices" class="area-devices" />
    <Steps class="area-steps" />
    <Gauge :val="serverState.alcohol.gaugeVal * 10" class="area-gauge" />
    <Press :pressing="serverState.press.isMoving" class="area-pouring" />
    <Logs :logs="serverState.logs" class="area-logs" />
  </main>
  <main v-else class="bg-base-100 h-screen p-12 text-center">Connexion en cours...</main>
</template>
<style>
.grid-dashboard {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-template-areas:
      "devices steps logs logs"
      "devices steps logs logs"
      "devices steps logs logs"
      "gauge   steps logs logs"
      "gauge   steps logs logs"
      "gauge pouring logs logs"
  ;
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
