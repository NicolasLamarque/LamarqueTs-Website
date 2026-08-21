<template>
  <div class="p-4 sm:p-6 space-y-5">

    <!-- ================= En-tête ================= -->
    <div>
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
        Utilisateurs
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Comptes ayant accès au tableau de bord
      </p>
    </div>

    <!-- Message de confirmation ou d'erreur -->
    <p
      v-if="message"
      class="px-4 py-3 rounded-lg text-sm border"
      :class="message.type === 'success'
        ? 'bg-green-50 dark:bg-green-900/25 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
        : 'bg-red-50 dark:bg-red-900/25 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'"
    >
      {{ message.text }}
    </p>

    <!-- ================= Formulaire ================= -->
    <!--
      La bordure gauche et le titre changent selon le mode. C'est le seul
      repère qui manquait : rien n'indiquait qu'on était passé en modification,
      sinon le libellé du bouton, tout en bas et hors de vue.
    -->
    <form
      @submit.prevent="submitUser"
      class="bg-white dark:bg-gray-800 rounded-xl border shadow-sm border-l-4 transition-colors"
      :class="editMode
        ? 'border-gray-200 dark:border-gray-700 border-l-sky-600 dark:border-l-sky-500'
        : 'border-gray-200 dark:border-gray-700 border-l-gray-300 dark:border-l-gray-600'"
    >
      <!-- Bandeau de mode -->
      <div class="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="font-semibold text-gray-800 dark:text-gray-100">
            <template v-if="editMode">
              Modification de <span class="text-sky-700 dark:text-sky-400">{{ form.username }}</span>
            </template>
            <template v-else>Nouvel utilisateur</template>
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ editMode
              ? 'Les champs laissés vides ne seront pas modifiés.'
              : 'Tous les champs obligatoires sont marqués d\'un astérisque.' }}
          </p>
        </div>

        <button
          v-if="editMode"
          type="button"
          @click="cancelEdit"
          class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-2"
        >
          Annuler la modification
        </button>
      </div>

      <div class="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <!-- Nom d'utilisateur -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Nom d'utilisateur <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.username"
            type="text"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition disabled:opacity-50"
            required
            :disabled="isLoading || isUploading"
          />
        </div>

        <!-- Mot de passe -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Mot de passe
            <span v-if="!editMode" class="text-rose-500">*</span>
            <span v-else class="font-normal text-xs text-gray-500 dark:text-gray-400">
              — laisser vide pour le conserver
            </span>
          </label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="motDePasseVisible ? 'text' : 'password'"
              class="w-full px-3 py-2 pr-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition disabled:opacity-50"
              :required="!editMode"
              :disabled="isLoading || isUploading"
              autocomplete="new-password"
            />
            <button
              type="button"
              @click="motDePasseVisible = !motDePasseVisible"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              :aria-label="motDePasseVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            >
              <svg v-if="!motDePasseVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Courriel -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Courriel
          </label>
          <input
            v-model="form.mail"
            type="email"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition disabled:opacity-50"
            :disabled="isLoading || isUploading"
          />
        </div>

        <!-- Rôle -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Rôle
          </label>
          <select
            v-model="form.role"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition disabled:opacity-50"
            :disabled="isLoading || isUploading"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <!-- Cases à cocher -->
        <div class="flex items-center gap-6 md:col-span-2 lg:col-span-2">
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              v-model="form.is_active"
              type="checkbox"
              class="rounded border-gray-300 dark:border-gray-600 text-sky-600 focus:ring-sky-500"
              :disabled="isLoading || isUploading"
            />
            Compte actif
          </label>

          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              v-model="form.two_factor_enabled"
              type="checkbox"
              class="rounded border-gray-300 dark:border-gray-600 text-sky-600 focus:ring-sky-500"
              :disabled="isLoading || isUploading"
            />
            Double authentification
          </label>
        </div>

        <!-- Photo de profil -->
        <div class="md:col-span-2 lg:col-span-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Photo de profil
          </label>

          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <!-- Aperçu, ou emplacement vide de meme taille pour eviter que la
                 mise en page ne saute quand une photo apparait. -->
            <div class="flex-shrink-0">
              <img
                v-if="form.profile_picture"
                :src="form.profile_picture"
                alt="Aperçu de la photo de profil"
                class="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              <div
                v-else
                class="w-16 h-16 rounded-full border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs"
              >
                aucune
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <input
                v-model="form.profile_picture"
                type="text"
                placeholder="Collez une URL d'image, ou téléversez un fichier"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition disabled:opacity-50"
                :disabled="isLoading || isUploading"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                L'image est compressée automatiquement avant l'envoi.
              </p>
            </div>

            <div class="flex-shrink-0">
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
                @click="fileInput.click()"
                class="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                :disabled="isLoading || isUploading"
              >
                <svg v-if="isUploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ isUploading ? 'Envoi…' : 'Téléverser' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Bio -->
        <div class="md:col-span-2 lg:col-span-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Biographie
          </label>
          <textarea
            v-model="form.bio"
            rows="2"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition resize-y disabled:opacity-50"
            :disabled="isLoading || isUploading"
          ></textarea>
        </div>

        <!-- Préférences -->
        <div class="md:col-span-2 lg:col-span-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Préférences
            <span class="font-normal text-xs text-gray-500 dark:text-gray-400">— format JSON</span>
          </label>
          <textarea
            v-model="form.preferences"
            rows="2"
            class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition resize-y disabled:opacity-50"
            :disabled="isLoading || isUploading"
          ></textarea>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          class="px-5 py-2 rounded-lg text-sm font-semibold bg-sky-700 hover:bg-sky-600 text-white shadow-sm transition-colors disabled:opacity-50"
          :disabled="isLoading || isUploading"
        >
          {{ isLoading || isUploading ? 'Enregistrement…' : editMode ? 'Enregistrer les modifications' : 'Créer le compte' }}
        </button>

        <button
          v-if="editMode"
          type="button"
          @click="cancelEdit"
          class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :disabled="isLoading || isUploading"
        >
          Annuler
        </button>
      </div>
    </form>

    <!-- ================= Liste ================= -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
      <table class="w-full text-sm min-w-[640px]">
        <thead>
          <tr class="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <th class="px-4 py-3 font-semibold">Compte</th>
            <th class="px-4 py-3 font-semibold">Courriel</th>
            <th class="px-4 py-3 font-semibold">Rôle</th>
            <th class="px-4 py-3 font-semibold">État</th>
            <th class="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="users.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              Aucun utilisateur.
            </td>
          </tr>

          <tr
            v-for="u in users"
            :key="u.id"
            class="border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
            :class="editMode && form.username === u.username ? 'bg-sky-50 dark:bg-sky-900/20' : ''"
          >
            <!-- Compte : avatar + nom, pour reconnaitre la ligne d'un coup d'oeil -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img
                  v-if="u.profile_picture"
                  :src="u.profile_picture"
                  :alt="'Photo de ' + u.username"
                  class="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600 flex-shrink-0"
                />
                <div
                  v-else
                  class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0"
                >
                  {{ (u.username || '?').charAt(0).toUpperCase() }}
                </div>
                <div class="min-w-0">
                  <p class="font-medium text-gray-800 dark:text-gray-100 truncate">{{ u.username }}</p>
                  <p class="text-xs text-gray-400 tabular-nums">#{{ u.id }}</p>
                </div>
              </div>
            </td>

            <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ u.mail || '—' }}</td>

            <td class="px-4 py-3">
              <span
                class="text-xs font-medium px-2 py-0.5 rounded"
                :class="u.role === 'admin'
                  ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
              >
                {{ u.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
              </span>
            </td>

            <td class="px-4 py-3">
              <span :class="u.is_active ? 'text-green-700 dark:text-green-400' : 'text-gray-400'">
                {{ u.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </td>

            <!-- Actions : la suppression est mise a distance des deux autres,
                 pour ne pas etre cliquee par reflexe. -->
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-1">
                <button
                  @click="editUser(u)"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                >
                  Modifier
                </button>
                <button
                  @click="viewUser(u)"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Voir
                </button>
                <button
                  @click="deleteUserConfirm(u.id)"
                  class="ml-3 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================= Fiche de consultation ================= -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeModal"
    >
      <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-800 dark:text-gray-100">
            {{ currentUser?.username }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Consultation — aucune modification possible ici</p>
        </div>

        <div class="p-5 space-y-4">
          <div class="flex items-center gap-4">
            <img
              v-if="currentUser?.profile_picture"
              :src="currentUser.profile_picture"
              :alt="'Photo de ' + currentUser?.username"
              class="w-20 h-20 rounded-full object-cover border border-gray-300 dark:border-gray-600 flex-shrink-0"
            />
            <div
              v-else
              class="w-20 h-20 rounded-full border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs text-gray-400 flex-shrink-0"
            >
              aucune photo
            </div>

            <dl class="text-sm space-y-1 min-w-0">
              <div class="flex gap-2">
                <dt class="text-gray-500 dark:text-gray-400">Courriel</dt>
                <dd class="text-gray-800 dark:text-gray-100 truncate">{{ currentUser?.mail || '—' }}</dd>
              </div>
              <div class="flex gap-2">
                <dt class="text-gray-500 dark:text-gray-400">Rôle</dt>
                <dd class="text-gray-800 dark:text-gray-100">
                  {{ currentUser?.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
                </dd>
              </div>
              <div class="flex gap-2">
                <dt class="text-gray-500 dark:text-gray-400">État</dt>
                <dd :class="currentUser?.is_active ? 'text-green-700 dark:text-green-400' : 'text-gray-400'">
                  {{ currentUser?.is_active ? 'Actif' : 'Inactif' }}
                </dd>
              </div>
            </dl>
          </div>

          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Biographie</p>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              {{ currentUser?.bio || 'Aucune biographie.' }}
            </p>
          </div>
        </div>

        <div class="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            @click="closeModal"
            class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Téléversement d'images : compresse la photo dans le navigateur avant
// de l'envoyer, pour ne pas stocker des fichiers de plusieurs Mo.
const { televerserImage, formaterPoids } = useImageUpload()

interface User {
  id: number
  username: string
  mail: string
  role: string
  is_active: boolean
  bio: string
  profile_picture: string
  two_factor_enabled: boolean
  preferences: string
}


interface Message {
  text: string
  type: 'success' | 'error'
}

const users = ref<User[]>([])
const form = ref<{
  username: string;
  password: string;
  mail: string;
  role: string;
  is_active: boolean;
  bio: string;
  profile_picture: string;
  two_factor_enabled: boolean;
  preferences: string;
}>({
  username: '',
  password: '',
  mail: '',
  role: 'user',
  is_active: true,
  bio: '',
  profile_picture: '',
  two_factor_enabled: false,
  preferences: ''
})
const editMode = ref(false)
const isLoading = ref(false)
const isUploading = ref(false) // NOUVEAU

// Affichage en clair du mot de passe pendant la saisie.
const motDePasseVisible = ref(false)
const fileInput = ref<HTMLInputElement | null>(null) // NOUVEAU
let editId: number | null = null
const message = ref<Message | null>(null)

// NOUVEAU pour la modale
const showModal = ref(false)
const currentUser = ref<User | null>(null)


const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = null
  }, 3000)
}

// Fonction pour uploader l'image vers Vercel BLOB (Adaptée de ArticlesDash.vue)
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  // Garde-fou : au-delà de 25 Mo ce n'est plus une photo mais sans doute
  // une erreur de fichier. On refuse avant même de charger l'image.
  if (file.size > 25 * 1024 * 1024) {
    showMessage('Ce fichier est trop volumineux (max 25 Mo)', 'error')
    return
  }

  try {
    isUploading.value = true

    const poidsAvant = file.size

    // Compression avant envoi. Une photo de profil n'est jamais affichée
    // en grand : on la plafonne à 512 px, ce qui suffit largement pour un
    // avatar et réduit le poids stocké à quelques dizaines de Ko.
    const url = await televerserImage(file, { dimensionMax: 512 })

    form.value.profile_picture = url

    showMessage(`Photo envoyée (${formaterPoids(poidsAvant)} à l'origine)`, 'success')

  } catch (error: any) {
    console.error('Erreur upload:', error)
    showMessage(error.data?.message || 'Erreur lors de l\'upload de la photo de profil', 'error')
  } finally {
    isUploading.value = false
    // Réinitialiser l'input pour permettre le même fichier
    if (target) target.value = ''
  }
}

const loadUsers = async () => {
  try {
    isLoading.value = true
    const data = await $fetch<User[]>('/api/users')
    users.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
    showMessage('Erreur lors du chargement des utilisateurs.', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadUsers)

const submitUser = async () => {
  try {
    isLoading.value = true

    const userData: Partial<User> & { password?: string } = {
      username: form.value.username,
      mail: form.value.mail,
      role: form.value.role,
      is_active: form.value.is_active,
      bio: form.value.bio,
      two_factor_enabled: form.value.two_factor_enabled,
      preferences: form.value.preferences
    }

    if (editMode.value && editId !== null) {
      // En modification, un champ laisse vide signifie « ne pas y toucher »,
      // jamais « effacer ».
      //
      // Le mot de passe suivait deja cette regle ; la photo de profil, non :
      // elle partait meme vide, ce qui effacait la photo existante des qu'on
      // modifiait autre chose. Et depuis que la suppression des orphelins est
      // automatique, cela aurait detruit le fichier lui-meme.
      if (form.value.password) {
        userData.password = form.value.password
      }
      if (form.value.profile_picture) {
        userData.profile_picture = form.value.profile_picture
      }

      await $fetch(`/api/users/${editId}`, {
        method: 'PUT',
        body: userData
      })
      showMessage('Utilisateur modifié avec succès !', 'success')
    } else {
      // A la creation, rien a preserver : on envoie les valeurs telles quelles.
      userData.password = form.value.password
      userData.profile_picture = form.value.profile_picture

      await $fetch('/api/users', {
        method: 'POST',
        body: userData
      })
      showMessage('Utilisateur ajouté avec succès !', 'success')
    }
    
    await loadUsers()
    cancelEdit()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l’utilisateur:', error)
    showMessage('Erreur lors de la sauvegarde de l’utilisateur.', 'error')
  } finally {
    isLoading.value = false
  }
}


const editUser = (user: User) => {
  form.value = {
    username: user.username,
    password: '',
    mail: user.mail || '',
    role: user.role || 'user',
    is_active: !!user.is_active,
    bio: user.bio || '',
    profile_picture: user.profile_picture || '',
    two_factor_enabled: !!user.two_factor_enabled,
    preferences: user.preferences || ''
  }
  editMode.value = true
  editId = user.id
}

const cancelEdit = () => {
  form.value = {
    username: '',
    password: '',
    mail: '',
    role: 'user',
    is_active: true,
    bio: '',
    profile_picture: '',
    two_factor_enabled: false,
    preferences: ''
  }
  editMode.value = false
  editId = null
}

const deleteUserConfirm = async (id: number) => {
  if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
    try {
      isLoading.value = true
      await $fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })
      showMessage('Utilisateur supprimé avec succès !', 'success')
      await loadUsers()
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err)
      const apiError = (err as any)?.response?._data?.statusMessage || 'Une erreur est survenue.'
      showMessage(apiError, 'error')
    } finally {
      isLoading.value = false
    }
  }
}

// NOUVEAU: Fonctions pour la modale de visualisation
const viewUser = (user: User) => {
  currentUser.value = user
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  currentUser.value = null
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
</style>