<template>
  <!-- Header global - OPTIMISÉ -->
  <header
    class="bg-sky-800 text-white shadow-xl fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300"
    :class="[
      isMenuOpen ? 'h-auto' : '',
      'p-3 sm:p-4 landscape:short:p-2'
    ]"
  >
    <div class="flex justify-between items-center gap-2 sm:gap-4">
      <!-- Logo / titre - OPTIMISÉ -->
      <NuxtLink to="/" class="flex items-center gap-2 sm:gap-3 md:gap-4 group flex-shrink min-w-0">
        <!-- Logo SVG -->
        <div class="flex-shrink-0">
          <NuxtImg
            src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg"
            alt="Logo"
            class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 landscape:short:w-10 landscape:short:h-10 rounded-full border-2 border-white group-hover:border-gray-300 transition-all duration-300"
          />
        </div>

        <!-- Texte - RESPONSIVE -->
        <div class="flex flex-col min-w-0">
          <span
            class="text-sm sm:text-base md:text-lg lg:text-xl landscape:short:text-sm font-bold text-white transition-colors truncate"
          >
            Nicolas Lamarque, T.S.
          </span>
          <span class="text-xs sm:text-sm landscape:short:text-xs font-normal text-gray-100 hidden sm:block truncate">
            Travailleur social - Shawinigan
          </span>
          <!-- Version ultra-courte pour mobile portrait -->
          <span class="text-xs font-normal text-gray-100 sm:hidden truncate">
            T.S. - Shawinigan
          </span>
        </div>
      </NuxtLink>

      <!-- Menu desktop - OPTIMISÉ -->
      <nav class="hidden lg:flex items-center space-x-4 xl:space-x-6 landscape:short:space-x-3">
        <NuxtLink
          to="/login"
          class="hover:text-gray-200 flex items-center justify-center transition-colors"
          title="Connexion"
        >
          <LoginIcon size="24" primaryColor="#00c2b2" accentColor="#80e0d8" />
        </NuxtLink>
        <NuxtLink 
          to="/" 
          class="hover:text-sky-300 transition-colors text-sm xl:text-base landscape:short:text-sm"
        >
          Accueil
        </NuxtLink>
        <NuxtLink 
          to="/mandat" 
          class="hover:text-sky-300 transition-colors text-sm xl:text-base landscape:short:text-sm whitespace-nowrap"
        >
          Homologation
        </NuxtLink>
        <NuxtLink 
          to="/accompagnement" 
          class="hover:text-sky-300 transition-colors text-sm xl:text-base landscape:short:text-sm whitespace-nowrap"
        >
          Suivi
        </NuxtLink>
        <NuxtLink 
          to="/blog" 
          class="hover:text-sky-300 transition-colors text-sm xl:text-base landscape:short:text-sm"
        >
          Blog
        </NuxtLink>
        <NuxtLink 
          to="/contact" 
          class="hover:text-sky-300 transition-colors text-sm xl:text-base landscape:short:text-sm"
        >
          Contact
        </NuxtLink>
        <ThemeSwitch />
      </nav>

      <!-- Boutons mobile - OPTIMISÉS -->
      <div class="lg:hidden flex items-center gap-2 sm:gap-3">
        <!-- Theme switch mobile -->
        <ThemeSwitch class="scale-90 sm:scale-100 landscape:short:scale-75" />
        
        <!-- Bouton hamburger - AMÉLIORÉ -->
        <button 
          @click="toggleMenu" 
          class="p-2 hover:bg-sky-700 rounded-lg transition-colors landscape:short:p-1"
          :aria-label="isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          :aria-expanded="isMenuOpen"
        >
          <!-- Icon hamburger animé -->
          <div class="w-6 h-6 sm:w-7 sm:h-7 landscape:short:w-5 landscape:short:h-5 flex flex-col justify-center items-center gap-1">
            <span 
              class="w-full h-0.5 bg-white transition-all duration-300 rounded-full"
              :class="isMenuOpen ? 'rotate-45 translate-y-1.5' : ''"
            ></span>
            <span 
              class="w-full h-0.5 bg-white transition-all duration-300 rounded-full"
              :class="isMenuOpen ? 'opacity-0' : ''"
            ></span>
            <span 
              class="w-full h-0.5 bg-white transition-all duration-300 rounded-full"
              :class="isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''"
            ></span>
          </div>
        </button>
      </div>
    </div>
  </header>

  <!-- Espaceur pour éviter que le contenu passe sous le header fixe -->
  <div class="h-20 sm:h-24 md:h-28 landscape:short:h-16"></div>

  <!-- Menu mobile déroulant - AMÉLIORÉ -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4"
  >
    <nav 
      v-if="isMenuOpen" 
      class="lg:hidden bg-sky-700 dark:bg-sky-900 text-white shadow-2xl fixed top-20 sm:top-24 md:top-28 landscape:short:top-16 left-0 right-0 z-40 border-t border-sky-600"
    >
      <div class="max-h-[calc(100vh-5rem)] landscape:short:max-h-[calc(100vh-4rem)] overflow-y-auto py-2 landscape:short:py-1">
        <NuxtLink 
          to="/" 
          class="block py-3 px-6 landscape:short:py-2 landscape:short:px-4 hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors border-b border-sky-600/50"
          @click="closeMenu"
        >
          <span class="flex items-center gap-3">
            <svg class="w-5 h-5 landscape:short:w-4 landscape:short:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Accueil
          </span>
        </NuxtLink>

        <NuxtLink 
          to="/mandat" 
          class="block py-3 px-6 landscape:short:py-2 landscape:short:px-4 hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors border-b border-sky-600/50"
          @click="closeMenu"
        >
          <span class="flex items-center gap-3">
            <svg class="w-5 h-5 landscape:short:w-4 landscape:short:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Homologation de Mandat
          </span>
        </NuxtLink>

        <NuxtLink 
          to="/accompagnement" 
          class="block py-3 px-6 landscape:short:py-2 landscape:short:px-4 hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors border-b border-sky-600/50"
          @click="closeMenu"
        >
          <span class="flex items-center gap-3">
            <svg class="w-5 h-5 landscape:short:w-4 landscape:short:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Suivi Psychosocial
          </span>
        </NuxtLink>

        <NuxtLink 
          to="/blog" 
          class="block py-3 px-6 landscape:short:py-2 landscape:short:px-4 hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors border-b border-sky-600/50"
          @click="closeMenu"
        >
          <span class="flex items-center gap-3">
            <svg class="w-5 h-5 landscape:short:w-4 landscape:short:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            Blog
          </span>
        </NuxtLink>

        <NuxtLink 
          to="/contact" 
          class="block py-3 px-6 landscape:short:py-2 landscape:short:px-4 hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors border-b border-sky-600/50"
          @click="closeMenu"
        >
          <span class="flex items-center gap-3">
            <svg class="w-5 h-5 landscape:short:w-4 landscape:short:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Contact
          </span>
        </NuxtLink>

        <NuxtLink 
          to="/login" 
          class="block py-3 px-6 landscape:short:py-2 landscape:short:px-4 hover:bg-sky-600 dark:hover:bg-sky-800 transition-colors"
          @click="closeMenu"
        >
          <span class="flex items-center gap-3">
            <LoginIcon size="20" primaryColor="#00c2b2" accentColor="#80e0d8" class="landscape:short:scale-75" />
            Connexion
          </span>
        </NuxtLink>
      </div>
    </nav>
  </Transition>

  <!-- Overlay pour fermer le menu en cliquant à l'extérieur -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isMenuOpen" 
      class="lg:hidden fixed inset-0 bg-black/50 z-30"
      @click="closeMenu"
      aria-hidden="true"
    ></div>
  </Transition>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import LoginIcon from "../components/LoginIcon.vue";

const route = useRoute();

// Contrôle l'état du menu mobile
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  // Empêcher le scroll du body quand le menu est ouvert
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};

// Fermer le menu quand on change de page
watch(() => route.path, () => {
  closeMenu();
});

// Cleanup quand le composant est détruit
onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Assure que le menu mobile s'affiche au-dessus de tout */
nav {
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
</style>