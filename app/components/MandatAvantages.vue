<template>
  <section class="py-16 px-4 bg-white dark:bg-gray-800">
    <div class="max-w-6xl mx-auto">
      <h2
        class="text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-12 tracking-tight"
      >
        {{ titre }}
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(avantage, index) in avantages"
          :key="index"
          class="bg-slate-100 dark:bg-gray-900 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-teal-100 dark:border-sky-700"
        >
          <div
            class="w-14 h-14 bg-sky-700 dark:bg-sky-600 rounded-full flex items-center justify-center mb-6 mx-auto"
          >
            <svg
              class="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="avantage.iconPath"
              ></path>
            </svg>
          </div>
          <h3
            class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 text-center"
          >
            {{ avantage.titre }}
          </h3>
          <p
            class="text-gray-600 dark:text-gray-300 text-center leading-relaxed"
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
        titre: "Sécurité juridique",
        description: "Garantissez la validité et la légalité de votre mandat grâce à un accompagnement professionnel.",
        iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      },
      {
        titre: "Procédure simplifiée",
        description: "Gagnez du temps en évitant les erreurs administratives et les démarches inutiles.",
        iconPath: "M13 10V3L4 14h7v7l9-11h-7z"
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