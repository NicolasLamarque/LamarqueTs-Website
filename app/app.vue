<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useDarkMode } from './composables/useDarkMode'
import { onMounted } from 'vue'

const { initTheme } = useDarkMode()

onMounted(() => {
  initTheme()
})
</script>

<style>
/* Supprimer toutes les marges et paddings par défaut */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden;
}

html {
  margin: 0;
  padding: 0;
}

#__nuxt,
#__layout {
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>