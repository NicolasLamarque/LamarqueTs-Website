<template>
  <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
    <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
      <i class="fas fa-calendar-alt text-sky-500 mr-2"></i>Gestion des
      Utilisateurs
    </h2>

    <div
      v-if="message"
      :class="message.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
      class="text-white p-3 rounded-lg shadow-md mb-4 animate-fade-in"
    >
      {{ message.text }}
    </div>

    <form
      @submit.prevent="submitUser"
      class="mb-6 bg-white dark:bg-gray-700 p-4 rounded shadow"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="col-span-1">
          <label class="block font-medium mb-1">Nom d'utilisateur</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full px-3 py-2 border rounded"
            required
            :disabled="isLoading || isUploading"
          />
        </div>

        <div class="col-span-1">
          <label class="block font-medium mb-1">Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-3 py-2 border rounded"
            required
            :disabled="isLoading || isUploading"
          />
        </div>

        <div class="col-span-1">
          <label class="block font-medium mb-1">Email</label>
          <input
            v-model="form.mail"
            type="email"
            class="w-full px-3 py-2 border rounded"
            :disabled="isLoading || isUploading"
          />
        </div>

        <div class="col-span-1">
          <label class="block font-medium mb-1">Rôle</label>
          <select
            v-model="form.role"
            class="w-full px-3 py-2 border rounded"
            :disabled="isLoading || isUploading"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <div class="col-span-1 flex items-center">
          <label class="font-medium mr-2">Actif</label>
          <input
            v-model="form.is_active"
            type="checkbox"
            :disabled="isLoading || isUploading"
          />
        </div>

        <div class="col-span-1 md:col-span-2 lg:col-span-3">
          <label class="block font-medium mb-1">Bio</label>
          <textarea
            v-model="form.bio"
            class="w-full px-3 py-2 border rounded"
            :disabled="isLoading || isUploading"
          ></textarea>
        </div>

        <div class="col-span-1 md:col-span-2 lg:col-span-3">
          <label class="block font-medium mb-1">Photo de profil</label>
          
          <div v-if="form.profile_picture" class="mb-3">
            <img 
              :src="form.profile_picture" 
              alt="Aperçu de la photo de profil" 
              class="max-w-[150px] h-auto rounded-full shadow-md border-4 border-sky-500"
            />
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input 
                v-model="form.profile_picture" 
                type="text" 
                placeholder="OU collez l'URL de l'image"
                class="w-full px-3 py-2 border rounded" 
                :disabled="isLoading || isUploading" 
              />
            </div>
            
            <div class="relative">
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
                class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition flex items-center gap-2 w-full sm:w-auto justify-center"
                :disabled="isLoading || isUploading"
              >
                <svg v-if="!isUploading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isUploading ? 'Upload...' : 'Uploader une photo' }}
              </button>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Uploadez une image (max 5MB) ou collez une URL existante
          </p>
        </div>

        <div class="col-span-1 flex items-center">
          <label class="font-medium mr-2">2FA Activé</label>
          <input
            v-model="form.two_factor_enabled"
            type="checkbox"
            :disabled="isLoading || isUploading"
          />
        </div>

        <div class="col-span-1 md:col-span-2 lg:col-span-3">
          <label class="block font-medium mb-1">Préférences (JSON)</label>
          <textarea
            v-model="form.preferences"
            class="w-full px-3 py-2 border rounded"
            :disabled="isLoading || isUploading"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-between mt-4">
        <button
          class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition"
          :disabled="isLoading || isUploading"
        >
          {{ isLoading || isUploading ? "Chargement..." : editMode ? "Modifier" : "Ajouter" }}
        </button>
        <button
          v-if="editMode"
          type="button"
          @click="cancelEdit"
          class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          :disabled="isLoading || isUploading"
        >
          Annuler
        </button>
      </div>
    </form>

    <div class="bg-white dark:bg-gray-700 p-4 rounded shadow">
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-200 dark:bg-gray-600">
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Nom</th>
            <th class="px-4 py-2 text-left">Email</th>
            <th class="px-4 py-2 text-left">Rôle</th>
            <th class="px-4 py-2 text-left">Actif</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in users"
            :key="u.id"
            class="border-b border-gray-300 dark:border-gray-600"
          >
            <td class="px-4 py-2">{{ u.id }}</td>
            <td class="px-4 py-2">{{ u.username }}</td>
            <td class="px-4 py-2">{{ u.mail }}</td>
            <td class="px-4 py-2">{{ u.role }}</td>
            <td class="px-4 py-2">
              <span v-if="u.is_active" class="text-green-500">✅</span>
              <span v-else class="text-red-500">❌</span>
            </td>
            <td class="px-4 py-2 flex gap-2 justify-center">
              <button
                @click="editUser(u)"
                class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Modifier
              </button>
              <button
                @click="viewUser(u)"
                class="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
              >
                Voir
              </button>
              <button
                @click="deleteUserConfirm(u.id)"
                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="6" class="text-center py-2 text-gray-500">
              Aucun utilisateur
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div class="relative p-8 border w-3/4 max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-700">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Profil de {{ currentUser?.username }}
          </h3>
          <div class="flex flex-col items-center mt-4">
            <img
              v-if="currentUser?.profile_picture"
              :src="currentUser.profile_picture"
              alt="Photo de profil"
              class="w-32 h-32 object-cover rounded-full shadow-lg mb-4 border-4 border-sky-500"
            />
            <p v-else class="text-gray-500 dark:text-gray-400 mb-4">Pas de photo de profil</p>

            <p class="text-sm text-gray-500 dark:text-gray-300">
              **Email:** {{ currentUser?.mail }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-300">
              **Rôle:** {{ currentUser?.role }} ({{ currentUser?.is_active ? 'Actif' : 'Inactif' }})
            </p>
            
            <div class="mt-4 px-3 py-3 w-full border-t border-gray-200 dark:border-gray-600">
              <p class="font-semibold text-gray-900 dark:text-white mb-1">Bio:</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 italic">{{ currentUser?.bio || 'Pas de biographie.' }}</p>
            </div>
            
          </div>
          
          <div class="items-center px-4 py-3 mt-4 border-t border-gray-200 dark:border-gray-600">
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
import { ref, onMounted } from 'vue'

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

  // Vérifier la taille du fichier (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showMessage('L\'image est trop grande (max 5MB)', 'error')
    return
  }

  try {
    isUploading.value = true
    
    const formData = new FormData()
    formData.append('file', file)

    // L'endpoint est le même que pour les articles
    const response = await $fetch<{ success: boolean; url: string }>('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      form.value.profile_picture = response.url // Mise à jour du champ de la photo de profil
      showMessage('Photo de profil uploadée avec succès !', 'success')
    }
    
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
      profile_picture: form.value.profile_picture,
      two_factor_enabled: form.value.two_factor_enabled,
      preferences: form.value.preferences
    }

    if (editMode.value && editId !== null) {
      if (form.value.password) {
        userData.password = form.value.password
      }

      await $fetch(`/api/users/${editId}`, {
        method: 'PUT',
        body: userData
      })
      showMessage('Utilisateur modifié avec succès !', 'success')
    } else {
      userData.password = form.value.password

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