<script setup lang="ts">
interface Situation {
  image: string
  titre: string
  description: string
}

defineProps<{
  situations: Situation[]
}>()
</script>

<template>
  <div class="carousel w-full rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
    <div
      v-for="(situation, index) in situations"
      :id="`slide${index + 1}`"
      :key="index"
      class="carousel-item relative w-full transition-all duration-500"
    >
      <!-- Image avec hauteur RESPONSIVE -->
      <div class="relative w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] landscape:short:h-[300px] landscape:x-short:h-[250px]">
        <img
          :src="situation.image"
          :alt="situation.titre"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        
        <!-- Gradient overlay - PLUS FORT en mode paysage pour lisibilité -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent landscape:short:from-black/95"></div>
        
        <!-- Contenu texte - ADAPTATIF -->
        <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 landscape:short:p-3 landscape:x-short:p-2">
          <div class="max-w-4xl mx-auto">
            <h3 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl landscape:short:text-lg landscape:x-short:text-base font-bold text-white mb-2 sm:mb-3 md:mb-4 landscape:short:mb-1 drop-shadow-lg">
              {{ situation.titre }}
            </h3>
            <p class="text-sm sm:text-base md:text-lg lg:text-xl landscape:short:text-xs landscape:x-short:text-xs text-gray-100 leading-relaxed drop-shadow-md line-clamp-3 landscape:short:line-clamp-2 landscape:x-short:line-clamp-1">
              {{ situation.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation flèches - RESPONSIVE -->
      <div class="absolute left-2 right-2 sm:left-4 sm:right-4 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
        <a
          :href="`#slide${index === 0 ? situations.length : index}`"
          class="btn btn-circle btn-xs sm:btn-sm md:btn-md landscape:short:btn-xs bg-white/95 hover:bg-white hover:scale-110 border-0 shadow-lg transition-all duration-300"
          :aria-label="`Slide précédent`"
        >
          <FontAwesomeIcon 
            :icon="['fas', 'chevron-left']" 
            class="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 landscape:short:w-3 landscape:short:h-3 text-gray-700" 
          />
        </a>
        <a
          :href="`#slide${index + 2 > situations.length ? 1 : index + 2}`"
          class="btn btn-circle btn-xs sm:btn-sm md:btn-md landscape:short:btn-xs bg-white/95 hover:bg-white hover:scale-110 border-0 shadow-lg transition-all duration-300"
          :aria-label="`Slide suivant`"
        >
          <FontAwesomeIcon 
            :icon="['fas', 'chevron-right']" 
            class="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 landscape:short:w-3 landscape:short:h-3 text-gray-700" 
          />
        </a>
      </div>
    </div>
  </div>

  <!-- Indicateurs de navigation - OPTIMISÉS -->
  <div class="flex w-full justify-center gap-2 sm:gap-3 py-4 sm:py-6 landscape:short:py-2">
    <a
      v-for="(_, index) in situations"
      :key="index"
      :href="`#slide${index + 1}`"
      class="w-2.5 h-2.5 sm:w-3 sm:h-3 landscape:short:w-2 landscape:short:h-2 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-sky-700 dark:hover:bg-sky-500 transition-all duration-300 hover:scale-125"
      :aria-label="`Aller à la situation ${index + 1}`"
    ></a>
  </div>
</template>

<style scoped>
.carousel-item {
  scroll-behavior: smooth;
}

/* Limite le nombre de lignes visibles */
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