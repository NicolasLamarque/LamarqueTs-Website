<template>
  <UTooltip :text="text" v-if="text">
    <UAvatar
      :src="src"
      :alt="alt"
    />
  </UTooltip>
</template>

<script lang="ts" setup>
defineProps<{
  alt: string
  src: string
  text?: string
}>()
</script>

<style>
/* ton style ici */
</style>
