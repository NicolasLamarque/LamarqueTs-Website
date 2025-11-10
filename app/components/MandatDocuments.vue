<template>
  <section class="py-16 px-4 bg-white dark:bg-gray-800">
    <div class="max-w-3xl mx-auto">
      <div
        class="bg-slate-100 dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-teal-100 dark:border-sky-700"
      >
        <h2
          class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center"
        >
          {{ titre }}
        </h2>
        <ul
          class="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 leading-relaxed"
        >
          <li v-for="(doc, index) in documents" :key="index">
            {{ doc.titre }}
            <a
              v-if="doc.lien"
              :href="doc.lien"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sky-700 underline hover:text-sky-900 ml-2"
            >
              {{ doc.texteLien }}
            </a>
          </li>
        </ul>
        <div v-if="showPdfButton" class="text-center mt-10">
          <nuxt-link
            :to="pdfUrl"
            target="_blank"
            class="inline-block bg-sky-700 text-white py-3 px-8 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:bg-sky-600 transition-all duration-500"
            download
          >
            {{ pdfButtonText }}
          </nuxt-link>
        </div>
      </div>
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
  },
  showPdfButton: {
    type: Boolean,
    default: true
  },
  pdfUrl: {
    type: String,
    default: "/docs/homologation.pdf"
  },
  pdfButtonText: {
    type: String,
    default: "Télécharger le guide PDF"
  }
})
</script>