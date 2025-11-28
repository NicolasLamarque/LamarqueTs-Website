<!-- ========================================= -->
<!-- MandatHero.vue - Version corrigée -->
<!-- ========================================= -->
<template>
  <section class="relative py-20 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h1
          class="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 tracking-tight"
        >
          {{ titre }}
        </h1>
        <p
          class="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Votre proche est en perte d'autonomie et chaque instant compte. Je vous accompagne pas à pas dans l'homologation de son mandat à Shawinigan, 
          avec écoute, rigueur et bienveillance. Ensemble, nous assurons que ses droits sa sécurité et ses volontés soient respectés. 
          Respirez un instant… vous êtes entre de bonnes mains. 
          <NuxtLink 
            to="/contact-page" 
            class="text-sky-700 dark:text-sky-400 underline hover:text-sky-900 dark:hover:text-sky-300 transition-colors font-semibold"
          >
            Contactez-moi aujourd'hui
          </NuxtLink> 
          pour un soutien humain, clair et apaisant.
        </p>
      </div>

      <!-- Image principale -->
      <div class="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl">
        <img
          :src="imageSrc"
          :alt="imageAlt"
          class="w-full h-auto"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  titre: {
    type: String,
    default: "Service d'évaluation psychosociale en vue de l'homologation de mandat en Mauricie"
  },
  imageSrc: {
    type: String,
    default: "https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/Service2.png"
  },
  imageAlt: {
    type: String,
    default: "Homologation de mandat à Shawinigan"
  }
})
</script>
