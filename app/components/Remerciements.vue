<template>
  <div class="w-full">
    <!-- Section avec vagues en arrière-plan -->
    <section class="relative py-12 sm:py-16 md:py-24 text-gray-800 dark:text-gray-100 w-full overflow-hidden">
      
      <!-- Arrière-plan avec vagues -->
      <div class="absolute inset-0 bg-slate-100 dark:bg-gray-900">
        <WavesBackground :show-controls-button="true" />
      </div>

      <div class="relative w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        
        <!-- En-tête -->
        <div class="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight mb-4">
            Crédits & Remerciements
          </h1>
          <p class="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Ce site web a été créé grâce à la collaboration et au soutien de nombreuses personnes et technologies
          </p>
        </div>

        <!-- Grille de cartes -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12">
          
          <!-- Carte Remerciements personnels -->
          <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 border border-teal-100 dark:border-sky-700">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-3xl sm:text-4xl">💝</span>
              <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Remerciements Personnels
              </h2>
            </div>
            
            <div class="space-y-6">
              <!-- Épouse -->
              <div class="border-l-4 border-pink-500 pl-4 sm:pl-6 py-2">
                <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Mon Épouse
                </h3>
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  Pour ses précieuses contributions aux textes et créations qui donnent vie à ce site. 
                  Son œil artistique et sa créativité ont été essentiels à la qualité du contenu présenté. <br>Merci mon amour!</br>
                </p>
              </div>

              <!-- Brice Colluci -->
              <div class="border-l-4 border-sky-600 pl-4 sm:pl-6 py-2">
                <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Brice Colluci
                </h3>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  Développeur Web Professionnel
                </p>
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  Pour son mentorat généreux, son expertise technique et son enseignement des technologies web modernes. 
                  Son accompagnement a été déterminant dans l'apprentissage et la réalisation de ce projet. 
                  <br >Merci mon ami! </br>              
                 </p>
              </div>
            </div>
          </div>

          <!-- Carte Intelligence Artificielle -->
          <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 border border-teal-100 dark:border-sky-700">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-3xl sm:text-4xl">🤖</span>
              <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Assistants IA
              </h2>
            </div>
            
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Ce projet a bénéficié de l'assistance de plusieurs intelligences artificielles pour le développement, 
              le débogage et l'optimisation du code :
            </p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
                <span class="text-2xl">🔷</span>
                <span class="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">Claude (Anthropic)</span>
              </div>
              <div class="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
                <span class="text-2xl">🟢</span>
                <span class="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">ChatGPT (OpenAI)</span>
              </div>
              <div class="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
                <span class="text-2xl">🔵</span>
                <span class="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">Gemini (Google)</span>
              </div>
              <div class="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
                <span class="text-2xl">🟣</span>
                <span class="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">DeepSeek</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Carte Technologies (pleine largeur) -->
        <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 border border-teal-100 dark:border-sky-700 mb-8 sm:mb-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl sm:text-4xl">⚙️</span>
            <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Technologies & Frameworks
            </h2>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            <div class="text-center p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
              <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">Nuxt 4</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Framework Vue</p>
            </div>
            <div class="text-center p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
              <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">Vue 3</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Framework JS</p>
            </div>
            <div class="text-center p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
              <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">Tailwind CSS</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Styling</p>
            </div>
            <div class="text-center p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
              <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">DaisyUI</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Composants UI</p>
            </div>
            <div class="text-center p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
              <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">Font Awesome</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Icônes</p>
            </div>
            <div class="text-center p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
              <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">FullCalendar</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Calendrier</p>
            </div>
            <div class="text-center p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
              <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">Drizzle ORM</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Base de données</p>
            </div>
            <div class="text-center p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
              <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">Vercel</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Hébergement</p>
            </div>
            <div class="text-center p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
              <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">TypeScript</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Langage</p>
            </div>
            <div class="text-center p-3 sm:p-4 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors">
              <p class="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">PostgreSQL</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Base de données</p>
            </div>
          </div>
        </div>

        <!-- Carte Licences (pleine largeur avec accent) -->
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 border-2 border-amber-200 dark:border-amber-900/50 mb-8 sm:mb-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl sm:text-4xl">⚖️</span>
            <h2 class="text-xl sm:text-2xl font-semibold text-amber-900 dark:text-amber-200">
              Licences et Mentions Légales
            </h2>
          </div>
          
          <div class="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <div>
              <p class="font-semibold text-base sm:text-lg text-amber-900 dark:text-amber-200 mb-3">
                À propos des licences logicielles
              </p>
              <p class="leading-relaxed">
                Ce site web utilise des logiciels et bibliothèques open source sous diverses licences, 
                notamment MIT, Apache 2.0 et BSD. Nous respectons scrupuleusement les termes de ces licences 
                et remercions chaleureusement tous les contributeurs de la communauté open source.
              </p>
            </div>

            <div>
              <p class="font-semibold text-amber-900 dark:text-amber-200 mb-3">
                Licences des principaux composants :
              </p>
              
              <ul class="space-y-2 pl-4">
                <li class="flex items-start gap-2">
                  <span class="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span><strong>Nuxt.js & Vue.js</strong> - Licence MIT</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span><strong>Tailwind CSS & DaisyUI</strong> - Licence MIT</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span><strong>Font Awesome</strong> - Licence Font Awesome Free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT)</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span><strong>FullCalendar</strong> - Licence MIT</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span><strong>Drizzle ORM</strong> - Licence Apache 2.0</span>
                </li>
              </ul>
            </div>

            <div class="pt-4 border-t border-amber-200 dark:border-amber-800">
              <p class="font-semibold text-amber-900 dark:text-amber-200 mb-3">
                Droits d'auteur du contenu :
              </p>
              <p class="leading-relaxed">
                Le contenu original de ce site (textes, images personnelles, design) est © {{ new Date().getFullYear() }} 
                Nicolas Lamarque. Tous droits réservés. Toute reproduction, distribution ou utilisation 
                non autorisée est strictement interdite sans permission écrite préalable.
              </p>
            </div>
          </div>
        </div>

        <!-- Bouton retour -->
        <div class="text-center">
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 px-4">
            Merci à tous ceux qui ont contribué, directement ou indirectement, à la réalisation de ce projet.
          </p>
          <NuxtLink 
            to="/" 
            class="inline-block bg-sky-700 text-white py-2 sm:py-3 px-5 sm:px-6 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors text-sm sm:text-base"
          >
            Retour à l'accueil
          </NuxtLink>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { useDarkMode } from "../composables/useDarkMode";

const { initTheme } = useDarkMode();
onMounted(() => {
  initTheme();
});

// Meta tags pour SEO
useHead({
  title: 'Crédits et Remerciements - Nicolas Lamarque',
  meta: [
    { 
      name: 'description', 
      content: 'Page de crédits et remerciements pour les personnes et technologies ayant contribué au site de Nicolas Lamarque, travailleur social.' 
    }
  ]
})
</script>