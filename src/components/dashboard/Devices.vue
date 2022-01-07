<script setup>
import { toRefs } from 'vue'

const props = defineProps(['devices', 'gamepadConnected'])
const { devices, gamepadConnected } = toRefs(props)

const deviceName = (name) => {
  if (name === 'spherosb') name = 'spheros bluetooth'
  return name
}
const connectedColor = (name) => {
  if (['spherosb', 'blueTile'].includes(name)) {
    return 'bg-blue-600'
  }
  return 'bg-green-600'
}
</script>
<template>
  <section class="card shadow-2xl h-full bg-gray-300 p-4 overflow-y-scroll flex flex-col gap-2">
    <div
        v-for="(device, k) in devices"
        :key="k"
        class="flex items-center"
    >
      <div class="w-4 h-4 rounded-full mr-2" :class="device ? connectedColor(k) : 'bg-red-600'"></div>
      <div class="capitalize">{{ deviceName(k) }}</div>
    </div>
    <div
        class="flex items-center mt-auto"
    >
      <div class="w-4 h-4 rounded-full mr-2" :class="gamepadConnected ? 'bg-blue-600' : 'bg-red-600'"></div>
      <div>🎮</div>
    </div>

  </section>
</template>
