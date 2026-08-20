<template>
  <div v-if="!isChecking && isAuthenticated" class="flex h-screen bg-gray-100 dark:bg-gray-800">
    <!-- Sidebar -->
    <SideBar :activeSection="section" @select="section = $event" />

    <!-- Contenu principal -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-900 shadow-sm p-4 flex-shrink-0">
        <div class="flex justify-between items-center gap-3">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
              LamarqueTS
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ getSectionLabel(section) }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <!-- Bouton hamburger mobile -->
            <button 
              @click="toggleSidebar"
              class="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <i class="fas fa-bars text-xl text-gray-800 dark:text-gray-100"></i>
            </button>
            
            <!-- Bouton déconnexion -->
            <button 
              @click="logout" 
              class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 text-sm"
            >
              <i class="fas fa-sign-out-alt"></i>
              <span class="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Zone de contenu scrollable -->
      <div class="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
        <component :is="activeComponent" />
      </div>
    </main>
  </div>
  
  <!-- Écran de chargement -->
  <div v-else-if="isChecking" class="flex items-center justify-center h-screen bg-gray-900">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-500 mx-auto mb-4"></div>
      <p class="text-white text-xl">Vérification...</p>
    </div>
  </div>
  
  <!-- Non authentifié -->
  <div v-else class="flex items-center justify-center h-screen bg-gray-900">
    <div class="text-white text-xl">Redirection...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { navigateTo } from '#app'

// Imports statiques
import SideBar from '../components/SideBar.vue'

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
const sidebarRef = ref<InstanceType<typeof SideBar> | null>(null)

// 🔍 VÉRIFICATION DE L'AUTHENTIFICATION AU CHARGEMENT
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

// Toggle sidebar (pour le bouton hamburger dans le header)
const toggleSidebar = () => {
  // Émettre un événement personnalisé que le sidebar peut écouter
  window.dispatchEvent(new CustomEvent('toggle-sidebar'))
}

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

// Obtenir le label de la section
const getSectionLabel = (key: string): string => {
  const labels: Record<string, string> = {
    articles: 'Articles',
    users: 'Utilisateurs',
    services: 'Services',
    calendar: 'Calendrier',
    supabase: 'Monitoring DB',
    mails: 'Gestion Mails'
  }
  return labels[key] || ''
}
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

/* Amélioration du scroll sur mobile */
@supports (-webkit-overflow-scrolling: touch) {
  .overflow-y-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>