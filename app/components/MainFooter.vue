<template>
  <footer class="bg-sky-950 text-gray-200 py-6 mt-12">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <div class="mb-4 md:mb-0">
        <h2 class="text-xl font-bold">Mon Site</h2>
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
    </div>
  </footer>
</template>
