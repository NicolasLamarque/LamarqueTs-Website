

<!-- components/SideBar.vue -->
<template>
  <div class="w-64 bg-gray-900 text-white h-full flex flex-col p-4">
    <h2 class="text-xl font-bold mb-6">Menu</h2>

    <button
      v-for="item in sections"
      :key="item.key"
      @click="$emit('select', item.key)"
      :class="[
        'flex items-center px-4 py-2 mb-2 rounded hover:bg-gray-700 transition',
        activeSection === item.key ? 'bg-gray-700 font-semibold' : ''
      ]"
    >
      <span class="mr-2">{{ item.icon }}</span>
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Section {
  key: string
  label: string
  icon: string
}

defineProps<{ activeSection: string }>()

const sections: Section[] = [
  { key: 'articles', label: 'Articles', icon: '📝' },
  { key: 'users', label: 'Utilisateurs', icon: '👥' },
  { key: 'services', label: 'Services', icon: '🛠️' },
  { key: 'calendar', label: 'Calendrier', icon: '📅' },
  { key: 'supabase', label: 'Monitoring DB', icon: '🗄️' },
  { key: 'mails', label: 'Gestion mails', icon: '📧' }
  
]
</script>