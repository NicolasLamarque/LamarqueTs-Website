<!-- components/MesBoutons/BoutonMessage.vue -->
<template>
  <button class="btn btn-accent !text-black dark:!text-white bg-transparent">
  {{ label }}
</button>
</template>

<script setup lang="ts">
defineProps<{
  label: string,
}>()
</script>