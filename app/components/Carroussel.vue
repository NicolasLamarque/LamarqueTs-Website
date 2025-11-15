<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue' // Ajout de 'computed'
import { NuxtImg } from '#components'

// Interface pour définir la structure de chaque diapositive
interface Slide {
  src: string
  alt: string
}

const props = defineProps<{
  slides: Slide[]
  interval?: number
  height?: string
}>()

const activeIndex = ref(0)
let slideInterval: any = null

// Propriété calculée pour le style 'transform'
const carouselStyle = computed(() => {
  return {
    transform: `translateX(-${activeIndex.value * 100}%)`,
  }
})

// Fonctions de navigation (inchangées)
const next = () => {
  activeIndex.value = (activeIndex.value + 1) % props.slides.length
}

const prev = () => {
  activeIndex.value = (activeIndex.value - 1 + props.slides.length) % props.slides.length
}

// ... (fonctions startSliding, stopSliding, onMounted, onUnmounted inchangées)

</script>

<template>
  <div
    class="relative w-full overflow-hidden shadow-2xl rounded-2xl"
    :style="{ height: props.height || '400px' }"
    @mouseenter="stopSliding"
    @mouseleave="startSliding"
  >
    <div
      class="flex transition-transform duration-700 ease-in-out"
      :style="carouselStyle" >
      <div v-for="(slide, index) in slides" :key="index" class="w-full flex-shrink-0 relative">
        <NuxtImg
          :src="slide.src"
          :alt="slide.alt"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black opacity-10"></div> 
      </div>
    </div>

    </div>
</template>