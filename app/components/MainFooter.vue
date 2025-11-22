<template>
 <footer class="bg-sky-950 text-gray-200 py-6 flex-shrink-10 justify-between">
  <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
    <div class="mb-3 md:mb-0">
      <div class="flex-shrink-0">
        <NuxtImg 
          src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" 
          alt="Logo" 
          class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white group-hover:border-gray-300 transition-all duration-300"
        />
      </div>
      <h2 class="text-lg font-bold">Nicolas Lamarque</h2>
      <p class="text-xs text-gray-400">Travailleur social</p>
    </div>
    <nav class="flex space-x-4 mb-3 md:mb-0">
      <NuxtLink to="/" class="hover:text-white">Accueil</NuxtLink>
      <NuxtLink to="/Contact-Page" class="hover:text-white">Contact</NuxtLink>
    </nav>
    <div class="flex space-x-4 text-sm">
      <a href="mailto:info@monsite.com" class="hover:text-white">✉ Email</a>
      <a href="https://www.linkedin.com" target="_blank" class="hover:text-white">🔗 LinkedIn</a>
    </div>
  </div>
  <div class="text-center text-gray-500 mt-3 text-xs">
    © {{ new Date().getFullYear() }} Nicolas Lamarque. Tous droits réservés.
    <br>
    <NuxtLink to="/credits" class="text-xs text-gray-400 hover:text-white">
      Crédits et remerciements
    </NuxtLink>
  </div>
</footer>
</template>

<style scoped>
footer {
  margin: 0 !important;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
</style>