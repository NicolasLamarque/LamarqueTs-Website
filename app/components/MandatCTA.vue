<!-- ========================================= -->
<!-- MandatCTA.vue - VERSION PRO -->
<!-- ========================================= -->
<template>
  <section class="py-12 sm:py-16 landscape:short:py-6 px-4 bg-transparent">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-2xl sm:text-3xl md:text-4xl landscape:short:text-xl font-extrabold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 landscape:short:mb-3 tracking-tight">
        {{ titre }}
      </h2>
      <p class="text-base sm:text-lg landscape:short:text-sm text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 landscape:short:mb-6 leading-relaxed">
        {{ description }}
      </p>
      <div class="flex flex-col sm:flex-row landscape:short:flex-row gap-3 sm:gap-4 justify-center">
        <nuxt-link
          :to="primaryButtonLink"
          class="inline-block bg-sky-700 text-white py-3 px-6 sm:px-8 landscape:short:py-2 landscape:short:px-5 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:bg-sky-600 transition-all duration-300 text-sm sm:text-base"
        >
          {{ primaryButtonText }}
        </nuxt-link>
        <nuxt-link
          :to="secondaryButtonLink"
          class="inline-block bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-3 px-6 sm:px-8 landscape:short:py-2 landscape:short:px-5 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border border-teal-100 dark:border-sky-700 text-sm sm:text-base"
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
    default: "/contact"
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