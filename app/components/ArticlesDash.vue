<template>
  <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Gestion des Articles</h2>
    </div>

    <div v-if="message" :class="message.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
      class="text-white p-3 rounded-lg shadow-md mb-4 animate-fade-in">
      {{ message.text }}
    </div>

    <form @submit.prevent="submitArticle" class="mb-6 bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden">
      
      <div class="bg-gradient-to-r from-sky-600 to-sky-700 p-4 text-white">
        <h3 class="text-lg font-bold flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          {{ editMode ? 'Modifier l\'article' : 'Nouvel article' }}
        </h3>
      </div>

      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-medium mb-2 text-gray-700 dark:text-gray-200">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                Titre de l'article *
              </span>
            </label>
            <input 
              v-model="form.titleArticle" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-800 dark:text-white" 
              placeholder="Ex: Les bienfaits de la méditation"
              required 
              :disabled="isLoading" 
            />
          </div>

          <div>
            <label class="block font-medium mb-2 text-gray-700 dark:text-gray-200">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Auteur *
              </span>
            </label>
            <input 
              v-model="form.AuthorArticle" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-800 dark:text-white" 
              placeholder="Nom de l'auteur"
              required 
              :disabled="isLoading" 
            />
          </div>

          <div>
            <label class="block font-medium mb-2 text-gray-700 dark:text-gray-200">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Catégorie
              </span>
            </label>
            <input 
              v-model="form.CategoryArticle" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-800 dark:text-white" 
              placeholder="Ex: Santé mentale"
              :disabled="isLoading" 
            />
          </div>

          <div>
            <label class="block font-medium mb-2 text-gray-700 dark:text-gray-200">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                </svg>
                Tags
              </span>
            </label>
            <input 
              v-model="form.TagsArticle" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent dark:bg-gray-800 dark:text-white" 
              placeholder="méditation, bien-être, santé"
              :disabled="isLoading" 
            />
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <label class="block font-medium mb-3 text-gray-700 dark:text-gray-200">
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Image de l'article
            </span>
          </label>
          
          <div v-if="form.ImageArticle" class="mb-4 relative group">
            <img 
              :src="form.ImageArticle" 
              alt="Aperçu" 
              class="max-w-full h-64 object-cover rounded-lg shadow-lg mx-auto"
            />
            <button
              type="button"
              @click="form.ImageArticle = ''"
              class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="flex flex-col gap-3">
            <input 
              v-model="form.ImageArticle" 
              type="text" 
              placeholder="Collez l'URL de l'image"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white" 
              :disabled="isLoading || isUploading" 
            />
            
            <div class="flex items-center gap-3">
              <div class="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              <span class="text-sm text-gray-500 dark:text-gray-400">OU</span>
              <div class="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="hidden"
              :disabled="isLoading || isUploading"
            />
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition flex items-center justify-center gap-2 font-medium shadow-lg"
              :disabled="isLoading || isUploading"
            >
              <svg v-if="!isUploading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isUploading ? 'Upload en cours...' : 'Uploader une image' }}
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <div class="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2">
            <div class="flex items-center justify-between mb-2">
              <label class="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Contenu de l'article (Markdown) *
              </label>
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="showPreview = !showPreview"
                  class="px-3 py-1 text-sm rounded bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800 transition"
                >
                  {{ showPreview ? '📝 Édition' : '👁️ Aperçu' }}
                </button>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-1">
              <button type="button" @click="insertMarkdown('# ', '')" class="toolbar-btn" title="Titre 1">
                <span class="font-bold">H1</span>
              </button>
              <button type="button" @click="insertMarkdown('## ', '')" class="toolbar-btn" title="Titre 2">
                <span class="font-bold">H2</span>
              </button>
              <button type="button" @click="insertMarkdown('### ', '')" class="toolbar-btn" title="Titre 3">
                <span class="font-bold">H3</span>
              </button>
              <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button type="button" @click="insertMarkdown('**', '**')" class="toolbar-btn" title="Gras">
                <span class="font-bold">B</span>
              </button>
              <button type="button" @click="insertMarkdown('*', '*')" class="toolbar-btn" title="Italique">
                <span class="italic">I</span>
              </button>
              <button type="button" @click="insertMarkdown('~~', '~~')" class="toolbar-btn" title="Barré">
                <span class="line-through">S</span>
              </button>
              <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button type="button" @click="insertMarkdown('- ', '')" class="toolbar-btn" title="Liste à puces">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <button type="button" @click="insertMarkdown('1. ', '')" class="toolbar-btn" title="Liste numérotée">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </button>
              <button type="button" @click="insertMarkdown('> ', '')" class="toolbar-btn" title="Citation">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </button>
              <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button type="button" @click="insertMarkdown('[', '](url)')" class="toolbar-btn" title="Lien">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
              </button>
              <button type="button" @click="insertMarkdown('`', '`')" class="toolbar-btn" title="Code inline">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </button>
              <button type="button" @click="insertMarkdown('```\n', '\n```')" class="toolbar-btn" title="Bloc de code">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button type="button" @click="insertMarkdown('---\n', '')" class="toolbar-btn" title="Ligne horizontale">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="relative">
            <textarea 
              v-show="!showPreview"
              ref="textareaRef"
              v-model="form.TextArticle" 
              class="w-full px-4 py-3 border-0 focus:ring-0 dark:bg-gray-800 dark:text-white font-mono text-sm resize-none"
              style="min-height: 400px;"
              placeholder="Rédigez votre article en Markdown...

