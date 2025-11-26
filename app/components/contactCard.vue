<template>
  <div class="w-full max-w-4xl mx-auto">
    <!-- En-tête -->
    <div class="text-center mb-8 sm:mb-12">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-3 sm:mb-4">
        Contactez-moi
      </h1>
      <p class="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-2">
        Je suis là pour vous écouter et vous accompagner. N'hésitez pas à me contacter pour toute question ou pour prendre rendez-vous.
      </p>
    </div>

    <!-- Carte du formulaire -->
    <div class="bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-8 md:p-10 border border-gray-700">
      <form @submit.prevent="handleSubmit" class="space-y-5 sm:space-y-6">
        <!-- Nom complet -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
            Nom complet <span class="text-rose-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none text-sm sm:text-base"
            placeholder="Votre nom"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Adresse courriel <span class="text-rose-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none text-sm sm:text-base"
            placeholder="votre@email.com"
          />
        </div>

        <!-- Téléphone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">
            Téléphone <span class="text-gray-500 text-xs">(optionnel)</span>
          </label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            class="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none text-sm sm:text-base"
            placeholder="(819) 123-4567"
          />
        </div>

        <!-- Sujet -->
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-300 mb-2">
            Sujet <span class="text-rose-400">*</span>
          </label>
          <select
            id="subject"
            v-model="formData.subject"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none text-sm sm:text-base"
          >
            <option value="">Sélectionnez un sujet</option>
            <option value="accompagnement">Accompagnement individuel</option>
            <option value="mandat">Homologation de mandat</option>
            <option value="groupe">Groupes thérapeutiques</option>
            <option value="information">Demande d'information</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-300 mb-2">
            Message <span class="text-rose-400">*</span>
          </label>
          <textarea
            id="message"
            v-model="formData.message"
            required
            rows="6"
            class="w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all outline-none resize-y text-sm sm:text-base"
            placeholder="Décrivez brièvement votre demande..."
          ></textarea>
        </div>

        <!-- Note de confidentialité -->
        <div class="bg-teal-900/20 border border-teal-800 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <p class="text-xs sm:text-sm text-sky-300 leading-relaxed">
              Vos informations sont sécurisées et traitées de manière confidentielle et ne seront utilisées que pour répondre à votre demande.
            </p>
          </div>
        </div>

        <!-- Boutons -->
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
         
            <span v-if="!isSubmitting">Envoyer le message</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            </span>
          </button>
          
          <nuxt-link
            to="/"
            class="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center text-sm sm:text-base"
          >
            Retour à l'accueil
          </nuxt-link>
        </div>

        <!-- Message d'erreur inline -->
        <div v-if="showError" class="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-sm text-red-300">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </form>
    </div>

    <!-- Informations de contact -->
    <div class="mt-8 sm:mt-12 grid sm:grid-cols-2 gap-4 sm:gap-6">
      <!-- Email -->
      <div class="bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-5 sm:p-6 border border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-100 text-sm sm:text-base">Courriel</h3>
        </div>
        <p class="text-gray-300 ml-13 text-sm sm:text-base break-all">
          infos@lamarquets.com
        </p>
      </div>

      <!-- Téléphone -->
      <div class="bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-5 sm:p-6 border border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-100 text-sm sm:text-base">Téléphone</h3>
        </div>
        <p class="text-gray-300 ml-13 text-sm sm:text-base">
          (418) 931-6786
        </p>
      </div>
    </div>

    <!-- Localisation -->
    <div class="mt-4 sm:mt-6 bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-5 sm:p-6 border border-gray-700">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <h3 class="font-semibold text-gray-100 text-sm sm:text-base">Localisation</h3>
      </div>
      <p class="text-gray-300 ml-13 text-sm sm:text-base">
        Shawinigan, Mauricie, Québec
      </p>
    </div>
  </div>
<SuccessModale v-model="showSuccess" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isDark: boolean
}>()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

// Fermer la modale de succès
const closeSuccessModal = () => {
  showSuccess.value = false
}

const handleSubmit = async () => {
  isSubmitting.value = true
  showError.value = false
  showSuccess.value = false
  
  try {
    // 🔥 APPEL API RÉEL - Correspond exactement à /api/mail/index.post.ts
    const response = await $fetch('/api/mail', {
      method: 'POST',
      body: {
        nom: formData.value.name,           // ✅ Correspond à l'API
        email: formData.value.email,        // ✅
        telephone: formData.value.phone,    // ✅ Sera ajouté au message
        sujet: formData.value.subject,      // ✅
        message: formData.value.message     // ✅
      }
    })

    console.log('✅ Message envoyé et chiffré:', response)
    
    // Afficher la modale de succès
    showSuccess.value = true

    
    // Réinitialiser le formulaire
    formData.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
    
    // Masquer automatiquement après 8 secondes (optionnel)
    setTimeout(() => {
      showSuccess.value = false
    }, 8000)
    
  } catch (error: any) {
    console.error('❌ Erreur envoi:', error)
    showError.value = true
    errorMessage.value = error.data?.statusMessage || error.message || 'Une erreur est survenue lors de l\'envoi du message.'
    
    setTimeout(() => {
      showError.value = false
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Animation de la modale */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9) translateY(-20px);
}

/* Animation de bounce ralentie */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>