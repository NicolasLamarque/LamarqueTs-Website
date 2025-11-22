<template>
  <div class="min-h-screen bg-slate-100 dark:bg-gray-900">
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
</template>

<script setup>
// Nuxt 4 auto-importe les composants du dossier /components
// Pas besoin d'import manuel

useHead({
  title: "Homologation de Mandat à Shawinigan | Service professionnel",
  meta: [
    {
      name: "description",
      content:
        "Accompagnement complet pour l'homologation de mandat à Shawinigan. Service professionnel, humain et structuré pour faciliter vos démarches légales.",
    },
  ],
})
</script>