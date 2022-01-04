<script setup>
import { toRefs } from 'vue'

const props = defineProps(['val'])
const { val } = toRefs(props)
</script>
<template>
  <article class="flex gap-4">
    <section class="card shadow-2xl h-full bg-gray-300 p-4 overflow-y-scroll flex flex-col gap-2 à-4 flex-grow">
      <div class="h-full relative w-5 bg-gray-100 rounded-full overflow-hidden">
        <div class="absolute bottom-0 left-0 w-full bg-violet-400 h-full transition-all duration-200 " :style="{ height: val + '%' }"></div>
      </div>
    </section>
    <section class="flex flex-col gap-2">
      <button class="card btn text-2xl py-12 w-20">▲︎</button>
      <button class="card btn text-2xl py-12 w-20">▼︎</button>
    </section>
  </article>
</template>
