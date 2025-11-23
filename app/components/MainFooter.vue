<template>
  <footer class="bg-sky-950 text-gray-200 py-3 w-full flex-shrink-0 text-xs">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      
      <div class="flex flex-wrap justify-between items-center space-y-1 sm:space-y-0 text-xs">
        
        <div class="flex items-center space-x-2">
          <NuxtImg 
            src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" 
            alt="Logo" 
            class="w-6 h-6 rounded-full border border-white" 
          />
          <div>
            <span class="font-semibold leading-none">Nicolas Lamarque</span>
            <span class="hidden sm:inline"> | Travailleur social</span>
          </div>
        </div>

        <div class="flex space-x-3">
          <a href="mailto:info@monsite.com" class="hover:text-white transition-colors duration-200" aria-label="Envoyer un email">
            <span class="text-gray-400">✉</span>
          </a>
          <a href="https://www.linkedin.com" target="_blank" class="hover:text-white transition-colors duration-200" aria-label="Voir le profil LinkedIn">
            <span class="text-gray-400">🔗</span>
          </a>
        </div>
      </div>
      
      <hr class="border-gray-700 my-2">

      <div class="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 space-y-1 sm:space-y-0">
        
        <nav class="flex space-x-2">
          <NuxtLink to="/" class="hover:text-white transition-colors duration-200">Accueil</NuxtLink>
          <span class="text-gray-600">·</span>
          <NuxtLink to="/Contact-Page" class="hover:text-white transition-colors duration-200">Contact</NuxtLink>
        </nav>
        
        <span class="text-center">
          © {{ new Date().getFullYear() }} Tous droits réservés. 
          <NuxtLink to="/credits" class="hover:text-white ml-1">Crédits</NuxtLink>
        </span>
      </div>
    </div>
  </footer>
</template>