<template>
  <div class="w-full">
    <section
      class="relative py-12 sm:py-16 md:py-24 bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 w-full"
    >
      <div class="relative w-full max-w-7xl sm:mx-auto px-3 sm:px-4 md:px-6">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-8 sm:mb-12 md:mb-16 text-gray-800 dark:text-gray-100 tracking-tight"
        >
          Des services simples pour vous aider!
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          <!-- Carte 1 -->
          <div
            class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 text-center border border-teal-100 dark:border-sky-700 w-full"
          >
            <div class="w-full flex justify-center mb-4 sm:mb-6">
              <ImgCard
                src="/service1.jpg"
                alt="Service 1"
                :width="350"
                :height="250"
                rounded="2xl"
              />
            </div>
            <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 px-2 sm:px-4">
              Suivi individuel
            </h3>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-2">
              Un espace bienveillant pour explorer vos défis personnels,
              développer vos stratégies d'adaptation selon votre contexte et
              renforcer votre capacité de changement.
            </p>
            <nuxt-link
              class="mt-4 sm:mt-6 inline-block bg-sky-700 text-white py-2 px-4 sm:px-5 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors text-sm sm:text-base"
              to="/accompagnement"
            >
              En savoir plus
            </nuxt-link>
          </div>

          <!-- Carte 2 -->
          <div
            class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 text-center border border-teal-100 dark:border-sky-700 w-full"
          >
            <div class="w-full flex justify-center mb-4 sm:mb-6">
              <ImgCard
                src="/service2.jpg"
                alt="Service 2"
                :width="350"
                :height="250"
                rounded="2xl"
              />
            </div>

            <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 px-2 sm:px-4 break-words">
              Homologation de mandat personnalisé
            </h3>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-2">
              Un prix unique incluant tout de bout en bout pour un service
              d'homologation de mandat accessible en Mauricie, avec de précieux
              conseils et un soutien personnalisé tout au long du processus.
            </p>
            <nuxt-link
              class="mt-4 sm:mt-6 inline-block bg-sky-700 text-white py-2 px-4 sm:px-5 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors text-sm sm:text-base"
              to="/mandat"
            >
              En savoir plus
            </nuxt-link>
          </div>

          <!-- Carte 3 -->
          <div
            class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 text-center border border-teal-100 dark:border-sky-700 w-full"
          >
            <div class="w-full flex justify-center mb-4 sm:mb-6">
              <ImgCard
                src="/groupes.jpg"
                alt="Service 3"
                :width="350"
                :height="250"
                rounded="2xl"
              />
            </div>

            <h3 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 px-2 sm:px-4">
              Groupes thérapeutiques
            </h3>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-2">
              Ateliers thématiques et groupes de parole pour partager, apprendre
              et grandir ensemble autour de la santé et du bien-être.
            </p>
            <nuxt-link
              class="mt-4 sm:mt-6 inline-block bg-sky-700 text-white py-2 px-4 sm:px-5 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors text-sm sm:text-base"
              to="/Evenements"
            >
              Prochaines dates
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
</script>
