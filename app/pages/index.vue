<template>
  <div class="w-full min-h-full">
  <section
      class="relative min-h-screen pt-0 sm:pt-16 md:pt-24 text-gray-800 dark:text-gray-100 w-full overflow-hidden"
    >
  <div class="absolute inset-0 bg-slate-100 dark:bg-gray-900">
        <WavesBackground :show-controls-button="false" />
      </div>
      <div class="relative w-full max-w-7xl sm:mx-auto px-3 sm:px-4 md:px-6 pb-12">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-8 sm:mb-12 md:mb-16 text-gray-800 dark:text-gray-100 tracking-tight"
        >
          Des services simples pour vous aider!
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          <!-- Carte 1 -->
          <div
            class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 text-center border border-teal-100 dark:border-sky-700 w-full flex flex-col"
          >
            <div class="w-full flex justify-center mb-4 sm:mb-6">
              <ImgCard
                src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/Service1.png"
                alt="Service 1"
                :width="350"
                :height="250"
                rounded="2xl"
              />
            </div>
            <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 px-2 sm:px-4">
              Suivi individuel
            </h3>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-2 flex-grow">
              Service de soutien individuel par un travailleur social professionnel. Le service est offert à domicile ou en ligne pour
              vous accompagner dans vos défis de vie. N'hésitez pas à me contacter il me fera plaisir de vous écouter pour comprendre votre situation. 
              
            </p>
            <nuxt-link
              class="mt-4 sm:mt-6 inline-block bg-sky-700 text-white py-2 px-4 sm:px-5 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors text-sm sm:text-base"
              to="/Accompagnement"
            >
              En savoir plus
            </nuxt-link>
          </div>

          <!-- Carte 2 -->
          <div
            class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 text-center border border-teal-100 dark:border-sky-700 w-full flex flex-col"
          >
            <div class="w-full flex justify-center mb-4 sm:mb-6">
              <ImgCard
                src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/Service2.png"
                alt="Service 2"
                :width="350"
                :height="250"
                rounded="2xl"
              />
            </div>

            <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 px-2 sm:px-4 break-words">
              Évaluation : Homologation de Mandat
            </h3>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-2 flex-grow">
              Un prix unique couvrant l'ensemble de la démarche d'évaluation psychosociale en vue de l'homologation d'un mandat de protection. Service offert exclusivement en Mauricie. Contactez-moi : les conseils sont gratuits!

            </p>
            <nuxt-link
              class="mt-4 sm:mt-6 inline-block bg-sky-700 text-white py-2 px-4 sm:px-5 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors text-sm sm:text-base"
              to="/mandat">
              En savoir plus
            </nuxt-link>
          </div>

          <!-- Carte 3 -->
          <div
            class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 text-center border border-teal-100 dark:border-sky-700 w-full flex flex-col"
          >
            <div class="w-full flex justify-center mb-4 sm:mb-6">
              <ImgCard
                src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/LamarqueGroupe.png"
                alt="Service 3"
                :width="350"
                :height="250"
                rounded="2xl"
              />
            </div>

            <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 px-2 sm:px-4">
              Groupes de soutien
            </h3>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-2 flex-grow">
              Groupes de soutien en Mauricie qui seront possiblement offerts en 2026. Plusieurs sujets sont possibles selon l'intérêt des participants.
              N'hésitez pas à me contacter pour faire connaitre votre intérêt.
            </p>
            <nuxt-link
              class="mt-4 sm:mt-6 inline-block bg-sky-700 text-white py-2 px-4 sm:px-5 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors text-sm sm:text-base"
              to="/Groupe-Homme"
            >
              Faites connaître votre intérêt!
            </nuxt-link>
          </div>
        </div>
      </div>
      
    </section>
  </div>
</template>

<script lang="ts" setup>

import { useDarkMode } from "../composables/useDarkMode";


const { initTheme } = useDarkMode();
onMounted(() => {
  initTheme();
});

// 2. Definir les balises SEO
useHead({
  // CECI est votre Balise Titre
  title: 'Evaluation psychosociale dans le cadre de l\'homologation de mandat a Shawinigan | Nicolas Lamarque, TS', 
  meta: [
    { 
      name: 'description', 
      content: 'Travailleur Social Evaluateur a Shawinigan. Service d\'evaluation psychosociale rapide et professionnel pour l\'homologation de mandat de protection en Mauricie.' 
    }
  ],
})
</script>