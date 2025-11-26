<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Politique de confidentialité et cookies</h1>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Utilisation des cookies</h2>
      <p class="mb-4">
        Notre site utilise des cookies pour améliorer votre expérience de navigation. 
        Conformément à la Loi 25 du Québec, nous vous demandons votre consentement 
        avant d'activer les cookies non essentiels.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Types de cookies utilisés</h2>
      
      <h3 class="text-xl font-medium mb-2">Cookies essentiels uniquement</h3>
      <p class="mb-4">
        Notre site utilise uniquement des cookies essentiels nécessaires au fonctionnement du site. 
        Ces cookies permettent de mémoriser vos préférences de cookies et d'assurer la navigation 
        sur le site. Ils ne collectent aucune information personnelle.
      </p>

      <h3 class="text-xl font-medium mb-2">Pas de cookies de suivi</h3>
      <p class="mb-4">
        Nous n'utilisons <strong>pas</strong> Google Analytics, Facebook Pixel, ou tout autre 
        outil de suivi ou d'analyse. Votre navigation sur notre site reste entièrement privée 
        et n'est pas suivie.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Vos droits</h2>
      <p class="mb-4">
        Vous pouvez à tout moment modifier vos préférences en matière de cookies 
        en cliquant sur le bouton "Gérer les cookies" en bas de page.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Contact</h2>
      <p>
        Pour toute question concernant notre politique de confidentialité, 
        vous pouvez nous contacter à : contact@lamarquets.com
      </p>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Politique de confidentialité - La Marque TS',
  meta: [
    {
      name: 'description',
      content: 'Politique de confidentialité et gestion des cookies conforme à la Loi 25 du Québec'
    }
  ]
})
</script>