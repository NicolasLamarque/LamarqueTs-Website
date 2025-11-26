<template>
  <Teleport to="body">
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-2xl border-t border-gray-200 z-50 animate-slide-up"
    >
      <div class="container mx-auto px-4 py-6 max-w-6xl">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <!-- Texte -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Gestion des cookies
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Nous utilisons uniquement des cookies essentiels pour le bon fonctionnement du site. 
              Nous n'utilisons pas Google Analytics ni aucun outil de suivi. 
              <NuxtLink 
                to="/politique-confidentialite" 
                class="text-blue-600 hover:underline"
              >
                En savoir plus
              </NuxtLink>
            </p>
          </div>

          <!-- Boutons -->
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              @click="acceptCookies"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Accepter
            </button>
            <button
              @click="rejectCookies"
              class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors whitespace-nowrap dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Refuser
            </button>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const showBanner = ref(false)
const COOKIE_NAME = 'cookie-consent'
const COOKIE_EXPIRY_DAYS = 365

// Vérifier si le consentement existe déjà
onMounted(() => {
  const consent = useCookie(COOKIE_NAME)
  if (!consent.value) {
    showBanner.value = true
  }
})

// Accepter les cookies
const acceptCookies = () => {
  const consent = useCookie(COOKIE_NAME, {
    maxAge: 60 * 60 * 24 * COOKIE_EXPIRY_DAYS, // 1 an
    sameSite: 'lax',
    secure: true
  })
  
  consent.value = JSON.stringify({
    necessary: true,
    analytics: false, // Mettez true si vous utilisez Google Analytics
    timestamp: new Date().toISOString()
  })
  
  showBanner.value = false
}

// Refuser les cookies (accepter seulement les essentiels)
const rejectCookies = () => {
  const consent = useCookie(COOKIE_NAME, {
    maxAge: 60 * 60 * 24 * COOKIE_EXPIRY_DAYS,
    sameSite: 'lax',
    secure: true
  })
  
  consent.value = JSON.stringify({
    necessary: true,
    analytics: false,
    timestamp: new Date().toISOString()
  })
  
  showBanner.value = false
}

// Exposer une fonction pour rouvrir la bannière (utilisable depuis le footer)
defineExpose({
  openBanner: () => {
    showBanner.value = true
  }
})
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>