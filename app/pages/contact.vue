<template>
  <div class="main">
    <section
      class="relative py-0 sm:py-16 md:py-24 text-gray-800 dark:text-gray-100 w-full overflow-hidden"
    >
      <!-- Les vagues sont fournies par le layout -->
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