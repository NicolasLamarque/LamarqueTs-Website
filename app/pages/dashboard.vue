<template>
  <div v-if="!isChecking && isAuthenticated" class="dashboard-shell flex h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar -->
    <SideBar :activeSection="section" @select="section = $event" />

    <!-- Contenu principal -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- En-tete
           Meme hauteur que le titre de la barre laterale (h-16), pour que les
           deux se rejoignent sur une ligne continue. Le nom de la section
           tient lieu de titre : le nom du site est deja dans la barre. -->
      <header class="h-16 px-4 sm:px-6 flex items-center justify-between gap-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Ouvrir le menu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
            {{ getSectionLabel(section) }}
          </h1>
        </div>

        <button
          @click="logout"
          class="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="hidden sm:inline">Déconnexion</span>
        </button>
      </header>

      <!-- Zone de contenu scrollable -->
      <div class="dashboard-content flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
        <component :is="activeComponent" />
      </div>
    </main>
  </div>
  
  <!-- Écran de chargement -->
  <div v-else-if="isChecking" class="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
    <div class="text-center">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 dark:border-gray-700 border-t-sky-600 mx-auto mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400 text-sm">Vérification de la session…</p>
    </div>
  </div>
  
  <!-- Non authentifié -->
  <div v-else class="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
    <p class="text-gray-500 dark:text-gray-400 text-sm">Redirection vers la connexion…</p>
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
const CalendarDash = defineAsyncComponent(() => import('../components/CalendarDash.vue'))
const GestSupaBaseDash = defineAsyncComponent(() => import('../components/GestDatabaseDash.vue'))
const mailsDash = defineAsyncComponent(() => import('../components/GestMailsDash.vue'))
const AuditDash = defineAsyncComponent(() => import('../components/AuditDash.vue'))

// Meme raison que pour la page de connexion : jamais dans un moteur de
// recherche, quelle que soit la maniere dont l'adresse est arrivee la.
useHead({
  title: 'Administration',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

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
  calendar: CalendarDash,
  supabase: GestSupaBaseDash,
  mails: mailsDash,
  audit: AuditDash
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
    calendar: 'Calendrier',
    supabase: 'Monitoring DB',
    mails: 'Gestion Mails',
    audit: 'Audit de sécurité'
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

<style>
/* ==========================================================================
   Impression du tableau de bord
   ==========================================================================
   Le tableau de bord est concu pour l'ecran : hauteur fixe (h-screen) et
   defilement interne (overflow-y-auto). A l'impression, ces deux contraintes
   font que seule la premiere hauteur d'ecran sort sur le papier, et tout le
   reste est coupe net.
   On les neutralise ici, et on retire la navigation qui n'a aucun sens sur
   un document imprime. */
@media print {
  html,
  body,
  #__nuxt {
    height: auto !important;
    overflow: visible !important;
    background: #fff !important;
  }

  .dashboard-shell {
    display: block !important;
    height: auto !important;
    overflow: visible !important;
    background: #fff !important;
  }

  /* Barre laterale et en-tete : inutiles sur un rapport imprime. */
  .dashboard-shell aside,
  .dashboard-shell > main > header {
    display: none !important;
  }

  .dashboard-shell main,
  .dashboard-content {
    display: block !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    padding: 0 !important;
  }

  /* Les tableaux places dans un conteneur a defilement horizontal doivent
     s'imprimer en entier, pas seulement la partie visible a l'ecran. */
  .dashboard-content .overflow-x-auto {
    overflow: visible !important;
  }
}
</style>
