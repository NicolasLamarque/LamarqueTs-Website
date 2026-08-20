<template>
  <div class="flex flex-col min-h-screen">

    <!-- Arrière-plan global : une seule instance de vagues pour tout le site public -->
    <div class="fixed inset-0 bg-slate-100 dark:bg-gray-900 -z-10">
      <WavesBackground v-if="showWaves" />
    </div>

    <!-- Header fixe en haut -->
    <MainHeader class="flex-shrink-0" />

    <!-- Contenu principal qui prend tout l'espace disponible -->
    <main class="flex-1 pt-1">
      <slot />
    </main>

    <!-- Footer toujours en bas -->
    <MainFooter class="flex-shrink-0" />

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Pages d'administration : fond uni, pas de vagues
const noWavesRoutes = ['/login', '/dashboard']

const route = useRoute()
const showWaves = computed(
  () => !noWavesRoutes.some((path) => route.path.toLowerCase().startsWith(path))
)
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#__nuxt {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>