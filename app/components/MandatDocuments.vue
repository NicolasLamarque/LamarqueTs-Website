<!-- ========================================= -->
<!-- MandatDocuments.vue - VERSION PRO -->
<!-- ========================================= -->
<template>
  <section class="py-12 sm:py-16 landscape:short:py-6 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 landscape:short:p-5 border border-gray-200 dark:border-sky-700">
        <h2 class="text-2xl sm:text-3xl landscape:short:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 landscape:short:mb-3 text-center">
          {{ titre }}
        </h2>
        <ul class="list-disc pl-5 sm:pl-6 space-y-2 sm:space-y-3 landscape:short:space-y-2 text-sm sm:text-base landscape:short:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <li v-for="(doc, index) in documents" :key="index">
            {{ doc.titre }}
            <a
              v-if="doc.lien"
              :href="doc.lien"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sky-700 dark:text-sky-400 underline hover:text-sky-900 dark:hover:text-sky-300 ml-1 sm:ml-2 transition-colors"
            >
              {{ doc.texteLien }}
            </a>
          </li>
        </ul>
        <div class="text-center mt-8 sm:mt-10 landscape:short:mt-6">
          <nuxt-link
            to="/contact"
            class="inline-block bg-sky-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 landscape:short:py-2 landscape:short:px-5 rounded-xl sm:rounded-full font-semibold hover:bg-sky-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Contactez-nous pour assistance
          </nuxt-link>
        </div>
        
      </div>
    </div>
  </section>
  <!-- Nouvelle section pour les documents -->
    <section class="py-16 px-4">
      <div class="container mx-auto max-w-4xl text-center">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Générer votre déclaration sous serment
        </h2>
        <NuxtLink
          to="/declaration-serment"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Créer ma déclaration
        </NuxtLink>
      </div>
    </section>
</template>

<script setup>
const props = defineProps({
  titre: {
    type: String,
    default: "Documents requis pour l'homologation"
  },
  documents: {
    type: Array,
    default: () => [
      {
        titre: "Mandat de protection (original ou copie conforme)",
        lien: "https://www.quebec.ca/justice-et-etat-civil/protection-legale/mandat-de-protection/faire-homologuer-mandat-de-protection",
        texteLien: "Guide officiel"
      },
      {
        titre: "Évaluation médicale (par un médecin)",
        lien: "https://educaloi.qc.ca/wp-content/uploads/guide_homologation.pdf",
        texteLien: "Guide Éducaloi"
      },
      {
        titre: "Évaluation psychosociale (par un travailleur social)",
        lien: "https://juridiqc.gouv.qc.ca/aines-en-perte-dautonomie/demarches-et-outils-de-protection/mandat-de-protection/les-etapes-pour-homologuer-un-mandat-de-protection",
        texteLien: "Explications JuridiQC"
      }
    ]
  }
})
</script>