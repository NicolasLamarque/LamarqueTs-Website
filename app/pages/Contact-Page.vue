<template>
  <div class="main">
    <section
      class="relative py-0 sm:py-16 md:py-24 text-gray-800 dark:text-gray-100 w-full overflow-hidden"
    >
      <!-- 1. D'ABORD les vagues en arrière-plan -->
      <div class="absolute inset-0 bg-slate-100 dark:bg-gray-900">
        <WavesBackground :show-controls-button="true" />
      </div>

      <!-- 2. ENSUITE le contenu par-dessus avec z-10 -->
      <div class="relative z-10">
        <ContactCard :isDark="isDark" />
      </div>
    </section>  
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDarkMode } from '../composables/useDarkMode'

const { isDark, initTheme } = useDarkMode()

onMounted(() => initTheme())

useHead({
  title: 'Contact | Services psychosociaux à Shawinigan',
  meta: [
    {
      name: 'description',
      content: 'Contactez-moi pour prendre rendez-vous ou pour toute question concernant mes services d\'accompagnement psychosocial à Shawinigan.'
    }
  ]
})
</script>