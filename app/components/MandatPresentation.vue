<!-- ========================================= -->
<!-- MandatPresentation.vue - Version corrigée -->
<!-- ========================================= -->
<template>
  <section class="py-16 px-4">
    <div class="max-w-5xl mx-auto">
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200 dark:border-sky-700"
      >
        <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          {{ titre }}
        </h2>
        <div
          class="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed"
        >
          <p v-for="(paragraphe, index) in paragraphes" :key="index">
            {{ paragraphe }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  titre: {
    type: String,
    default: "Comprendre l'homologation du mandat"
  },
  paragraphes: {
    type: Array,
    default: () => [
      "L'homologation de mandat est une étape légale essentielle permettant de confirmer la validité d'un mandat de protection lorsque le mandant devient inapte. Ce processus, effectué devant le tribunal, assure la reconnaissance officielle du mandataire afin qu'il puisse représenter la personne de manière légitime.",
      "Je vous accompagne dans la préparation, la collecte des documents requis et la présentation du dossier, en collaboration avec les professionnels concernés. Ensemble, nous veillons à ce que chaque étape soit respectée avec justesse, empathie et efficacité."
    ]
  }
})
</script>