<template>
  <component 
    :is="text ? UTooltip : 'div'"
    :text="text"
    class="avatar-wrapper"
  >
    <UAvatar
      :src="src"
      :alt="alt"
      :size="size"
      :chip-color="status"
      :chip-position="chipPosition"
      :icon="icon"
      :class="avatarClasses"
      @error="handleImageError"
    />
  </component>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

interface Props {
  alt: string
  src?: string
  text?: string
  size?: '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  status?: 'primary' | 'red' | 'green' | 'yellow' | 'gray'
  chipPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
  icon?: string
  fallbackIcon?: string
  rounded?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  chipPosition: 'bottom-right',
  fallbackIcon: 'i-heroicons-user',
  rounded: true,
  loading: false
})

const imageError = ref(false)

const avatarClasses = computed(() => ({
  'avatar-loading': props.loading,
  'avatar-rounded': props.rounded,
  'avatar-error': imageError.value
}))

const handleImageError = () => {
  imageError.value = true
  console.warn(`Failed to load avatar image: ${props.src}`)
}

// Expose la méthode pour réinitialiser l'erreur si nécessaire
defineExpose({
  resetError: () => {
    imageError.value = false
  }
})
</script>

<style scoped>
.avatar-wrapper {
  display: inline-block;
}

.avatar-loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.avatar-rounded {
  border-radius: 9999px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Effet hover subtil */
.avatar-wrapper:hover .u-avatar {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}
</style>