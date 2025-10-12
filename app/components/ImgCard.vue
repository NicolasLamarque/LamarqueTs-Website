
<script setup lang="ts">


defineProps<{
  src: string
  alt?: string
  width?: number
  height?: number
  rounded?: string
  position?: string
}>()
</script>

<template>
  <NuxtImg
    :src="src"
    :alt="alt || 'Image'"
    :width="width || 400"
    :height="height || 300"
    :class="rounded ? `rounded-${rounded}` : 'rounded-xl'"
    class="object-cover shadow-md"
  />
</template>