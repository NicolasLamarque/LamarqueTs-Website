<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-800">
    <SideBar :activeSection="section" @select="section = $event" class="w-64 bg-gray-900 text-white" />

    <div class="flex-1 p-6 overflow-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>
     
        <BtnDaisyUi @click="logout" label="Déconnexion"      
          />
      </div>

      <div class="mt-4">
        <component :is="activeComponent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useCookie, navigateTo } from '#app'

// Imports statiques (toujours visibles)
import BtnDaisyUi from '~/components/btnDaisyUi.vue'

// Imports dynamiques (affichés selon la section)
const GestUserDash = defineAsyncComponent(() => import('~/components/GestUserDash.vue'))
const ArticlesDash = defineAsyncComponent(() => import('~/components/ArticlesDash.vue'))
const ServicesDash = defineAsyncComponent(() => import('~/components/ServicesDash.vue'))
const CalendarDash = defineAsyncComponent(() => import('~/components/CalendarDash.vue'))



const section = ref('articles')
const token = useCookie('auth_token').value

if (!token) {
  navigateTo('/login')
}

// Déconnexion
const logout = () => {
  useCookie('auth_token').value = null
  navigateTo('/login')
}

// Mappe la section sélectionnée au composant correspondant
const componentMap: Record<string, any> = {
  articles: ArticlesDash,
  users: GestUserDash,
  services: ServicesDash,
  calendar: CalendarDash
}

// Propriété calculée qui retourne le composant à afficher
const activeComponent = computed(() => {
  return componentMap[section.value]
})
</script>

<style scoped>
/* Style minimal, Tailwind gère déjà beaucoup */
</style>