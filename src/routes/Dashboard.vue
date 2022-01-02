<script setup>
import { storeToRefs } from 'pinia'
import useStore from '../store'
import useDashboardSocket from '../composables/useDashboardSocket'

const {serverState} = storeToRefs(useStore())

useDashboardSocket()
</script>
<template>
  <main class="bg-base-100 h-screen p-6 grid gap-6 grid-dashboard">
    <section class="mockup-code area-logs h-full flex flex-col">
      <code class="px-4 block overflow-y-scroll flex-shrink" v-html="serverState.logs">
      </code>
    </section>
  </main>
</template>
<style>
.grid-dashboard {
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
      "devices devices logs logs"
      "devices devices logs logs"
      "steps   steps   logs logs"
      "pouring gauge   logs logs";
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
