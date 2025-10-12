<template>
  <div class="min-h-screen bg-black p-8">
    <ContactCard :isDark="isDark" />
  </div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue'
import { useDarkMode } from '~/composables/useDarkMode'

const { isDark, initTheme } = useDarkMode()
onMounted(() => initTheme())
</script>
