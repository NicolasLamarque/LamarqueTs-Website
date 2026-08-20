<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <CookieBanner />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useDarkMode } from './composables/useDarkMode'
import { computed, onMounted } from 'vue'

// --- URL CANONIQUE ---
// Aucune balise canonique n'etait servie. Sans elle, Google doit deviner
// quelle adresse fait foi quand plusieurs mènent au meme contenu — avec ou
// sans www, avec ou sans barre finale, avec un parametre de suivi.
// On declare l'adresse officielle de chaque page, une bonne fois.
const route = useRoute()
const urlCanonique = computed(
  () => `https://www.lamarquets.com${route.path === '/' ? '' : route.path}`
)

// --- TITRE GLOBAL POUR GOOGLE & SEO ---
useHead({
  link: [{ rel: 'canonical', href: urlCanonique }],
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
