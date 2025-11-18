<template>
  <section class="py-16 px-4">
    <div class="max-w-5xl mx-auto">
      <h2
        class="text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-12 tracking-tight"
      >
        Les étapes de l’homologation d’un mandat de protection
      </h2>

      <div class="space-y-6">
        <div
          v-for="(etape, index) in etapes"
          :key="index"
          class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-l-4 border-sky-700 dark:border-sky-600"
        >
          <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            {{ index + 1 }}. {{ etape.titre }}
          </h3>

          <!-- Texte avec référence en clair -->
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
            {{ etape.description }}
          </p>

          <ul class="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-1 mb-4">
            <li v-for="(point, i) in etape.points" :key="i">{{ point }}</li>
          </ul>

          <!-- Liens PDF Curateur -->
          <div v-if="showLinks && index === 0" class="mt-5 flex flex-col sm:flex-row gap-3">
            <a
              href="https://cdn-contenu.quebec.ca/cdn-contenu/curateur-public/pdf/form_eval_med.pdf"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 bg-sky-600 text-white px-5 py-3 rounded-xl shadow hover:bg-sky-700 transition"
            >
              <FontAwesomeIcon :icon="['fas', 'stethoscope']" class="w-4 h-4" />
              Formulaire d’évaluation médicale (PDF)
            </a>

            <a
              href="https://cdn-contenu.quebec.ca/cdn-contenu/curateur-public/pdf/form_eval_psy_hom_mand.pdf"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 bg-sky-600 text-white px-5 py-3 rounded-xl shadow hover:bg-sky-700 transition"
            >
              <FontAwesomeIcon :icon="['fas', 'user-doctor']" class="w-4 h-4" />
              Formulaire d’évaluation psychosociale (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Avis non-juridique avec bouton PDF officiel -->
    <section class="mt-10 px-4">
      <div class="max-w-5xl mx-auto">
        <AvisNonJuridique>
          <template #pdfButton>
            <ToLegisPdf />
          </template>
        </AvisNonJuridique>
      </div>
    </section>
  </section>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStethoscope, faUserDoctor } from '@fortawesome/free-solid-svg-icons'
import AvisNonJuridique from './AvisNonJuridique.vue'
import ToLegisPdf from './ToLegisPdf.vue'

const props = defineProps({
  showLinks: { type: Boolean, default: true }
})

const etapes = [
  {
    titre: "Évaluation médicale et psychosociale",
    description: "Collecte des rapports médicaux et psychosociaux confirmant l’inaptitude; ces documents sont centraux pour que le tribunal constate l’inaptitude (art. 2166 à 2174 C.c.Q.).",
    points: [
      "Obtenir un rapport médical détaillé (diagnostic, pronostics, répercussions fonctionnelles, déclaration d'inaptitude médicale).",
      "Rapport psychosocial (situation familiale, capacités au quotidien, relations interpersonnelles, activités et loisirs, besoins bio-psychosociaux).",
      "Attention aux délais : Bien qu'elle'soit gratuite, l’évaluation par le bias du secteur public peut être longue (parfois plusieurs mois)."
    ]
  },
  {
    titre: "Trouver et vérifier le mandat le plus récent",
    description: "Vérifier qu’on présente au tribunal la dernière version du mandat. Le mandat doit être conforme aux exigences du Code civil (art. 2130 et suivants C.c.Q.).",
    points: [
      "Rechercher auprès du mandant (si possible) et des registres professionnels (Chambre des notaires, Barreau).",
      "S’assurer que le mandat est conforme (signature, témoins ou acte notarié) et qu’aucune version ultérieure n’existe."
    ]
  },
  {
    titre: "Préparation du dossier et dépôt de la demande",
    description: "Rassembler mandat, évaluations, certificats de recherche et pièces justificatives; rédiger la demande d’homologation (art. 2172 C.c.Q.).",
    points: [
      "Si aucune opposition : la procédure peut être faite devant un notaire.",
      "Si opposition possible ou déjà exprimée : déposer la demande au tribunal compétent.",
      "Joindre l’inventaire, la désignation de la personne qui recevra la reddition de comptes et la fréquence prévue."
    ]
  },
  {
    titre: "Signification et avis aux personnes concernées",
    description: "Signifier la demande au mandant, aux proches, au Curateur public et au mandataire (art. 2171-2172 C.c.Q.).",
    points: [
      "La signification respecte des délais légaux selon le tribunal.",
      "Si une personne notifiée s’oppose, la procédure devient contentieuse et peut nécessiter des preuves supplémentaires."
    ]
  },
  {
    titre: "Examen par le tribunal (audience)",
    description: "Le tribunal vérifie l’inaptitude, la validité du mandat et la capacité du mandataire à agir (art. 2173 C.c.Q.).",
    points: [
      "Le juge peut désirer entendre des témoins et ordonner des expertises ou demander des précisions.",
      "S’assurer que la volonté du mandant est respectée autant que possible."
    ]
  },
  {
    titre: "Décision : homologation, refus ou tutelle",
    description: "Le tribunal rend sa décision : homologation (totale/partielle), refus, ou ouverture d’une tutelle (art. 2174 C.c.Q.).",
    points: [
      "Si homologation : le mandataire peut exercer les pouvoirs conférés et doit rendre compte selon la périodicité prévue.",
      "En cas de refus : des recours ou l’ouverture d’une tutelle peuvent être envisagés."
    ]
  }
]
</script>

<style scoped>
/* Garde ton style existant */
</style>
