<template>
  <div class="bg-slate-100 dark:bg-gray-900 min-h-screen transition-colors duration-500">
    
    <!-- Section titre -->
    <section class="py-16 md:py-24 lg:py-32">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight mb-6 tracking-tight">
          Mon Blog : Réflexions et Pensées
        </h1>
        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          Plongez dans mes articles dédiés à la santé mentale, au bien-être, et à l'épanouissement personnel.
          Découvrez des perspectives enrichissantes et des conseils pratiques.
        </p>
      </div>
    </section>

    <!-- Section articles -->
    <section class="py-16 md:py-24 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-12 text-center tracking-tight">
          Nos Articles
        </h2>
        
        <!-- Zone scrollable verticale -->
        <div class="h-[600px] overflow-y-auto scrollbar-hide snap-y snap-mandatory rounded-2xl border border-sky-500 dark:border-sky-700 p-6 bg-slate-100 dark:bg-gray-900 shadow-xl">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="article in articles"
              :key="article.id"
              class="snap-start group bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-Sky-500 dark:border-sky-700 overflow-hidden"
            >
              <!-- Image -->
              <figure class="overflow-hidden">
                <img
                  :src="article.ImageArticle"
                  :alt="article.titleArticle"
                  class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </figure>
              
              <!-- Contenu -->
              <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  {{ article.titleArticle }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4">
                  {{ article.TextArticle }}
                </p>
                
                <!-- Date -->
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Publié le {{ article.DatePost }}
                </div>
                
                <!-- Bouton -->
                <NuxtLink
                  :to="`/blog/${article.id}`"
                  class="inline-block bg-sky-700 text-white py-2 px-5 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors w-full text-center"
                >
                  Lire l'article
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section contact -->
    <section class="py-16 md:py-24 bg-slate-100 dark:bg-gray-900">
      <div class="container mx-auto px-4 text-center max-w-4xl">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-Cyan-500 p-8 md:p-12 border border-sky-300 dark:border-sky-700">
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 tracking-tight">
            Une question ? Un sujet à proposer ?
          </h2>
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Je serais ravi d'échanger avec vous. N'hésitez pas à me contacter directement.
          </p>
          <NuxtLink
            to="/Contact-Page"
            class="inline-block bg-sky-700 text-white font-bold py-3 px-8 rounded-xl shadow-xl hover:shadow-2xl hover:bg-sky-600 transition-all duration-500 transform hover:scale-105"
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

const { data: articles } = await useFetch('/api/articles')

// SEO
useSeoMeta({
  title: 'Mon Blog - Réflexions et Insights',
  description: 'Articles sur la santé mentale, le bien-être et l\'épanouissement personnel'
})
</script>

<style scoped>
/* Cacher la scrollbar mais garder le scroll */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none; /* IE et Edge */
  scrollbar-width: none; /* Firefox */
}
</style>