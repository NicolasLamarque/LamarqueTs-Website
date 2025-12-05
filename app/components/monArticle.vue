<template>
  <div class="w-full relative">
    
    <!-- Arrière-plan avec vagues UNIQUE -->
    <div class="fixed inset-0 -z-10 bg-slate-100 dark:bg-gray-900">
      <WavesBackground :show-controls-button="true" />
    </div>
    
    <!-- Section titre -->
    <section class="relative py-12 sm:py-16 md:py-24 lg:py-32 text-gray-800 dark:text-gray-100">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight mb-6 tracking-tight">
          Mon Blog : Réflexions et Pensées
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
          Plongez dans mes articles dédiés à la santé mentale, au bien-être, et à l'épanouissement personnel.
          Découvrez des perspectives enrichissantes et des conseils pratiques.
        </p>
      </div>
    </section>

    <!-- Section articles AMÉLIORÉE -->
    <section class="relative py-12 sm:py-16 md:py-24">
      <div class="container mx-auto px-3 sm:px-4 max-w-7xl">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 sm:mb-12 text-center tracking-tight">
          Nos Articles
        </h2>
        
        <!-- Boîte améliorée avec dégradé et glassmorphism -->
        <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 border-2 border-sky-200 dark:border-sky-700/50 p-4 sm:p-6 md:p-8">
          
          <!-- Indicateur de scroll en haut -->
          <div class="flex justify-center mb-4">
            <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-700/60 px-4 py-2 rounded-full backdrop-blur-sm">
              <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
              <span>Faites défiler pour voir plus d'articles</span>
              <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          <!-- Zone scrollable avec style moderne -->
          <div 
            class="h-[600px] overflow-y-auto custom-scrollbar snap-y snap-mandatory rounded-xl"
            style="scroll-behavior: smooth;"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 p-2">
              <div
                v-for="article in articles"
                :key="article.id"
                class="snap-start group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-sky-300 dark:border-sky-600 overflow-hidden transform hover:-translate-y-2"
              >
                <!-- Image avec overlay au hover -->
                <figure class="relative overflow-hidden h-48">
                  <img
                    :src="article.ImageArticle"
                    :alt="article.titleArticle"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <!-- Overlay gradient -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </figure>
                
                <!-- Contenu avec plus d'espace -->
                <div class="p-5 sm:p-6">
                  <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {{ article.titleArticle }}
                  </h3>
                  
                  <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4">
                    {{ article.TextArticle }}
                  </p>
                  
                  <!-- Date avec icône plus moderne -->
                  <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30">
                      <svg class="w-4 h-4 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <span>{{ formatDate(article.DatePost) }}</span>
                  </div>
                  
                  <!-- Bouton amélioré -->
                  <NuxtLink
                    :to="`/blog/${article.id}`"
                    class="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white py-2.5 sm:py-3 px-5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full group/btn"
                  >
                    <span>Lire l'article</span>
                    <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Indicateur de scroll en bas -->
          <div class="flex justify-center mt-4">
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-700/60 px-4 py-2 rounded-full backdrop-blur-sm">
              {{ articles?.length || 0 }} article{{ articles?.length > 1 ? 's' : '' }} disponible{{ articles?.length > 1 ? 's' : '' }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section contact -->
    <section class="relative py-12 sm:py-16 md:py-24">
      <div class="container mx-auto px-3 sm:px-4 text-center max-w-4xl">
        <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 sm:p-8 md:p-12 border border-teal-100 dark:border-sky-700">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 tracking-tight">
            Une question ? Un sujet à proposer ?
          </h2>
          <p class="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Je serais ravi d'échanger avec vous. N'hésitez pas à me contacter directement.
          </p>
          <NuxtLink
            to="/contact"
            class="inline-block bg-sky-700 text-white font-semibold py-2 sm:py-3 px-5 sm:px-8 rounded-xl shadow hover:bg-sky-600 transition-all duration-300 text-sm sm:text-base"
          >
            Me contacter
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useFetch } from '#app'
import { useDarkMode } from "../composables/useDarkMode";

const { initTheme } = useDarkMode();
onMounted(() => {
  initTheme();
});

const { data: articles } = await useFetch('/api/articles')

// Fonction de formatage de date
const formatDate = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}

// SEO
useSeoMeta({
  title: 'Mon Blog - Réflexions et Insights',
  description: 'Articles sur la santé mentale, le bien-être et l\'épanouissement personnel'
})
</script>

<style scoped>
/* Scrollbar personnalisée plus élégante */
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(226, 232, 240, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #0369a1, #0284c7);
  border-radius: 10px;
  border: 2px solid rgba(226, 232, 240, 0.3);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #0284c7, #0ea5e9);
}

/* Pour Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #0284c7 rgba(226, 232, 240, 0.3);
}
</style>