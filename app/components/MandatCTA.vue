<template>
  <section class="py-20 px-4 bg-white dark:bg-gray-800">
    <div class="max-w-4xl mx-auto text-center">
      <h2
        class="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 tracking-tight"
      >
        {{ titre }}
      </h2>
      <p
        class="text-lg text-gray-600 dark:text-gray-300 mb-10 leading-relaxed"
      >
        {{ description }}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <nuxt-link
          :to="primaryButtonLink"
          class="inline-block bg-sky-700 text-white py-3 px-8 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:bg-sky-600 transition-all duration-500"
        >
          {{ primaryButtonText }}
        </nuxt-link>
        <nuxt-link
          :to="secondaryButtonLink"
          class="inline-block bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-3 px-8 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 border border-teal-100 dark:border-sky-700"
        >
          {{ secondaryButtonText }}
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  titre: {
    type: String,
    default: "Prêt à homologuer votre mandat?"
  },
  description: {
    type: String,
    default: "Contactez-moi dès aujourd'hui à Shawinigan pour entamer vos démarches d'homologation dans un cadre simple, humain et professionnel."
  },
  primaryButtonText: {
    type: String,
    default: "Démarrer la procédure"
  },
  primaryButtonLink: {
    type: String,
    default: "/contact-page"
  },
  secondaryButtonText: {
    type: String,
    default: "Retour à l'accueil"
  },
  secondaryButtonLink: {
    type: String,
    default: "/"
  }
})
</script>