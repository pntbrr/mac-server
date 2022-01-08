<script setup>
import useStore from '../../store'
import { storeToRefs } from 'pinia'
import { computed, ref, defineEmits, watch } from 'vue'

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

const emit = defineEmits(['restart', 'prev-step', 'next-step'])

const confirmRestart = ref(false)
const clickRestart = () => {
  if (confirmRestart.value) {
    emit('restart')
    confirmRestart.value = false
  } else {
    confirmRestart.value = true
    setTimeout(() => confirmRestart.value = false, 1000)
  }
}

const stepsWrapper = ref(null)
watch(currentStepIndex, (val) => {
  const step = stepsWrapper.value
      .querySelectorAll('li')
      .item(currentStepIndex.value)
  step.scrollIntoView({behavior: 'smooth', block: 'nearest'})
})

</script>
<template>
  <article class="h-full flex flex-col gap-4">
    <section class="card shadow-2xl bg-gray-300">
      <ul
          class="steps steps-vertical mx-2 pl-2 overflow-y-scroll scroll-smooth"
          ref="stepsWrapper"
      >
        <li
            v-for="(step, i) in steps"
            :key="step"
            class="step step-neutral capitalize"
            :class="{'step-primary': i <= currentStepIndex}"
        >{{ step }}</li>
      </ul>
    </section>
    <section class="flex gap-4">
      <button
          class="card btn text-2xl py-8 flex-grow"
          @click="$emit('prev-step')"
      >◀︎</button>
      <button
          class="card btn text-2xl py-8 flex-grow"
          :class="confirmRestart ? 'btn-error' : ''"
          @click="clickRestart"
      >↻</button>
      <button
          class="card btn text-2xl py-8 flex-grow"
          @click="$emit('next-step')"
      >▶︎︎</button>
    </section>
  </article>
</template>
