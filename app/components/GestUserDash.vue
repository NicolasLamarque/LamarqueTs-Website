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
            :disabled="isLoading"
          />
        </div>

        <div class="col-span-1">
          <label class="block font-medium mb-1">Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-3 py-2 border rounded"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="col-span-1">
          <label class="block font-medium mb-1">Email</label>
          <input
            v-model="form.mail"
            type="email"
            class="w-full px-3 py-2 border rounded"
            :disabled="isLoading"
          />
        </div>

        <div class="col-span-1">
          <label class="block font-medium mb-1">Rôle</label>
          <select
            v-model="form.role"
            class="w-full px-3 py-2 border rounded"
            :disabled="isLoading"
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
            :disabled="isLoading"
          />
        </div>

        <div class="col-span-1 md:col-span-2 lg:col-span-3">
          <label class="block font-medium mb-1">Bio</label>
          <textarea
            v-model="form.bio"
            class="w-full px-3 py-2 border rounded"
            :disabled="isLoading"
          ></textarea>
        </div>

        <div class="col-span-1 md:col-span-2 lg:col-span-3">
          <label class="block font-medium mb-1">Photo de profil (URL)</label>
          <input
            v-model="form.profile_picture"
            type="text"
            class="w-full px-3 py-2 border rounded"
            :disabled="isLoading"
          />
        </div>

        <div class="col-span-1 flex items-center">
          <label class="font-medium mr-2">2FA Activé</label>
          <input
            v-model="form.two_factor_enabled"
            type="checkbox"
            :disabled="isLoading"
          />
        </div>

        <div class="col-span-1 md:col-span-2 lg:col-span-3">
          <label class="block font-medium mb-1">Préférences (JSON)</label>
          <textarea
            v-model="form.preferences"
            class="w-full px-3 py-2 border rounded"
            :disabled="isLoading"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-between mt-4">
        <button
          class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition"
          :disabled="isLoading"
        >
          {{ isLoading ? "Chargement..." : editMode ? "Modifier" : "Ajouter" }}
        </button>
        <button
          v-if="editMode"
          type="button"
          @click="cancelEdit"
          class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          :disabled="isLoading"
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
let editId: number | null = null
const message = ref<Message | null>(null)

const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = null
  }, 3000)
}

const loadUsers = async () => {
  try {
    isLoading.value = true
    const data = await $fetch<User[]>('/api/users')   // chargement des utilisateurs dans un tableau
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
