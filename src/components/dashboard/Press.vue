<script setup>
import { toRefs } from 'vue'

const props = defineProps(['pressing'])
const { pressing } = toRefs(props)

</script>
<template>
  <button
      class="card btn shadow-2xl h-full p-4 flex flex-col gap-2 border-none"
      :class="pressing ? 'btn-error' : 'btn-success'"
      @click="$emit('toggle')"
  >
    {{ pressing ? 'Pressing' : 'Not pressing' }}
  </button>
</template>
