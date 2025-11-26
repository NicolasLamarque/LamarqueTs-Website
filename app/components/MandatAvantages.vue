<template>
  <section class="py-16 px-4 bg-transparent">
    <div class="max-w-6xl mx-auto">
      <h2
        class="text-3xl md:text-4xl font-extrabold text-center text-gray-100 mb-12 tracking-tight"
      >
        {{ titre }}
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(avantage, index) in avantages"
          :key="index"
          class="group bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-sky-700/50 hover:-translate-y-1"
        >
          <div
            class="w-14 h-14 bg-sky-700 dark:bg-sky-600 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
          >
            <!-- Icône Bouclier avec étincelle -->
            <svg
              v-if="index === 0"
              class="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <!-- Contour du bouclier -->
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                class="transition-transform duration-500 group-hover:scale-105"
              ></path>
              <!-- Remplissage bleu du bouclier -->
              <path
                fill="rgb(3 105 161)"
                d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                class="transition-opacity duration-500 opacity-30 group-hover:opacity-50"
              ></path>
              <!-- Étincelle qui clignote -->
              <circle
                cx="16"
                cy="8"
                r="1.5"
                fill="white"
                class="group-hover:animate-ping"
              ></circle>
              <circle
                cx="16"
                cy="8"
                r="1"
                fill="white"
              ></circle>
            </svg>
            
            <!-- Icône Livre avec page qui tourne -->
            <svg
              v-else-if="index === 1"
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <!-- Page gauche (devient blanche au survol) -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13C10.832 18.477 9.246 18 7.5 18S4.168 18.477 3 19.253v-13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253"
                class="transition-all duration-700 text-white/60 group-hover:text-white"
              ></path>
              <!-- Page droite qui tourne (devient pâle au survol) -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                class="transition-all duration-700 origin-left text-white group-hover:[transform:perspective(400px)_rotateY(-25deg)] group-hover:text-white/30"
              ></path>
              <!-- Ligne centrale -->
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13"
                class="text-white"
              ></path>
            </svg>
            
            <!-- Icône Smiley avec sourire qui grandit -->
            <svg
              v-else
              class="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <!-- Cercle du visage -->
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                stroke-width="2"
                class="transition-transform duration-500 group-hover:scale-105"
              ></circle>
              <!-- Oeil gauche -->
              <circle
                cx="9"
                cy="10"
                r="0.5"
                fill="currentColor"
              ></circle>
              <!-- Oeil droit -->
              <circle
                cx="15"
                cy="10"
                r="0.5"
                fill="currentColor"
              ></circle>
              <!-- Bouche qui grandit -->
              <path
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                d="M14.828 14.828a4 4 0 01-5.656 0"
                class="transition-all duration-500 origin-center scale-50 group-hover:scale-100"
              ></path>
            </svg>
          </div>
          <h3
            class="text-xl font-semibold text-gray-100 mb-3 text-center"
          >
            {{ avantage.titre }}
          </h3>
          <p
            class="text-gray-300 text-center leading-relaxed"
          >
            {{ avantage.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  titre: {
    type: String,
    default: "Les avantages de l'homologation accompagnée"
  },
  avantages: {
    type: Array,
    default: () => [
      {
        titre: "Protection bienveillante",
        description: "Assurer le respect de vos volontés dans un cadre sécurisé et humain.",
        iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      },
      {
        titre: "Procédure simplifiée",
        description: "Gagnez du temps en évitant les erreurs administratives et les démarches inutiles.",
        iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      },
      {
        titre: "Soutien empathique",
        description: "Un accompagnement humain dans une période souvent sensible et émotionnelle.",
        iconPath: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      }
    ]
  }
})
</script>