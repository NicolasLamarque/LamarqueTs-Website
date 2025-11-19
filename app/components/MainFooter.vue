<template>
  <footer class="bg-sky-950 text-gray-200 py-6">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <div class="mb-4 md:mb-0">
        <div class="flex-shrink-0">
  <NuxtImg 
    src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" 
    alt="Logo" 
    class="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white group-hover:border-gray-300 transition-all duration-300"
  />
</div>
        <h2 class="text-xl font-bold">Nicolas Lamarque</h2>
        <p class="text-sm text-gray-400">Travailleur social</p>
      </div>
      <nav class="flex space-x-4 mb-4 md:mb-0">
        <NuxtLink to="/" class="hover:text-white">Accueil</NuxtLink>
        
        
        <NuxtLink to="/Contact-Page" class="hover:text-white">Contact</NuxtLink>
      </nav>
      <div class="flex space-x-4">
        <a href="mailto:info@monsite.com" class="hover:text-white">✉ Email</a>
        <a href="https://www.linkedin.com" target="_blank" class="hover:text-white">🔗 LinkedIn</a>
      </div>

    </div>
    <div class="text-center text-gray-500 mt-4 text-sm">
      © {{ new Date().getFullYear() }} Nicolas Lamarque. Tous droits réservés.
      <br>
    <NuxtLink to="/credits" class="text-sm text-gray-400 hover:text-white">
  Crédits et remerciements
</NuxtLink>
      </br>
  
    </div>
          
  </footer>
</template>
