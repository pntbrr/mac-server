<script setup>
import { storeToRefs } from 'pinia'
import useStore from '../store'
import useDashboardSocket from '../composables/useDashboardSocket'
import { ref, watch } from 'vue'
import Logs from '../components/dashboard/Logs.vue'
import Steps from '../components/dashboard/Steps.vue'

const {serverState} = storeToRefs(useStore())

useDashboardSocket()
</script>
<template>
  <main class="bg-base-100 h-screen p-4 grid gap-6 grid-dashboard">
    <Logs :logs="serverState.logs" class="area-logs" />
    <Steps class="area-steps" />
  </main>
</template>
<style>
.grid-dashboard {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-template-areas:
      "devices steps logs logs"
      "devices steps logs logs"
      "devices steps logs logs"
      "pouring gauge logs logs";
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