Exemples:
# Titre principal
## Sous-titre
**Texte en gras**
*Texte en italique*
- Liste à puces
1. Liste numérotée
> Citation
[Lien](https://exemple.com)"
              required 
              :disabled="isLoading"
            ></textarea>

            <div 
              v-show="showPreview"
              class="prose dark:prose-invert max-w-none p-4 markdown-content"
              style="min-height: 400px;"
              v-html="previewContent"
            ></div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center border-t border-gray-300 dark:border-gray-600">
            <span>{{ wordCount }} mots • {{ charCount }} caractères</span>
            <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" class="text-sky-600 dark:text-sky-400 hover:underline">
              📖 Guide Markdown
            </a>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
          <button 
            type="submit"
            class="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-8 py-3 rounded-lg hover:from-sky-700 hover:to-sky-800 transition font-semibold shadow-lg flex items-center gap-2" 
            :disabled="isLoading || isUploading"
          >
            <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Enregistrement...' : (editMode ? 'Enregistrer les modifications' : 'Publier l\'article') }}
          </button>
          
          <button 
            v-if="editMode" 
            type="button" 
            @click="cancelEdit" 
            class="bg-gray-400 dark:bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 dark:hover:bg-gray-700 transition font-semibold" 
            :disabled="isLoading"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>

    <div class="bg-white dark:bg-gray-700 p-4 rounded shadow">
      <div v-if="isLoading" class="text-center py-8">
        <svg class="animate-spin h-8 w-8 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
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
          <img
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
import { ref, onMounted, watch, computed, nextTick } from 'vue' // <-- Correction: ajout de computed et nextTick
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
const isUploading = ref(false)
const showPreview = ref(false) // <-- Ajout de l'état de prévisualisation
let editId: number | null = null
const message = ref<Message | null>(null)
const showModal = ref(false)
const currentArticle = ref<ArticleSelect | null>(null)
const renderedMarkdown = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null) // <-- Ajout de la référence au textarea

// Compteurs (computed)
const wordCount = computed(() => {
  return form.value.TextArticle?.trim().split(/\s+/).filter(w => w.length > 0).length || 0
})

const charCount = computed(() => {
  return form.value.TextArticle?.length || 0
})

// Prévisualisation en temps réel (computed)
const previewContent = computed(() => {
  if (!form.value.TextArticle) return '<p class="text-gray-400 italic">Aucun contenu à prévisualiser...</p>'
  return marked(form.value.TextArticle)
})

// Fonction pour insérer du Markdown (nouvelle fonction)
const insertMarkdown = (before: string, after: string) => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.value.TextArticle || ''
  const selectedText = text.substring(start, end)

  // Si du texte est sélectionné, on l'entoure
  const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
  form.value.TextArticle = newText

  // Repositionner le curseur
  nextTick(() => {
    if (selectedText) {
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = end + before.length
    } else {
      const cursorPos = start + before.length
      textarea.selectionStart = cursorPos
      textarea.selectionEnd = cursorPos
    }
    textarea.focus()
  })
}


const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = null
  }, 3000)
}

// Fonction pour uploader l'image vers Vercel BLOB
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Vérifier la taille du fichier (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showMessage('L\'image est trop grande (max 5MB)', 'error')
    return
  }

  try {
    isUploading.value = true
    
    const formData = new FormData()
    formData.append('file', file)

    // Utilisation de $fetch de Nuxt pour l'appel API
    const response = await $fetch<{ success: boolean; url: string }>('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      form.value.ImageArticle = response.url
      showMessage('Image uploadée avec succès !', 'success')
    }
    
  } catch (error: any) {
    console.error('Erreur upload:', error)
    showMessage(error.data?.message || 'Erreur lors de l\'upload de l\'image', 'error')
  } finally {
    isUploading.value = false
    // Réinitialiser l'input pour permettre le même fichier
    if (target) target.value = ''
  }
}

const loadArticles = async () => {
  try {
    isLoading.value = true
    
    // Utilisation de $fetch de Nuxt pour l'appel API
    const data = await $fetch<ArticleSelect[]>('/api/articles', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    articles.value = data
    
  } catch (error) {
    console.error('Erreur chargement articles:', error)
    showMessage('Erreur lors du chargement des articles.', 'error')
  } finally {
    isLoading.value = false
  }
}

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
      // Utilisation de $fetch de Nuxt pour l'appel API
      await $fetch(`/api/articles/${editId}`, {
        method: 'PUT',
        body: articleData
      })
      showMessage('Article modifié avec succès !', 'success')
    } else {
      // Utilisation de $fetch de Nuxt pour l'appel API
      await $fetch('/api/articles', {
        method: 'POST',
        body: articleData
      })
      showMessage('Article ajouté avec succès !', 'success')
    }
    
    cancelEdit()
    await loadArticles()
    
  } catch (err) {
    console.error('Erreur soumission:', err)
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
  showPreview.value = false // Revenir à l'édition lors de la modification
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
  showPreview.value = false // Réinitialiser la prévisualisation
}

const deleteArticleConfirm = async (id?: number) => {
  if (!id) {
    showMessage('ID invalide', 'error')
    return
  }
  
  if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
    try {
      isLoading.value = true
      
      // Utilisation de $fetch de Nuxt pour l'appel API
      await $fetch(`/api/articles/${id}`, {
        method: 'DELETE'
      })
      
      showMessage('Article supprimé avec succès !', 'success')
      await loadArticles()
      
    } catch (err: any) {
      console.error('Erreur suppression:', err)
      const apiError = err?.data?.message || err?.message || 'Erreur lors de la suppression'
      showMessage(apiError, 'error')
    } finally {
      isLoading.value = false
    }
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

// Formatage des dates
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date || date === null) return ''
  
  try {
    const d = date instanceof Date ? date : new Date(date)
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
</script>

<style scoped>
/* Les styles sont inchangés, j'ajoute juste les styles pour les boutons de la toolbar */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

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

.toolbar-btn {
  @apply p-2 rounded text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition;
}
</style>