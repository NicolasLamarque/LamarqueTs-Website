<template>
  <div class="bg-slate-100 dark:bg-gray-900 min-h-screen transition-colors duration-500">
    
    <!-- Article chargé -->
    <div v-if="article">
      <!-- Hero avec image -->
      <section class="relative h-[400px] md:h-[500px] overflow-hidden">
        <ImgCard 
          :src="article.ImageArticle" 
          :alt="article.titleArticle"
          :width="1200"
          :height="500"
          rounded="none"
          class="w-full h-full"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              {{ article.titleArticle }}
            </h1>
            <div class="flex items-center text-white/90">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Publié le {{ article.DatePost }}
            </div>
          </div>
        </div>
      </section>

      <!-- Contenu de l'article -->
      <section class="py-16 px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Article avec bordures légères -->
          <article class="border-l-2 border-r-2 border-sky-900 dark:border-sky-700 px-8 md:px-16 py-12">
            <!-- Contenu principal -->
            <div class="prose prose-lg dark:prose-invert max-w-none">
              <div 
                class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg markdown-content"
                v-html="htmlContent"
              ></div>
            </div>
          </article>

          <!-- Séparateur décoratif -->
          <div class="flex items-center justify-center my-12">
            <div class="h-px w-32 bg-gradient-to-r from-transparent via-sky-600 dark:via-sky-600 to-transparent"></div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
            <NuxtLink
              to="/blog"
              class="inline-flex items-center bg-slate-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-teal-100 dark:border-sky-700"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Retour aux articles
            </NuxtLink>

            <button 
              @click="shareArticle"
              class="inline-flex items-center bg-sky-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-sky-600 transition-all duration-300"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
              Partager
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- État de chargement -->
    <div v-else-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-sky-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">Chargement de l'article...</p>
      </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen px-4">
      <div class="max-w-2xl mx-auto text-center">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border border-teal-100 dark:border-sky-700">
          <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Article introuvable
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Désolé, cet article n'existe pas ou a été supprimé.
          </p>
          <NuxtLink
            to="/blog"
            class="inline-block bg-sky-700 text-white py-3 px-8 rounded-xl font-semibold shadow-xl hover:bg-sky-600 transition-colors"
          >
            Retour au blog
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

// Récupérer l'ID depuis l'URL
const route = useRoute()
const articleId = route.params.id

// Charger l'article depuis l'API
const { data: article, pending, error } = await useFetch(`/api/articles/${articleId}`)

// Convertir le Markdown en HTML
const htmlContent = computed(() => {
  if (!article.value?.TextArticle) return ''
  return marked(article.value.TextArticle)
})

// Fonction de partage
const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: article.value?.titleArticle,
      text: article.value?.TextArticle?.substring(0, 100) + '...',
      url: window.location.href
    })
  } else {
    // Copier le lien dans le presse-papier
    navigator.clipboard.writeText(window.location.href)
    alert('Lien copié dans le presse-papier!')
  }
}

// SEO dynamique
useSeoMeta({
  title: article.value?.titleArticle || 'Article',
  description: article.value?.TextArticle?.substring(0, 160) || 'Découvrez cet article',
  ogImage: article.value?.ImageArticle
})
</script>

<style scoped>
/* Style pour le contenu Markdown converti en HTML */
.markdown-content :deep(h1) {
  @apply text-4xl font-extrabold mt-8 mb-6 text-gray-800 dark:text-gray-100 tracking-tight;
}

.markdown-content :deep(h2) {
  @apply text-3xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100 tracking-tight;
}

.markdown-content :deep(h3) {
  @apply text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100;
}

.markdown-content :deep(p) {
  @apply mb-6 leading-relaxed;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
  @apply ml-6 mb-6 space-y-2;
}

.markdown-content :deep(li) {
  @apply leading-relaxed;
}

.markdown-content :deep(strong) {
  @apply font-semibold text-gray-900 dark:text-gray-50;
}

.markdown-content :deep(em) {
  @apply italic;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-sky-700 dark:border-sky-600 pl-4 italic my-6 text-gray-600 dark:text-gray-400;
}

.markdown-content :deep(hr) {
  @apply my-8 border-gray-300 dark:border-gray-700;
}

.markdown-content :deep(a) {
  @apply text-sky-700 dark:text-sky-400 hover:underline font-medium;
}
</style>