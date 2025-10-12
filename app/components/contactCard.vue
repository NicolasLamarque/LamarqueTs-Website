<template>
  <div class="min-h-screen bg-slate-100 dark:bg-gray-900 py-20 px-4">
    <div class="max-w-4xl mx-auto">
      
      <!-- Icône d'en-tête -->
      <div class="flex justify-center items-center mb-10">
        <div class="w-20 h-20 rounded-full bg-sky-700 dark:bg-sky-600 flex items-center justify-center shadow-xl">
          <font-awesome-icon :icon="['fas', 'envelope']" class="text-white size-10" />
        </div>
      </div>

      <!-- Carte principale -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-teal-100 dark:border-sky-700">
        
        <h1 class="flex justify-center items-center text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 tracking-tight">
          Me contacter
        </h1>
        
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Pour prendre rendez-vous ou obtenir plus d'informations. N'hesitez pas! </p>
          
        

        <!-- Informations de contact -->
        <div class="space-y-6 mb-10">
          <div class="flex items-center p-4 bg-slate-100 dark:bg-gray-900 rounded-xl border border-teal-100 dark:border-sky-700 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 rounded-full bg-sky-700 dark:bg-sky-600 flex items-center justify-center mr-4 flex-shrink-0">
              <font-awesome-icon :icon="['fas', 'envelope']" class="text-white size-5" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Courriel</p>
              <a href="mailto:info@LamarqueTs.com" 
                 class="text-sky-700 dark:text-sky-400 hover:underline font-semibold text-lg">
                info@LamarqueTs.com
              </a>
            </div>
          </div>

          <div class="flex items-center p-4 bg-slate-100 dark:bg-gray-900 rounded-xl border border-teal-100 dark:border-sky-700 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 rounded-full bg-sky-700 dark:bg-sky-600 flex items-center justify-center mr-4 flex-shrink-0">
              <font-awesome-icon :icon="['fas', 'phone']" class="text-white size-5" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Téléphone</p>
              <a href="tel:+14189316786" 
                 class="text-sky-700 dark:text-sky-400 hover:underline font-semibold text-lg">
                (418) 931-6786
              </a>
            </div>
          </div>
        </div>

        <!-- Adresse et horaires -->
        <div class="bg-slate-100 dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-teal-100 dark:border-sky-700 shadow-inner">
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-sky-700 dark:bg-sky-600 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                <font-awesome-icon :icon="['fas', 'location-dot']" class="text-white size-5" />
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Adresse</p>
                <p class="text-gray-800 dark:text-gray-100 font-medium">
                  3700 Rue place Masson<br>
                  Shawinigan, Québec
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="w-10 h-10 rounded-full bg-sky-700 dark:bg-sky-600 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                <font-awesome-icon :icon="['fas', 'clock']" class="text-white size-5" />
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">Horaires</p>
                <p class="text-gray-800 dark:text-gray-100 font-medium">
                  Vendredi : 9h00 - 17h00
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton d'action optionnel -->
         <div class="mt-8 text-center">
      <button 
        @click="scrollToContact"
        class="bg-sky-700 text-white py-3 px-8 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:bg-sky-600 transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-sky-300"
      >
        Prendre rendez-vous
      </button>
    </div>
    <!-- Formulaire de contact plus bas sur la page -->
    <section id="contact" ref="contactSection" class="mt-16 max-w-2xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-8">Me contacter</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="nom" class="block text-sm font-medium mb-2">Nom complet *</label>
          <input 
            id="nom"
            v-model="form.nom" 
            type="text" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium mb-2">Email *</label>
          <input 
            id="email"
            v-model="form.email" 
            type="email" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
<div class="grid grid-cols-2 gap-4">
        <div>
          <label for="telephone" class="block text-sm font-medium mb-2">Téléphone</label>
          <input 
            id="telephone"
            v-model="form.telephone" 
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div>
          <label for="sujet" class="block text-sm font-medium mb-2">Sujet</label>
          <input 
            id="sujet"
            v-model="form.sujet" 
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

</div>


        <div>
          <label for="message" class="block text-sm font-medium mb-2">Message *</label>
          <textarea 
            id="message"
            v-model="form.message" 
            rows="5" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          ></textarea>
        </div>

        <div class="text-sm text-gray-600">
          <p>* Champs obligatoires</p>
          <p class="mt-2">Vos données sont confidentielles et ne seront utilisées que pour vous répondre.</p>
        </div>

        <button 
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-sky-700 text-white py-3 px-8 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:bg-sky-600 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande' }}
        </button>

        <p v-if="submitMessage" :class="submitSuccess ? 'text-green-600' : 'text-red-600'" class="text-center font-medium">
          {{ submitMessage }}
        </p>
      </form>
    </section>
  </div>
      </div>
    </div>
  
</template>

<script setup lang="ts">
const form = ref({
  nom: '',
  email: '',
  sujet: '',
  telephone: '',
  message: ''
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)
const contactSection = ref<HTMLElement | null>(null)

const scrollToContact = () => {
  contactSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitMessage.value = ''
  
  try {
    // Envoi vers votre API
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    })
    
    submitSuccess.value = true
    submitMessage.value = 'Merci ! Je vous répondrai dans les plus brefs délais.'
    
    // Réinitialiser le formulaire
    form.value = { nom: '', email: '', telephone: '', message: '', sujet: '' }
  } catch (error) {
    submitSuccess.value = false
    submitMessage.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    isSubmitting.value = false
  }
}
</script>