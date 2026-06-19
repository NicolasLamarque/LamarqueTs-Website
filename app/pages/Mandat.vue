<template>
  <div class="min-h-screen bg-slate-100 dark:bg-gray-900">

    <!-- Background -->
    <div class="fixed inset-0 bg-slate-100 dark:bg-gray-900 -z-10">
      <WavesBackground />
    </div>

    <div class="relative max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8">

      <!-- HERO -->
      <div class="text-center space-y-4">
        <p class="text-sky-600 dark:text-sky-400 font-semibold text-sm uppercase tracking-widest">
          Shawinigan · Trois-Rivières · Mauricie
        </p>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
          Homologation de mandat de protection
        </h1>
        <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Votre proche est en perte d'autonomie et chaque instant compte.
          <strong>Je m'occupe de toute l'évaluation psychosociale</strong> —
          vous êtes entre de bonnes mains.
        </p>

        <!-- CTA principal -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href="tel:4189316786"
            class="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            (418) 931-6786
          </a>
          <NuxtLink
            to="/contact"
            class="flex items-center justify-center bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sky-700 dark:text-sky-300 font-semibold py-3 px-8 rounded-xl border border-sky-200 dark:border-sky-700 shadow hover:shadow-md transition-all duration-300"
          >
            Écrivez-moi
          </NuxtLink>
        </div>
      </div>

      <!-- IMAGE -->
      <div class="rounded-2xl overflow-hidden shadow-xl max-w-3xl mx-auto">
        <img
          src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/Service2.png"
          alt="Homologation de mandat à Shawinigan"
          class="w-full h-auto max-h-[400px] object-cover"
          loading="lazy"
        />
      </div>

      <!-- 3 POINTS CLÉS -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-teal-100 dark:border-sky-700 text-center">
          <div class="text-3xl mb-3">⚡</div>
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">Rapide</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Beaucoup plus rapide que le secteur public</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-teal-100 dark:border-sky-700 text-center">
          <div class="text-3xl mb-3">🤝</div>
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">Tout inclus</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Un prix unique — toute l'évaluation psychosociale</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-teal-100 dark:border-sky-700 text-center">
          <div class="text-3xl mb-3">💬</div>
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2">Sans frais</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Le premier appel est sans frais, pour voir ensemble si je peux vous aider</p>
        </div>
      </div>

      <!-- ACCORDÉON — Pour ceux qui veulent les détails -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-sky-700 overflow-hidden">
        <button
          @click="accordeonOuvert = !accordeonOuvert"
          class="w-full flex items-center justify-between p-6 sm:p-8 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
              Vous voulez comprendre le processus ?
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Les 6 étapes de l'homologation — pour ceux qui veulent les détails
            </p>
          </div>
          <svg
            class="w-6 h-6 text-sky-600 flex-shrink-0 transition-transform duration-300"
            :class="accordeonOuvert ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[9999px]"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-[9999px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="accordeonOuvert" class="px-6 sm:px-8 pb-8 border-t border-gray-100 dark:border-gray-700">
            <DeroulementMandat :show-links="true" />
          </div>
        </Transition>
      </div>

      <!-- CTA BAS DE PAGE -->
      <div class="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-sky-700 p-8 sm:p-10">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-3">
          Prêt à démarrer ?
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Contactez-moi à Shawinigan — le premier appel est sans frais.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:4189316786"
            class="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            (418) 931-6786
          </a>
          <NuxtLink
            to="/contact"
            class="flex items-center justify-center bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sky-700 dark:text-sky-300 font-semibold py-3 px-8 rounded-xl border border-sky-200 dark:border-sky-700 shadow transition-all duration-300"
          >
            Formulaire de contact
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const accordeonOuvert = ref(false)

useHead({
  title: "Homologation de mandat en Mauricie | Nicolas Lamarque, T.S. — Shawinigan",
  meta: [
    {
      name: "description",
      content: "Évaluation psychosociale complète pour l'homologation de mandat de protection en Mauricie. Service rapide, humain et professionnel à Shawinigan et Trois-Rivières. Premier appel sans frais.",
    },
  ],
})
</script>