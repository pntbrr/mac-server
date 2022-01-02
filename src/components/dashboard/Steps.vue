<script setup>
import useStore from '../../store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { currentStep } = storeToRefs(useStore())
const steps = [
  'idle',
  'start',
  'pickup',
  'sun rises',
  'sun bath',
  'get on',
  'press',
  'idle3',
  'shake',
  'pour water'
]
const currentStepIndex = computed(() => steps.indexOf(currentStep.value))
</script>
<template>
  <article class="h-full flex flex-col gap-4">
    <section class="card shadow-2xl bg-gray-300">
      <ul class="steps steps-vertical mx-2 pl-2 overflow-y-scroll">
        <li
            v-for="(step, i) in steps"
            :key="step"
            class="step step-neutral capitalize"
            :class="{'step-primary': i <= currentStepIndex}"
        >{{ step }}</li>
      </ul>
    </section>
    <section class="flex gap-4">
      <button class="card btn text-2xl flex-grow">◀︎</button>
      <button class="card btn text-2xl flex-grow">▶︎︎</button>
    </section>
  </article>
</template>
