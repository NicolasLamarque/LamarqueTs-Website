<template>
  <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Gestion des Articles</h2>
      
      <!-- 🐛 BOUTON DEBUG
      <button 
        @click="forceReload" 
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
      >
        🔄 FORCE RELOAD DB
      </button>

       -->
    </div>

    <div v-if="message" :class="message.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
      class="text-white p-3 rounded-lg shadow-md mb-4 animate-fade-in">
      {{ message.text }}
    </div>

    <form @submit.prevent="submitArticle" class="mb-6 bg-white dark:bg-gray-700 p-4 rounded shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="col-span-1">
          <label class="block font-medium mb-1">Titre de l'article</label>
          <input v-model="form.titleArticle" type="text" class="w-full px-3 py-2 border rounded" required :disabled="isLoading" />
        </div>

        <div class="col-span-1">
          <label class="block font-medium mb-1">Auteur</label>
          <input v-model="form.AuthorArticle" type="text" class="w-full px-3 py-2 border rounded" required :disabled="isLoading" />
        </div>
        
        <div class="col-span-1">
          <label class="block font-medium mb-1">Catégorie</label>
          <input v-model="form.CategoryArticle" type="text" class="w-full px-3 py-2 border rounded" :disabled="isLoading" />
        </div>

        <div class="col-span-1 md:col-span-2 lg:col-span-3">
          <label class="block font-medium mb-1">URL de l'image</label>
          <input v-model="form.ImageArticle" type="text" class="w-full px-3 py-2 border rounded" :disabled="isLoading" />
        </div>

        <div class="col-span-1 md:col-span-2 lg:col-span-3">
          <label class="block font-medium mb-1">Contenu de l'article (Markdown)</label>
          <textarea v-model="form.TextArticle" class="w-full px-3 py-2 border rounded h-40" required :disabled="isLoading"></textarea>
        </div>

        <div class="col-span-1 md:col-span-2 lg:col-span-3">
          <label class="block font-medium mb-1">Tags (séparés par des virgules)</label>
          <input v-model="form.TagsArticle" type="text" class="w-full px-3 py-2 border rounded" :disabled="isLoading" />
        </div>
      </div>

      <div class="flex justify-between mt-4">
        <button class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition" :disabled="isLoading">
          {{ isLoading ? 'Chargement...' : (editMode ? 'Modifier' : 'Ajouter') }}
        </button>
        <button v-if="editMode" type="button" @click="cancelEdit" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition" :disabled="isLoading">
          Annuler
        </button>
      </div>
    </form>

    <div class="bg-white dark:bg-gray-700 p-4 rounded shadow">
      <div v-if="isLoading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-2xl text-gray-500"></i>
        <p class="mt-2 text-gray-500">Chargement...</p>
      </div>
      
      <table v-else class="w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-200 dark:bg-gray-600">
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Titre</th>
            <th class="px-4 py-2 text-left">Auteur</th>
            <th class="px-4 py-2 text-left">Catégorie</th>
            <th class="px-4 py-2 text-left">Date</th>
            <!-- 🐛 DEBUG
            <th class="px-4 py-2 text-left bg-red-100">🐛 DEBUG</th>
            -->
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in articles" :key="a.id" class="border-b border-gray-300 dark:border-gray-600">
            <td class="px-4 py-2">{{ a.id }}</td>
            <td class="px-4 py-2">{{ a.titleArticle }}</td>
            <td class="px-4 py-2">{{ a.AuthorArticle }}</td>
            <td class="px-4 py-2">{{ a.CategoryArticle }}</td>
            <td class="px-4 py-2">{{ formatDate(a.DatePost) }}</td>
            <!-- 🐛 DEBUG
            <td class="px-4 py-2 bg-red-50 text-xs">
              <div>created: {{ a.created_at ? '✅' : '❌' }}</div>
              <div>updated: {{ a.updated_at ? '✅' : '❌' }}</div>
            </td>
            -->
            <td class="px-4 py-2 flex gap-2 justify-center">
              <button @click="editArticle(a)" class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Modifier</button>
              <button @click="viewArticle(a)" class="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600">Voir</button>
              <button @click="deleteArticleConfirm(a.id)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Supprimer</button>
            </td>
          </tr>
          <tr v-if="articles.length === 0">
            <td colspan="6" class="text-center py-4 text-gray-500">Aucun article</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div class="relative p-8 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-700">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{{ currentArticle?.titleArticle }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Par {{ currentArticle?.AuthorArticle }} le {{ formatDate(currentArticle?.DatePost) }}
          </p>
          <NuxtImg
            v-if="currentArticle?.ImageArticle"
            :src="currentArticle.ImageArticle"
            alt="Image de l'article"
            class="w-full h-auto mt-4 mb-4 rounded-md shadow-lg"
          />
          <div class="mt-2 px-7 py-3 max-h-[70vh] overflow-y-auto prose dark:prose-invert markdown-content">
            <div v-html="renderedMarkdown"></div>
          </div>
          <div class="items-center px-4 py-3">
            <button @click="closeModal" class="px-4 py-2 bg-sky-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { marked } from 'marked'
import type { ArticleSelect } from '~/server/utils/schema'

interface Message {
  text: string
  type: 'success' | 'error'
}

const articles = ref<ArticleSelect[]>([])
const form = ref<Partial<ArticleSelect>>({
  titleArticle: '',
  TextArticle: '',
  AuthorArticle: '',
  CategoryArticle: '',
  ImageArticle: '',
  TagsArticle: ''
})
const editMode = ref(false)
const isLoading = ref(false)
let editId: number | null = null
const message = ref<Message | null>(null)
const showModal = ref(false)
const currentArticle = ref<ArticleSelect | null>(null)
const renderedMarkdown = ref('')

const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = null
  }, 3000)
}

