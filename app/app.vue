<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <CookieBanner />
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
/* Laisse Nuxt/Tailwind gérer les resets automatiquement */
/* Ne touche pas aux sélecteurs globaux comme * ou #__nuxt — ils cassent ton layout */
</style>
