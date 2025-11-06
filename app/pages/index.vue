<template>
  <div>
    <section
      class="relative py-24 bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
    >
      <!-- Décor de fond doux -->

      <div class="relative container mx-auto px-6">
        <h2
          class="text-3xl md:text-5xl font-extrabold text-center mb-16 text-gray-800 dark:text-gray-100 tracking-tight"
        >
          Mes Services qui permettent de mieux vous aider!
        </h2>

        <div class="grid md:grid-cols-3 gap-10">
          <!-- Carte 1 -->
          <div
            class="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 text-center border border-teal-100 dark:border-sky-700"
          >
            <div class="w-full flex justify-center mb-6">
              <ImgCard
                src="/service1.jpg"
                alt="Service 1"
                :width="350"
                :height="250"
                rounded="2xl"
              />
            </div>
            <h3 class="text-2xl font-semibold text-gray-800 mb-4 p-4">
              Accompagnement individuel
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Un espace bienveillant pour explorer vos défis personnels,
              développer des stratégies d'adaptation de votre envoronnement et
              renforcer votre capacité de changement.
            </p>
            <nuxt-link
              class="mt-6 inline-block bg-sky-700 text-white py-2 px-5 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors"
              to="/accompagnement"
            >
              En savoir plus
            </nuxt-link>
          </div>

          <!-- Carte 2 -->

          <div
            class="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 text-center border border-teal-100"
          >
            <div class="w-full flex justify-center mb-6">
              <ImgCard
                src="/service2.jpg"
                alt="Service 2"
                :width="350"
                :height="250"
                rounded="2xl"
              />
            </div>

            <h3 class="text-2xl font-semibold text-gray-800 mb-4 p-4">
              Homologation de mandat personnalisé
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Un prix unique incluant tout de bout en bout pour un service
              d’homologation de mandat accessible en mauricie, avec de précieux
              conseils et un soutien personnalisés tout au long du processus.
            </p>
            <nuxt-link
              class="mt-6 inline-block bg-sky-700 text-white py-2 px-5 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors"
              to="/mandat"
            >
              En savoir plus
            </nuxt-link>
          </div>

          <!-- Carte 3 -->
          <div
            class="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 text-center border border-teal-100"
          >
            <div class="w-full flex justify-center mb-6">
              <ImgCard
                src="/groupes.jpg"
                alt="Service 3"
                :width="350"
                :height="250"
                rounded="2xl"
              />
            </div>

            <h3 class="text-2xl font-semibold text-gray-800 mb-4 p-4">
              Groupes thérapeutiques
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Ateliers thématiques et groupes de parole pour partager, apprendre
              et grandir ensemble autour de la santé et du bien-être.
            </p>
            <nuxt-link
              class="mt-6 inline-block bg-sky-700 text-white py-2 px-5 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors"
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

<style></style>
