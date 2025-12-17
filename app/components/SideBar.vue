<!-- components/SideBar.vue -->
<template>
  <!-- Overlay pour mobile -->
  <div 
    v-if="isOpen" 
    @click="closeSidebar"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
  ></div>

  <!-- Sidebar -->
  <aside 
    :class="[
      'bg-gray-900 text-white h-screen flex flex-col',
      'fixed lg:sticky top-0 left-0 z-50',
      'w-64',
      'transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-700 flex items-center justify-between">
      <h2 class="text-xl font-bold">Menu</h2>
      <button 
        @click="closeSidebar"
        class="lg:hidden text-gray-400 hover:text-white"
      >
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-4">
      <button
        v-for="item in sections"
        :key="item.key"
        @click="selectSection(item.key)"
        :class="[
          'flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-all text-left',
          'hover:bg-gray-700',
          activeSection === item.key 
            ? 'bg-blue-600 font-semibold' 
            : 'bg-gray-800'
        ]"
      >
        <span class="text-xl mr-3">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </button>
    </nav>
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
  { key: 'mails', label: 'Gestion mails', icon: '📧' }
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