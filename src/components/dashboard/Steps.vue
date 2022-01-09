<script setup>
import useStore from '../../store'
import { storeToRefs } from 'pinia'
import { computed, ref, defineEmits, watch, toRefs } from 'vue'

const props = defineProps(['stepSelect'])
const { stepSelect } = toRefs(props)

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
const selectingStep = ref(null)


let selectTimeout = null
const updateTimeout = () => {
  clearTimeout(selectTimeout)
  selectTimeout = setTimeout(() => {
    selectingStep.value = null
  }, 2000)
}
watch(stepSelect, (v) => {
  if (selectingStep.value === null) selectingStep.value = currentStepIndex.value
  if (v > 0) {
    if (selectingStep.value >= steps.length - 1) return
    selectingStep.value++
  } else if (v < 0) {
    if (selectingStep.value <= 0) return
    selectingStep.value--
  } else return
  updateTimeout()
})

const emit = defineEmits(['restart', 'prev-step', 'next-step', 'step'])

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

const onConfirmSelect = () => {
  if (selectingStep.value === null) return
  clearTimeout(selectTimeout)
  emit('step', steps[selectingStep.value])
  selectingStep.value = null
}

const stepsWrapper = ref(null)
watch(currentStepIndex, (val) => {
  selectingStep.value = null
  const step = stepsWrapper.value
      .querySelectorAll('button')
      .item(currentStepIndex.value)
  step.scrollIntoView({behavior: 'smooth', block: 'nearest'})
})

const onClickStep = stepIndex => {
  if (selectingStep.value === stepIndex) {
    onConfirmSelect()
    return
  }
  selectingStep.value = stepIndex
  updateTimeout()
}

defineExpose({onConfirmSelect})
</script>
<template>
  <article class="h-full flex flex-col gap-4">
    <section class="card shadow-2xl bg-gray-300">
      <div
          class="steps steps-vertical mx-2 pl-2 overflow-y-scroll scroll-smooth"
          ref="stepsWrapper"
      >
        <button
            v-for="(step, i) in steps"
            :key="step"
            class="step step-neutral capitalize"
            :class="i === selectingStep ? 'step-error' : (i <= currentStepIndex ? 'step-primary' : '')"
            @click="onClickStep(i)"
        >{{ step }}</button>
      </div>
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
