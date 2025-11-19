<template>
  <!-- Header global -->
  <header class="bg-sky-800 text-white shadow-xl p-4 flex justify-between items-center">
   
    <!-- Logo / titre -->
            <NuxtLink to="/" class="flex items-center gap-3 sm:gap-4 group">
          <!-- Logo SVG -->
          <div class="flex-shrink-0">
  <NuxtImg 
    src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" 
    alt="Logo" 
    class="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white group-hover:border-gray-300 transition-all duration-300"
  />
</div>
          
          <!-- Texte -->
          <div class="flex flex-col">
            <span class="text-lg sm:text-xl md:text-2xl font-bold text-white transition-colors">
  Nicolas Lamarque, T.S.
</span>
<span class="text-xs sm:text-sm font-normal text-gray-100">
  Travailleur social - Shawinigan | Homologation de mandat
</span>
          </div>
        </NuxtLink>
     
    <!-- Menu desktop -->
    <nav class="hidden md:flex space-x-6">
    <NuxtLink     
  to="/login" 
  class="hover:text-gray-200 flex items-center justify-center"
> <LoginIcon size="24" primaryColor="#00c2b2" accentColor="#80e0d8" />
</NuxtLink>
      <NuxtLink to="/" class="hover:text-gray-200">Accueil</NuxtLink>
      
      <NuxtLink to="/Mandat" class="hover:text-gray-200">Homologation de mandat</NuxtLink>
      <NuxtLink to="/blog" class="hover:text-gray-200">Blog</NuxtLink>
      <NuxtLink to='Contact-Page' class="hover:text-gray-200">Contact</NuxtLink>
       <ThemeSwitch/>
    </nav>

    <!-- Menu mobile -->
    <button @click="toggleMenu" class="md:hidden">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"/>
      </svg>
    </button>
  </header>

  <!-- Menu mobile déroulant -->
  <nav v-if="isMenuOpen" class="md:hidden bg-teal-500 text-white shadow-md p-2">
    <NuxtLink to="/" class="block py-2">Accueil</NuxtLink>
    <NuxtLink to="/blog" class="block py-2">Blog</NuxtLink>
    <NuxtLink to="/contact-page" class="block py-2">Contact</NuxtLink>
    <NuxtLink to="/Mandat" class="block py-2">Homologation de mandat</NuxtLink>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import LoginIcon from '../components/LoginIcon.vue'



// Contrôle l’état du menu mobile
const isMenuOpen = ref(false)
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
</script>
