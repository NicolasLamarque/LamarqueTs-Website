<template>
  <!-- Afficher seulement si la vérification est terminée ET l'utilisateur est authentifié -->
  <div v-if="!isChecking && isAuthenticated" class="flex h-screen bg-gray-100 dark:bg-gray-800">
    <SideBar :activeSection="section" @select="section = $event" class="w-64 bg-gray-900 text-white pt-16" />

    <div class="flex-1 p-6 overflow-auto pt-16">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">
          LamarqueTS - Dashboard
        </h1>
        <BtnDaisyUi @click="logout" label="Déconnexion" />
      </div>

      <div class="mt-4">
        <component :is="activeComponent" />
      </div>
    </div>
  </div>
  
  <!-- Écran de chargement pendant la vérification -->
  <div v-else-if="isChecking" class="flex items-center justify-center h-screen bg-gray-900">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-500 mx-auto mb-4"></div>
      <p class="text-white text-xl">Vérification de l'authentification...</p>
    </div>
  </div>
  
  <!-- Écran si non authentifié -->
  <div v-else class="flex items-center justify-center h-screen bg-gray-900">
    <div class="text-white text-xl">Redirection vers la page de connexion...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { navigateTo } from '#app'

// Imports statiques
import BtnDaisyUi from '../components/btnDaisyUi.vue'

// Imports dynamiques
const GestUserDash = defineAsyncComponent(() => import('../components/GestUserDash.vue'))
const ArticlesDash = defineAsyncComponent(() => import('../components/ArticlesDash.vue'))
const ServicesDash = defineAsyncComponent(() => import('../components/ServicesDash.vue'))
const CalendarDash = defineAsyncComponent(() => import('../components/CalendarDash.vue'))
const GestSupaBaseDash = defineAsyncComponent(() => import('../components/GestDatabaseDash.vue'))
const mailsDash = defineAsyncComponent(() => import('../components/GestMailsDash.vue'))


const section = ref('articles')
const isChecking = ref(true)
const isAuthenticated = ref(false)

// 🔐 VÉRIFICATION DE L'AUTHENTIFICATION AU CHARGEMENT
onMounted(async () => {
  console.log('🔍 Vérification de l\'authentification...')
  
  try {
    const response = await $fetch('/api/auth/verify', {
      credentials: 'include'
    })
    
    console.log('📡 Réponse de l\'API:', response)
    
    if (!response.authenticated) {
      console.log('❌ Non authentifié, redirection vers /login')
      await navigateTo('/login')
    } else {
      console.log('✅ Authentifié, affichage du dashboard')
      isAuthenticated.value = true
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
    await navigateTo('/login')
  } finally {
    isChecking.value = false
  }
})

// Déconnexion
const logout = async () => {
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    await navigateTo('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    await navigateTo('/login')
  }
}

// Mappe la section sélectionnée au composant correspondant
const componentMap: Record<string, any> = {
  articles: ArticlesDash,
  users: GestUserDash,
  services: ServicesDash,
  calendar: CalendarDash,
  supabase: GestSupaBaseDash,
  mails: mailsDash
  }

// Propriété calculée qui retourne le composant à afficher
const activeComponent = computed(() => {
  return componentMap[section.value]
})
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>