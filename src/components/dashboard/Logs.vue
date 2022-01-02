<script setup>
import { nextTick, onMounted, ref, toRefs, watch } from 'vue'

const props = defineProps(['logs'])
const { logs } = toRefs(props)

const logsView = ref(null)

const scrollDown = () => {
  logsView.value.scrollTop = logsView.value.scrollHeight
}
watch(logs, scrollDown)
onMounted(() => {
  setTimeout(scrollDown, 500)
})
</script>
<template>
  <section class="mockup-code h-full flex flex-col">
    <code class="px-4 block overflow-y-scroll flex-shrink" v-html="logs" ref="logsView">
    </code>
  </section>
</template>
