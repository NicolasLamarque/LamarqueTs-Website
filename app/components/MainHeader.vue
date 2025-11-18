<template>
  <!-- Header global -->
  <header class="bg-sky-800 text-white shadow-xl p-4 flex justify-between items-center">
   
    <!-- Logo / titre -->
            <NuxtLink to="/" class="flex items-center gap-3 sm:gap-4 group">
          <!-- Logo SVG -->
          <div class="flex-shrink-0">
            <svg 
              class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 transition-transform duration-300 group-hover:scale-110" 
              viewBox="0 0 200 200" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="gradCenter" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" style="stop-color:rgb(255,255,200);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:0" />
                </radialGradient>
                
                <linearGradient id="gradBlueViolet" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#4A148C" />
                  <stop offset="100%" style="stop-color:#1565C0" />
                </linearGradient>
                <linearGradient id="gradGreenYellow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#FBC02D" />
                  <stop offset="100%" style="stop-color:#689F38" />
                </linearGradient>
              </defs>
              <path d="M 100 170 Q 150 140 180 100 Q 140 120 100 150 Z" fill="url(#gradBlueViolet)" transform="rotate(-15 100 100)"/>
              <path d="M 100 170 Q 50 140 20 100 Q 60 120 100 150 Z" fill="url(#gradBlueViolet)" transform="rotate(15 100 100)"/>
              
              <path d="M 100 100 L 80 180 Q 100 190 120 180 Z" fill="#6A1B9A"/>
              
              <path d="M 100 70 Q 140 80 170 110 Q 130 100 100 90 Z" fill="#EC407A"/>
              <path d="M 100 70 Q 60 80 30 110 Q 70 100 100 90 Z" fill="#FFB74D"/>
              
              <path d="M 100 30 Q 130 40 160 80 Q 100 60 100 30 Z" fill="url(#gradGreenYellow)" transform="rotate(-10 100 100)"/>
              <path d="M 100 30 Q 70 40 40 80 Q 100 60 100 30 Z" fill="url(#gradGreenYellow)" transform="rotate(10 100 100)"/>
              
              <path d="M 100 10 Q 120 20 100 30 Q 80 20 100 10 Z" fill="#FF9800"/>
              
              <circle cx="100" cy="100" r="25" fill="url(#gradCenter)"/>
            </svg>
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
