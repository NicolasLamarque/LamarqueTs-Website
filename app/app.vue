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

