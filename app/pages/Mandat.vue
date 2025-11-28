<!-- Mandat.vue - Version corrigée -->
<template>
  <div lang="fr" class="min-h-screen bg-slate-100 dark:bg-gray-900">
    
    <!-- Background fixe avec vagues -->
    <div class="fixed inset-0 bg-slate-100 dark:bg-gray-900 z-0">
      <WavesBackground />
    </div>
    
    <!-- Contenu principal au-dessus du background -->
    <div class="relative z-[1]">
      <!-- Hero Section -->
      <MandatHero />

      <!-- Section Présentation -->
      <MandatPresentation />

      <!-- Section Bénéfices -->
      <MandatAvantages />

      <!-- Section Déroulement -->
      <section class="py-16 px-4">
        <DeroulementMandat :show-links="true" />
      </section>

      <!-- Section CTA -->
      <MandatCTA primary-button-link="/Contact-Page" />

      <!-- Section Documents requis -->
      <MandatDocuments />
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Service d'Evaluation Psychosociale en vue de l'Homologation de Mandat a Shawinigan | Service professionnel",
  meta: [
    {
      name: "description",
      content:
        "Accompagnement complet pour l'homologation de mandat a Shawinigan. Service professionnel, humain et structure pour faciliter vos demarches legales.",
    },
  ],
})
</script>