const loadArticles = async () => {
  try {
    isLoading.value = true
    
    console.log('🔄 Chargement articles...')
    
    // ✅ FORCE REFRESH depuis la DB
    const data = await $fetch<ArticleSelect[]>('/api/articles', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    console.log('📥 Articles reçus depuis API:', data)
    console.log('📊 Nombre:', data.length)
    console.log('📋 IDs:', data.map(a => a.id))
    console.log('📋 Titres:', data.map(a => a.titleArticle))
    
    // ✅ VÉRIFIER SI articles.value AVANT écrasement
    console.log('🗂️ Articles AVANT mise à jour:', articles.value.length)
    
    articles.value = data
    
    console.log('✅ Articles APRÈS mise à jour:', articles.value.length)
    
  } catch (error) {
    console.error('❌ Erreur chargement articles:', error)
    showMessage('Erreur lors du chargement des articles.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Convertir le Markdown en HTML
const htmlContent = computed(() => {
  if (!currentArticle.value?.TextArticle) return ''
  return marked(currentArticle.value.TextArticle)
})

onMounted(loadArticles)

const submitArticle = async () => {
  try {
    isLoading.value = true
    const articleData = {
      titleArticle: form.value.titleArticle,
      TextArticle: form.value.TextArticle,
      DatePost: new Date().toISOString().slice(0, 10),
      AuthorArticle: form.value.AuthorArticle,
      CategoryArticle: form.value.CategoryArticle,
      ImageArticle: form.value.ImageArticle,
      TagsArticle: form.value.TagsArticle
    }

    if (editMode.value && editId !== null) {
      await $fetch(`/api/articles/${editId}`, {
        method: 'PUT',
        body: articleData
      })
      showMessage('Article modifié avec succès !', 'success')
    } else {
      await $fetch('/api/articles', {
        method: 'POST',
        body: articleData
      })
      showMessage('Article ajouté avec succès !', 'success')
    }
    
    cancelEdit()
    
    // ✅ FORCE REFRESH après soumission
    await loadArticles()
    
  } catch (err) {
    console.error('❌ Erreur soumission:', err)
    const apiError = (err as any)?.response?._data?.statusMessage || 'Une erreur est survenue.'
    showMessage(apiError, 'error')
  } finally {
    isLoading.value = false
  }
}

const editArticle = (article: ArticleSelect) => {
  form.value = {
    titleArticle: article.titleArticle,
    TextArticle: article.TextArticle,
    AuthorArticle: article.AuthorArticle,
    CategoryArticle: article.CategoryArticle,
    ImageArticle: article.ImageArticle,
    TagsArticle: article.TagsArticle
  }
  editMode.value = true
  editId = article.id ?? null
}

const cancelEdit = () => {
  form.value = { 
    titleArticle: '',
    TextArticle: '',
    AuthorArticle: '',
    CategoryArticle: '',
    ImageArticle: '',
    TagsArticle: ''
  }
  editMode.value = false
  editId = null
}

const deleteArticleConfirm = async (id?: number) => {
  if (!id) {
    console.error('❌ ID invalide:', id)
    showMessage('ID invalide', 'error')
    return
  }
  
  console.log('🤔 Tentative suppression ID:', id)
  console.log('📋 Articles actuels:', articles.value.map(a => ({ id: a.id, titre: a.titleArticle })))
  
  if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
    try {
      isLoading.value = true
      
      console.log('🗑️ Envoi requête DELETE pour ID:', id)
      
      const response = await $fetch(`/api/articles/${id}`, {
        method: 'DELETE'
      })
      
      console.log('✅ Réponse serveur:', response)
      
      showMessage('Article supprimé avec succès !', 'success')
      
      // ✅ FORCE REFRESH après suppression
      console.log('🔄 Rechargement de la liste...')
      await loadArticles()
      
      console.log('✅ Liste rechargée, nouveaux articles:', articles.value.length)
      
    } catch (err: any) {
      console.error('❌ Erreur complète:', err)
      console.error('❌ Status:', err?.statusCode)
      console.error('❌ Message:', err?.data?.message || err?.message)
      
      const apiError = err?.data?.message || err?.message || 'Erreur lors de la suppression'
      showMessage(apiError, 'error')
    } finally {
      isLoading.value = false
    }
  } else {
    console.log('❌ Suppression annulée par l\'utilisateur')
  }
}

const viewArticle = (article: ArticleSelect) => {
  currentArticle.value = article
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  currentArticle.value = null
}

// Watcher pour le contenu de l'article dans la modale
watch(currentArticle, async (newArticle) => {
  if (newArticle?.TextArticle) {
    const result = await marked(newArticle.TextArticle)
    renderedMarkdown.value = result
  } else {
    renderedMarkdown.value = ''
  }
})

// Formatage des dates avec gestion stricte de null
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date || date === null) return ''
  
  try {
    const d = date instanceof Date ? date : new Date(date)
    
    // Vérifier que la date est valide
    if (isNaN(d.getTime())) return ''
    
    return d.toLocaleDateString('fr-CA', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  } catch {
    return ''
  }
}

// 🐛 FONCTION DEBUG : Force reload
const forceReload = async () => {
  console.log('🔴 FORCE RELOAD DÉCLENCHÉ')
  console.log('📋 Articles AVANT clear:', articles.value.length, articles.value)
  
  // Vider complètement
  articles.value = []
  
  console.log('📋 Articles APRÈS clear:', articles.value.length)
  
  // Recharger
  await loadArticles()
  
  console.log('📋 Articles APRÈS reload:', articles.value.length, articles.value)
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

/* Styles pour le rendu Markdown */
.prose {
  color: #374151;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  color: #111827;
}

.prose p {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.prose ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose pre {
  background-color: #f3f4f6;
  border-radius: 0.25rem;
  padding: 1rem;
  overflow-x: auto;
}

.prose code {
  color: #ef4444;
}

.dark .prose {
  color: #d1d5db;
}

.dark .prose h1, .dark .prose h2, .dark .prose h3, .dark .prose h4, .dark .prose h5, .dark .prose h6 {
  color: #e5e7eb;
}

.dark .prose a {
  color: #60a5fa;
}

.dark .prose pre {
  background-color: #1f2937;
}

.dark .prose code {
  color: #f87171;
}

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