<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
    <div class="max-w-5xl mx-auto">
      
      <!-- En-tête animé -->
      <div class="text-center mb-12 animate-fade-in">
        <div class="inline-flex justify-center items-center mb-6">
          <div class="relative">
            <div class="absolute inset-0 bg-sky-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div class="relative w-24 h-24 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-600 dark:to-blue-700 flex items-center justify-center shadow-2xl">
              <font-awesome-icon :icon="['fas', 'envelope']" class="text-white text-4xl" />
            </div>
          </div>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Me contacter
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Pour prendre rendez-vous ou obtenir plus d'informations. Je suis là pour vous aider ! 💙
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Colonne gauche : Informations de contact -->
        <div class="space-y-6">
          
          <!-- Carte principale -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-sky-100 dark:border-sky-900 backdrop-blur-sm">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <font-awesome-icon :icon="['fas', 'address-card']" class="text-sky-600" />
              Coordonnées
            </h2>
            
            <!-- Email -->
            <div class="group flex items-center p-5 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 rounded-2xl border border-sky-100 dark:border-sky-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mb-4">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                <font-awesome-icon :icon="['fas', 'envelope']" class="text-white text-xl" />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Courriel</p>
                <a href="mailto:info@LamarqueTs.com" 
                   class="text-sky-700 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 font-bold text-lg transition-colors">
                  info@LamarqueTs.com
                </a>
              </div>
            </div>

            <!-- Téléphone -->
            <div class="group flex items-center p-5 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl border border-teal-100 dark:border-teal-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mb-4">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                <font-awesome-icon :icon="['fas', 'phone']" class="text-white text-xl" />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Téléphone</p>
                <a href="tel:+14189316786" 
                   class="text-teal-700 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 font-bold text-lg transition-colors">
                  (418) 931-6786
                </a>
              </div>
            </div>

            <!-- Adresse -->
            <div class="group flex items-start p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-purple-100 dark:border-purple-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 mb-4">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mr-4 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                <font-awesome-icon :icon="['fas', 'location-dot']" class="text-white text-xl" />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Adresse</p>
                <p class="text-gray-800 dark:text-gray-200 font-medium">
                  Mon adresse complète
                </p>
              </div>
            </div>

            <!-- Horaires -->
            <div class="group flex items-start p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl border border-amber-100 dark:border-amber-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mr-4 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                <font-awesome-icon :icon="['fas', 'clock']" class="text-white text-xl" />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Horaires</p>
                <p class="text-gray-800 dark:text-gray-200 font-medium">
                  Vendredi : 9h00 - 17h00
                </p>
              </div>
            </div>
          </div>

          <!-- Carte avantages -->
          <div class="bg-gradient-to-br from-sky-500 to-blue-600 dark:from-sky-600 dark:to-blue-700 rounded-3xl shadow-xl p-8 text-white">
            <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <font-awesome-icon :icon="['fas', 'shield-check']" />
              Vos données sont protégées
            </h3>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="text-white/90 mt-1 flex-shrink-0" />
                <span>Messages <strong>chiffrés de bout en bout</strong></span>
              </li>
              <li class="flex items-start gap-3">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="text-white/90 mt-1 flex-shrink-0" />
                <span>Réponse sous <strong>24 heures maximum</strong></span>
              </li>
              <li class="flex items-start gap-3">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="text-white/90 mt-1 flex-shrink-0" />
                <span>Confidentialité <strong>garantie</strong></span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Colonne droite : Formulaire de contact -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-sky-100 dark:border-sky-900">
          
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="text-sky-600" />
            Envoyez un message
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8">
            Remplissez le formulaire ci-dessous et je vous répondrai rapidement.
          </p>

          <!-- Message de succès/erreur -->
          <Transition name="slide-down">
            <div v-if="submitMessage" 
                 :class="['p-4 rounded-xl mb-6 flex items-center gap-3 font-medium', submitSuccess ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700']">
              <font-awesome-icon :icon="submitSuccess ? ['fas', 'check-circle'] : ['fas', 'exclamation-circle']" class="text-2xl" />
              <span>{{ submitMessage }}</span>
            </div>
          </Transition>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            
            <!-- Nom complet -->
            <div class="group">
              <label for="nom" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <font-awesome-icon :icon="['fas', 'user']" class="text-sky-600" />
                Nom complet *
              </label>
              <input 
                id="nom"
                v-model="form.nom" 
                type="text" 
                required
                placeholder="Jean Dupont"
                class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all group-hover:border-sky-300 dark:group-hover:border-sky-700"
              />
            </div>

            <!-- Email -->
            <div class="group">
              <label for="email" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <font-awesome-icon :icon="['fas', 'envelope']" class="text-sky-600" />
                Adresse courriel *
              </label>
              <input 
                id="email"
                v-model="form.email" 
                type="email" 
                required
                placeholder="jean.dupont@example.com"
                class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all group-hover:border-sky-300 dark:group-hover:border-sky-700"
              />
            </div>

            <!-- Téléphone et Sujet -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="group">
                <label for="telephone" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <font-awesome-icon :icon="['fas', 'phone']" class="text-sky-600" />
                  Téléphone
                </label>
                <input 
                  id="telephone"
                  v-model="form.telephone" 
                  type="tel"
                  placeholder="(418) 123-4567"
                  class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all group-hover:border-sky-300 dark:group-hover:border-sky-700"
                />
              </div>
              
              <div class="group">
                <label for="sujet" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <font-awesome-icon :icon="['fas', 'tag']" class="text-sky-600" />
                  Sujet
                </label>
                <select
                  id="sujet"
                  v-model="form.sujet"
                  class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all group-hover:border-sky-300 dark:group-hover:border-sky-700"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="Rendez-vous">Demande de rendez-vous</option>
                  <option value="Information">Demande d'information</option>
                  <option value="Urgence">Situation urgente</option>
                  <option value="Autre">Autre sujet</option>
                </select>
              </div>
            </div>

            <!-- Message -->
            <div class="group">
              <label for="message" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <font-awesome-icon :icon="['fas', 'comment-dots']" class="text-sky-600" />
                Votre message *
              </label>
              <textarea 
                id="message"
                v-model="form.message" 
                rows="6" 
                required
                placeholder="Décrivez votre demande en détail..."
                class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none group-hover:border-sky-300 dark:group-hover:border-sky-700"
              ></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ form.message.length }} / 1000 caractères
              </p>
            </div>

            <!-- Note de confidentialité -->
            <div class="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl p-4">
              <div class="flex gap-3">
                <font-awesome-icon :icon="['fas', 'lock']" class="text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                <div class="text-sm">
                  <p class="font-semibold text-gray-900 dark:text-white mb-1">* Champs obligatoires</p>
                  <p class="text-gray-600 dark:text-gray-400">
                    Vos données sont <strong>chiffrées</strong> et ne seront utilisées que pour vous répondre. Aucune information ne sera partagée avec des tiers.
                  </p>
                </div>
              </div>
            </div>

            <!-- Bouton d'envoi -->
            <button 
              type="submit"
              :disabled="isSubmitting || !isFormValid"
              class="group relative w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg overflow-hidden"
            >
              <span class="relative z-10 flex items-center justify-center gap-3">
                <font-awesome-icon 
                  :icon="isSubmitting ? ['fas', 'spinner'] : ['fas', 'paper-plane']" 
                  :class="['text-xl', isSubmitting ? 'fa-spin' : 'group-hover:translate-x-1 transition-transform']" 
                />
                {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande' }}
              </span>
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const form = ref({
  nom: '',
  email: '',
  sujet: '',
  telephone: '',
  message: ''
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref<boolean | null>(null)

// Validation du formulaire
const isFormValid = computed(() => {
  return form.value.nom.trim().length > 0 && 
         form.value.email.trim().length > 0 && 
         form.value.message.trim().length > 0
})

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  submitMessage.value = ''
  
  try {
    const response = await $fetch('/api/mail', {
      method: 'POST',
      body: form.value
    })

    submitSuccess.value = true
    submitMessage.value = '✅ Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.'
    
    // Réinitialiser le formulaire
    form.value = { nom: '', email: '', telephone: '', message: '', sujet: '' }
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
      submitMessage.value = ''
    }, 5000)

  } catch (error: any) {
    console.error('Erreur contact:', error)
    submitSuccess.value = false
    
    if (error.statusCode === 400) {
      submitMessage.value = '⚠️ Veuillez remplir tous les champs obligatoires.'
    } else if (error.statusCode === 500) {
      submitMessage.value = '❌ Erreur serveur. Veuillez réessayer dans quelques instants.'
    } else {
      submitMessage.value = '⚠️ Une erreur est survenue. Veuillez réessayer.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>