<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    v-bind="$attrs"
    :aria-label="ariaLabel"
    role="img"
  >
    <!-- Tête -->
    <circle :cx="12" :cy="7" :r="4" :stroke="primaryColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Corps -->
    <path :d="'M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2'" :stroke="primaryColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Flèche discrète -->
    <path d="M20 8v8" :stroke="accentColor" :stroke-width="accentStrokeWidth" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M23 12h-6" :stroke="accentColor" :stroke-width="accentStrokeWidth" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: [Number, String],
    default: 32
  },
  primaryColor: {
    type: String,
    default: '#00c2b2' // teal un peu pâle
  },
  accentColor: {
    type: String,
    default: '#80e0d8' // flèche discrète
  },
  strokeWidth: {
    type: [Number, String],
    default: 2
  },
  accentStrokeWidth: {
    type: [Number, String],
    default: 1.6
  },
  ariaLabel: {
    type: String,
    default: 'Icône connexion'
  }
})

// Permet d'accepter "24" ou 24
const size = computed(() => (typeof props.size === 'number' ? props.size : props.size))
const primaryColor = computed(() => props.primaryColor)
const accentColor = computed(() => props.accentColor)
const strokeWidth = computed(() => props.strokeWidth)
const accentStrokeWidth = computed(() => props.accentStrokeWidth)
const ariaLabel = computed(() => props.ariaLabel)

</script>

<style scoped>
/* Pas de styles CSS externes nécessaires — l'icône s'adapte via props et classes */
</style>
