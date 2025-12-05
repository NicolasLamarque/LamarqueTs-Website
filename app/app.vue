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

// --- TITRE GLOBAL POUR GOOGLE & SEO ---
useHead({
  title: "Lamarque TS — Services psychosociaux professionnels",
  meta: [
    {
      name: "description",
      content:
        "Services psychosociaux, évaluations, soutien et accompagnement professionnel. Expertise en intervention et soutien à domicile.",
    },
  ],
})

// --- DARK MODE ---
const { initTheme } = useDarkMode()

onMounted(() => {
  initTheme()
})
</script>

<style>
/* Laisse Nuxt/Tailwind gérer les resets automatiquement */
/* Ne touche pas aux sélecteurs globaux comme * ou #__nuxt — ils cassent ton layout */
</style>
