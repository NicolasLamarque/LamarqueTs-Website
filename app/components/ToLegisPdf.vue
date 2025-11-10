<template>
  <a
    :href="pdfUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="flex items-center gap-2 bg-sky-600 text-white px-5 py-3 rounded-xl shadow hover:bg-sky-700 transition"
  >
    <FontAwesomeIcon :icon="['fas', 'file-pdf']" class="w-4 h-4" />
    Ouvrir le PDF officiel {{ article }} du Code civil du Québec
  </a>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  article: {
    type: Number,
    required: false
  },
  pdfUrl: {
    type: String,
    default: 'https://www.legisquebec.gouv.qc.ca/fr/pdf/lc/CCQ-1991.pdf'
  }
})
</script>

<style scoped>
/* Aucun style supplémentaire nécessaire, tout est dans Tailwind */
</style>
