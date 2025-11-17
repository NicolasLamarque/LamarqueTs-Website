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
  <div class="carousel w-full rounded-2xl shadow-2xl">
    <div
      v-for="(situation, index) in situations"
      :id="`slide${index + 1}`"
      :key="index"
      class="carousel-item relative w-full transition-all duration-500"
    >
      <!-- Image avec overlay -->
      <div class="relative w-full h-[400px] sm:h-[500px] md:h-[600px]">
        <img
          :src="situation.image"
          :alt="situation.titre"
          class="w-full h-full object-cover"
        />
        
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
        
        <!-- Contenu texte -->
        <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12">
          <div class="max-w-4xl mx-auto">
            <h3 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
              {{ situation.titre }}
            </h3>
            <p class="text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed drop-shadow-md">
              {{ situation.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation flèches avec FontAwesome -->
      <div class="absolute left-4 right-4 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
        <a
          :href="`#slide${index === 0 ? situations.length : index}`"
          class="btn btn-circle btn-sm sm:btn-md bg-white/95 hover:bg-white hover:scale-110 border-0 shadow-lg transition-all duration-300"
        >
          <FontAwesomeIcon :icon="['fas', 'chevron-left']" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </a>
        <a
          :href="`#slide${index + 2 > situations.length ? 1 : index + 2}`"
          class="btn btn-circle btn-sm sm:btn-md bg-white/95 hover:bg-white hover:scale-110 border-0 shadow-lg transition-all duration-300"
        >
          <FontAwesomeIcon :icon="['fas', 'chevron-right']" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </a>
      </div>
    </div>
  </div>

  <!-- Indicateurs de navigation redessinés -->
  <div class="flex w-full justify-center gap-3 py-6">
    <a
      v-for="(_, index) in situations"
      :key="index"
      :href="`#slide${index + 1}`"
      class="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-sky-700 dark:hover:bg-sky-500 transition-all duration-300 hover:scale-125"
      :aria-label="`Aller à la situation ${index + 1}`"
    ></a>
  </div>
</template>

<style scoped>
.carousel-item {
  scroll-behavior: smooth;
}
</style>