<template>
  <footer class="bg-sky-950 text-gray-200 py-3 sm:py-4 landscape:short:py-2 w-full flex-shrink-0">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      
      <!-- Section principale -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 landscape:short:gap-2">
        
        <!-- Logo + Nom -->
        <div class="flex items-center gap-2 sm:gap-3">
          <NuxtImg 
            src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" 
            alt="Logo" 
            class="w-6 h-6 sm:w-7 sm:h-7 landscape:short:w-5 landscape:short:h-5 rounded-full border border-white flex-shrink-0" 
          />
          <div class="text-xs sm:text-sm landscape:short:text-xs">
            <span class="font-semibold block sm:inline">Nicolas Lamarque</span>
            <span class="hidden md:inline text-gray-400"> | Travailleur social</span>
          </div>
        </div>

        <!-- Réseaux sociaux -->
        <div class="flex items-center gap-3 sm:gap-4 landscape:short:gap-2">
          <a 
            href="mailto:info@monsite.com" 
            class="hover:text-white transition-colors duration-200 hover:scale-110 transform" 
            aria-label="Envoyer un email"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6 landscape:short:w-4 landscape:short:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </a>
          <a 
            href="https://www.linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="hover:text-white transition-colors duration-200 hover:scale-110 transform" 
            aria-label="Voir le profil LinkedIn"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6 landscape:short:w-4 landscape:short:h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
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
// Fonction pour rouvrir la bannière de cookies
const openCookieSettings = () => {
  const consent = useCookie('cookie-consent')
  consent.value = null
  window.location.reload()
}
</script>