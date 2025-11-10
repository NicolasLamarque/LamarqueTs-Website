<template>
  <div
    :class="[
      'flex flex-col p-6 rounded-2xl shadow-xl border-l-4',
      bgColorClass,
      borderColorClass
    ]"
  >
    <!-- Icon et texte -->
    <div class="flex items-start gap-3">
      <FontAwesomeIcon
        :icon="icon"
        class="w-6 h-6 text-gray-800 dark:text-gray-100 mt-1 flex-shrink-0"
      />
      <p class="text-gray-700 dark:text-gray-300 italic leading-relaxed">
        {{ text }}
      </p>
    </div>

    <!-- Bouton PDF en dessous du texte, aligné à gauche -->
    <div class="mt-4 flex flex-col sm:flex-row gap-3">
      <ToLegisPdf/>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLandmark } from '@fortawesome/free-solid-svg-icons'
import ToLegisPdf from './ToLegisPdf.vue'

const props = defineProps({
  text: {
    type: String,
    default:
      "L’information présentée sur cette page ne constitue pas un avis ou un conseil juridique. Nous vous indiquons ce que dit la loi au Québec de manière générale. Pour obtenir un avis ou un conseil juridique concernant votre situation personnelle, consultez un professionnel du droit."
  },
  icon: {
    type: [Object, Array, String],
    default: faLandmark
  },
  bgColor: {
    type: String,
    default: 'bg-white dark:bg-gray-800'
  },
  borderColor: {
    type: String,
    default: 'border-sky-700 dark:border-sky-600'
  },
  article: {
    type: Number,
    default: 2173
  }
})

const bgColorClass = props.bgColor
const borderColorClass = props.borderColor
</script>
