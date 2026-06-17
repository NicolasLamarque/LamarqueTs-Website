<template>
  <footer class="bg-sky-950 text-gray-200 py-3 sm:py-4 landscape:short:py-2 w-full flex-shrink-0">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      
      <!-- Section principale -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 landscape:short:gap-2">
        
        <!-- Logo + Nom + Mots-clés SEO -->
        <div class="flex items-center gap-2 sm:gap-3">
          <NuxtImg 
            src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg"
            alt="Logo"
            class="w-6 h-6 sm:w-7 sm:h-7 landscape:short:w-5 landscape:short:h-5 rounded-full border border-white flex-shrink-0"
          />
          <div class="text-xs sm:text-sm landscape:short:text-xs">
            <span class="font-semibold">Nicolas Lamarque</span>
            <span class="text-gray-400"> | Travailleur social</span>
            <span class="block text-gray-500 text-[10px] sm:text-xs mt-0.5">
              Shawinigan · Trois-Rivières · Mauricie · Québec
            </span>
            <span class="block text-gray-600 text-[9px] sm:text-[10px] mt-0.5">
              Évaluation psychosociale · Homologation de mandat
            </span>
          </div>
        </div>

        <!-- Email seulement -->
        <div class="flex items-center gap-3 sm:gap-4 landscape:short:gap-2">
          <a
            href="mailto:lamarquats@outlook.com"
            class="hover:text-white transition-colors duration-200 hover:scale-110 transform"
            aria-label="Envoyer un email"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6 landscape:short:w-4 landscape:short:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </a>
        </div>
      </div>

      <!-- Séparateur -->
      <hr class="border-gray-700 my-2 sm:my-3 landscape:short:my-1.5">

      <!-- Navigation + Copyright -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 landscape:short:gap-1 text-xs landscape:short:text-[10px] text-gray-400">

        <!-- Navigation -->
        <nav class="flex flex-wrap justify-center sm:justify-start gap-x-2 gap-y-1">
          <NuxtLink to="/" class="hover:text-white transition-colors duration-200">
            Accueil
          </NuxtLink>
          <span class="text-gray-600">·</span>
          <NuxtLink to="/contact" class="hover:text-white transition-colors duration-200">
            Contact
          </NuxtLink>
          <span class="text-gray-600">·</span>
          <NuxtLink to="/politique-confidentialite" class="hover:text-white transition-colors duration-200">
            Confidentialité
          </NuxtLink>
          <span class="text-gray-600">·</span>
          <button
            @click="openCookieSettings"
            class="hover:text-white transition-colors duration-200"
          >
            Cookies
          </button>
        </nav>

        <!-- Copyright -->
        <div class="text-center whitespace-nowrap">
          © {{ new Date().getFullYear() }}
          <span class="hidden sm:inline">Tous droits réservés.</span>
          <NuxtLink to="/credits" class="hover:text-white ml-1 transition-colors">
            Crédits
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const openCookieSettings = () => {
  const consent = useCookie('cookie-consent')
  consent.value = null
  window.location.reload()
}
</script>