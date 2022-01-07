<script setup>
</script>
<template>
  <main>
    <router-view />
  </main>
</template>

<style>
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;

}
.no-scrollbar::-webkit-scrollbar,
.overflow-y-scroll::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 0;
  height: 0;
}
</style>
