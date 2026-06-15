<script setup lang="ts">
import { ref } from 'vue'

interface Situation {
  image: string
  titre: string
  description: string
}

const props = defineProps<{
  situations: Situation[]
}>()

const current = ref(0)

const prev = () => {
  current.value = current.value === 0 ? props.situations.length - 1 : current.value - 1
}

const next = () => {
  current.value = current.value === props.situations.length - 1 ? 0 : current.value + 1
}

const goTo = (index: number) => {
  current.value = index
}
</script>

<template>
  <div class="w-full rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden relative">

    <!-- Slides -->
    <div class="relative w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] landscape:short:h-[300px] landscape:x-short:h-[250px]">
      <transition name="fade-slide" mode="out-in">
        <div :key="current" class="absolute inset-0">
          <!-- Image -->
          <img
            :src="situations[current].image"
            :alt="situations[current].titre"
            class="w-full h-full object-cover"
            loading="lazy"
          />

          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent landscape:short:from-black/95"></div>

          <!-- Texte -->
          <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 landscape:short:p-3 landscape:x-short:p-2">
            <div class="max-w-4xl mx-auto">
              <h3 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl landscape:short:text-lg landscape:x-short:text-base font-bold text-white mb-2 sm:mb-3 md:mb-4 landscape:short:mb-1 drop-shadow-lg">
                {{ situations[current].titre }}
              </h3>
              <p class="text-sm sm:text-base md:text-lg lg:text-xl landscape:short:text-xs landscape:x-short:text-xs text-gray-100 leading-relaxed drop-shadow-md line-clamp-3 landscape:short:line-clamp-2 landscape:x-short:line-clamp-1">
                {{ situations[current].description }}
              </p>
            </div>
          </div>
        </div>
      </transition>

      <!-- Flèches -->
      <div class="absolute left-2 right-2 sm:left-4 sm:right-4 top-1/2 -translate-y-1/2 flex justify-between z-10">
        <button
          @click="prev"
          class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/95 hover:bg-white hover:scale-110 shadow-lg transition-all duration-300 flex items-center justify-center"
          aria-label="Slide précédent"
        >
          <FontAwesomeIcon :icon="['fas', 'chevron-left']" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
        </button>
        <button
          @click="next"
          class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/95 hover:bg-white hover:scale-110 shadow-lg transition-all duration-300 flex items-center justify-center"
          aria-label="Slide suivant"
        >
          <FontAwesomeIcon :icon="['fas', 'chevron-right']" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
        </button>
      </div>
    </div>

    <!-- Indicateurs -->
    <div class="flex w-full justify-center gap-2 sm:gap-3 py-4 sm:py-6 landscape:short:py-2">
      <button
        v-for="(_, index) in situations"
        :key="index"
        @click="goTo(index)"
        :class="[
          'w-2.5 h-2.5 sm:w-3 sm:h-3 landscape:short:w-2 landscape:short:h-2 rounded-full transition-all duration-300 hover:scale-125',
          index === current
            ? 'bg-sky-700 dark:bg-sky-500 scale-125'
            : 'bg-gray-300 dark:bg-gray-600 hover:bg-sky-700 dark:hover:bg-sky-500'
        ]"
        :aria-label="`Aller à la situation ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>