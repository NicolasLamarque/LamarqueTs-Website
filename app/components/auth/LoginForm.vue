
<template>
  <div class="flex items-center justify-center h-screen">
    <form @submit.prevent="handleLogin" class="w-full max-w-sm mx-auto p-4 bg-gray-800 dark:bg-gray-800 shadow rounded animate-fade-in">
      <h2 class="text-xl font-bold mb-4 text-center dark:text-gray-100 animate-fade-in">Connexion</h2>

      <div class="mb-4">
        <label for="username" class="block mb-1 font-medium">Nom d'utilisateur</label>
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
        <label for="password" class="block mb-1 font-medium">Mot de passe</label>
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
              <path d="M12 4.5C7 4.5 2.73 7.61 0 12c2.73 4.39 7 7.5 12 7.5s9.27-3.11 12-7.5C21.27 7.61 17 4.5 12 4.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor"/>
            </svg>
          </span>
        </div>
      </div>

      <div class="mb-4 flex justify-center">
        <button type="submit"
          class="mt-6 w-1/2 bg-sky-500 text-white py-2 px-4 rounded-xl font-semibold hover:bg-sky-600 transition-colors duration-300">
          {{ buttonText }}
        </button>
      </div>

      <div class="mb-4 text-red-500" v-if="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCookie, navigateTo } from '#app'

interface LoginResponse {
  token?: string
  error?: string
}

const username = ref('')
const password = ref('')
const passwordVisible = ref(false)
const error = ref('')

const passwordFieldType = computed(() =>
  passwordVisible.value ? 'text' : 'password'
)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const buttonText = 'Se connecter'

const handleLogin = async () => {
  error.value = ''
  try {
    const response = await $fetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })

    if (response.token) {
      console.log('Token reçu:', response.token)
      useCookie('auth_token').value = response.token
      // S'assurer que la redirection se fait dans un contexte sécurisé
      if (process.client) {
        await navigateTo('/dashboard', { external: true })
      } else {
        // Fallback pour la navigation côté serveur si nécessaire
        await navigateTo('/dashboard')
      }
    } else {
      error.value = response.error || 'Nom d’utilisateur ou mot de passe incorrect'
    }
  } catch (err) {
    console.error('Erreur handleLogin:', err)
    error.value = 'Erreur de connexion. Veuillez réessayer.'
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
</style>
