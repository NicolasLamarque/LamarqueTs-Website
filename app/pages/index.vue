<template>
  <div class="w-full min-h-full">
    <section class="relative pt-0 sm:pt-16 md:pt-24 text-gray-800 dark:text-gray-100 w-full">
      
      <!-- Background -->
      <div class="fixed inset-0 bg-slate-100 dark:bg-gray-900 -z-10">
        <WavesBackground :show-controls-button="false" />
      </div>

      <div class="relative w-full max-w-5xl sm:mx-auto px-3 sm:px-4 md:px-6 pb-12">

        <!-- Titre principal -->
        <div class="text-center mb-8 sm:mb-12">
          <p class="text-sky-600 dark:text-sky-400 font-semibold text-sm sm:text-base uppercase tracking-widest mb-2">
            Shawinigan · Trois-Rivières · Mauricie · Québec
          </p>
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight mb-3 sm:mb-4">
            Je suis là pour vous aider
          </h1>
          <p class="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Nicolas Lamarque, T.S. — Travailleur social en Mauricie
          </p>
        </div>

        <!-- Carte principale : Homologation -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-sky-600 dark:border-sky-500 p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 w-full">
          
          <div class="flex items-center gap-2 mb-4 sm:mb-6">
            <span class="bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              ⭐ Service principal
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Disponible en Mauricie
            </span>
          </div>

          <div class="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
            
            <div class="w-full md:w-2/5 flex-shrink-0">
              <ImgCard
                src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/Service2.png"
                alt="Homologation de mandat en Mauricie"
                :width="400"
                :height="280"
                rounded="2xl"
                class="w-full"
              />
            </div>

            <div class="flex-1 flex flex-col gap-4">
              <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                Homologation de mandat de protection
              </h2>
              
              <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Votre proche a besoin d'un mandat homologué ? <strong>Je m'occupe de toute l'évaluation psychosociale</strong> — rapidement, humainement et professionnellement.
              </p>

              <ul class="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                <li class="flex items-center gap-2">
                  <span class="text-sky-500 font-bold">✓</span>
                  Service complet — un prix unique, tout inclus
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-sky-500 font-bold">✓</span>
                  Beaucoup plus rapide que le secteur public
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-sky-500 font-bold">✓</span>
                  Les conseils sont gratuits — appelez-moi !
                </li>
              </ul>

              <div class="flex flex-col sm:flex-row gap-3 mt-2">
                <a
                  href="tel:4189316786"
                  class="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  (418) 931-6786
                </a>
                <NuxtLink
                  to="/mandat"
                  class="flex items-center justify-center bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sky-700 dark:text-sky-300 font-semibold py-3 px-6 rounded-xl border border-sky-200 dark:border-sky-700 shadow hover:shadow-md transition-all duration-300 text-sm sm:text-base"
                >
                  En savoir plus
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Carte zone de couverture — entre homologation et autres services -->
        <ZoneCouverture />

        <!-- Autres services -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          
          <div class="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6 border border-teal-100 dark:border-sky-700 flex flex-col">
            <div class="w-full flex justify-center mb-4">
              <ImgCard
                src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/Service1.png"
                alt="Suivi individuel"
                :width="300"
                :height="200"
                rounded="xl"
              />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Suivi individuel
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
              Accompagnement personnalisé par un travailleur social. À domicile ou en ligne, en Mauricie.
            </p>
            <NuxtLink
              to="/accompagnement"
              class="mt-4 inline-block text-center bg-sky-700 hover:bg-sky-600 text-white py-2 px-4 rounded-xl font-semibold shadow transition-colors text-sm"
            >
              En savoir plus
            </NuxtLink>
          </div>

          <div class="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6 border border-teal-100 dark:border-sky-700 flex flex-col">
            <div class="w-full flex justify-center mb-4">
              <ImgCard
                src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/LamarqueGroupe.png"
                alt="Groupes de soutien"
                :width="300"
                :height="200"
                rounded="xl"
              />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Groupes de soutien
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
              Groupes de soutien en Mauricie — prévus en 2026. Faites connaître votre intérêt !
            </p>
            <NuxtLink
              to="/groupe-homme"
              class="mt-4 inline-block text-center bg-sky-700 hover:bg-sky-600 text-white py-2 px-4 rounded-xl font-semibold shadow transition-colors text-sm"
            >
              Faites connaître votre intérêt !
            </NuxtLink>
          </div>

        </div>


      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'Homologation de mandat en Mauricie | Nicolas Lamarque, T.S. — Shawinigan',
  meta: [
    {
      name: 'description',
      content: 'Travailleur social évaluateur à Shawinigan. Évaluation psychosociale complète pour l\'homologation de mandat de protection en Mauricie. Rapide, humain, professionnel. Appelez-moi!'
    }
  ],
})
</script>