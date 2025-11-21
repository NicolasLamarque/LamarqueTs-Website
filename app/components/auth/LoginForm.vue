
<template>
  <div class="flex items-center justify-center h-screen">
    <form @submit.prevent="handleLogin" class="w-full max-w-sm mx-auto p-4 bg-gray-800 dark:bg-gray-800 shadow rounded animate-fade-in">
      <h2 class="text-xl font-bold mb-4 text-center dark:text-gray-100 animate-fade-in">Connexion</h2>

      <div class="mb-4">
        <label for="username" class="block mb-1 font-medium text-gray-100">Nom d'utilisateur</label>
        <input
          id="username"
          type="text"
          v-model="username"
          required
          class="w-full px-3 py-2 border rounded"
          placeholder="Votre nom d'utilisateur"
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block mb-1 font-medium text-gray-100">Mot de passe</label>
        <div class="input-container">
          <input
            id="password"
            :type="passwordFieldType"
            v-model="password"
            required
            class="w-full px-3 py-2 border rounded"
            placeholder="Mot de passe"
          />
          <span @click="togglePasswordVisibility" class="toggle-icon">
            <svg v-if="passwordFieldType === 'password'" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 4.5C7 4.5 2.73 7.61 0 12c2.73 4.39 7 7.5 12 7.5s9.27-3.11 12-7.5C21.27 7.61 17 4.5 12 4.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C7 2 2.73 5.11 0 9.5 2.73 13.89 7 17 12 17s9.27-3.11 12-7.5C21.27 5.11 17 2 12 2zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
              <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2"/>
            </svg>
          </span>
        </div>
      </div>

      <div class="mb-4 flex justify-center">
        <button 
          type="submit"
          :disabled="isLoading"
          class="mt-6 w-1/2 bg-sky-500 text-white py-2 px-4 rounded-xl font-semibold hover:bg-sky-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </div>

      <div class="mb-4 text-red-400 text-center font-medium" v-if="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { navigateTo } from '#app'

interface LoginResponse {
  success: boolean
  user?: { 
    username: string
    role: string 
  }
}

const username = ref('')
const password = ref('')
const passwordVisible = ref(false)
const error = ref('')
const isLoading = ref(false)

const passwordFieldType = computed(() =>
  passwordVisible.value ? 'text' : 'password'
)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    const response = await $fetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { 
        username: username.value, 
        password: password.value 
      },
      credentials: 'include' // ✅ CRUCIAL : Permet d'envoyer/recevoir les cookies
    })

    if (response.success) {
      console.log('✅ Connexion réussie :', response.user)
      // Le cookie est automatiquement géré par le navigateur
      await navigateTo('/dashboard')
    } else {
      error.value = 'Erreur de connexion'
    }
    
  } catch (err: any) {
    console.error('❌ Erreur login:', err)
    
    // Gestion des erreurs propre
    if (err.data?.statusMessage) {
      error.value = err.data.statusMessage
    } else if (err.statusMessage) {
      error.value = err.statusMessage
    } else {
      error.value = 'Erreur de connexion. Veuillez réessayer.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.input-container {
  position: relative;
  width: 100%;
}

.input-container input {
  width: 100%;
  padding: 10px;
  padding-right: 40px;
}

.toggle-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
}

.toggle-icon:hover {
  color: #555;
}
</style>