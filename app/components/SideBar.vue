<!-- components/SideBar.vue -->
<template>
  <!-- Voile sombre en mobile, quand le menu est ouvert par-dessus le contenu -->
  <div
    v-if="isOpen"
    @click="closeSidebar"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
  ></div>

  <aside
    :class="[
      'bg-white dark:bg-gray-900 h-screen flex flex-col w-64',
      'border-r border-gray-200 dark:border-gray-800',
      'fixed lg:sticky top-0 left-0 z-50',
      'transform transition-transform duration-200 ease-out',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Titre -->
    <div class="h-16 px-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
      <div class="min-w-0">
        <p class="font-bold text-gray-800 dark:text-gray-100 leading-tight">LamarqueTS</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Administration</p>
      </div>
      <button
        @click="closeSidebar"
        class="lg:hidden p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Fermer le menu"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation
         La section active se distingue par un fond leger et une barre a
         gauche, plutot que par un aplat de couleur vive : on repere la
         position sans que le menu attire l'oeil plus que le contenu. -->
    <nav class="flex-1 overflow-y-auto p-3 space-y-0.5">
      <button
        v-for="item in sections"
        :key="item.key"
        @click="selectSection(item.key)"
        :class="[
          'group relative flex items-center gap-3 w-full pl-4 pr-3 py-2.5 rounded-lg text-sm text-left transition-colors',
          activeSection === item.key
            ? 'bg-sky-50 dark:bg-sky-900/25 text-sky-800 dark:text-sky-300 font-semibold'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
        ]"
      >
        <span
          v-if="activeSection === item.key"
          class="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-sky-600 dark:bg-sky-500"
          aria-hidden="true"
        ></span>
        <span class="text-base leading-none" aria-hidden="true">{{ item.icon }}</span>
        <span class="truncate">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Pied : rappel du site public -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour au site
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Section {
  key: string
  label: string
  icon: string
}

defineProps<{ activeSection: string }>()
const emit = defineEmits<{ select: [key: string] }>()

const isOpen = ref(false)

const sections = [
  { key: 'articles', label: 'Articles', icon: '📝' },
  { key: 'users', label: 'Utilisateurs', icon: '👥' },
  { key: 'services', label: 'Services', icon: '🛠️' },
  { key: 'calendar', label: 'Calendrier', icon: '📅' },
  { key: 'supabase', label: 'Monitoring DB', icon: '🗄️' },
  { key: 'mails', label: 'Gestion mails', icon: '📧' },
  { key: 'audit', label: 'Audit sécurité', icon: '🔒' }
]

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}

const selectSection = (key: string) => {
  emit('select', key)
  if (window.innerWidth < 1024) {
    closeSidebar()
  }
}

const handleToggle = () => toggleSidebar()

onMounted(() => {
  window.addEventListener('toggle-sidebar', handleToggle)
})

onUnmounted(() => {
  window.removeEventListener('toggle-sidebar', handleToggle)
})
</script>

<style scoped>
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>