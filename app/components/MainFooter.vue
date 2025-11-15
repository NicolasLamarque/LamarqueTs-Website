<template>
  <footer class="bg-sky-950 text-gray-200 py-6">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <div class="mb-4 md:mb-0">
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
