<template>
  <div lang="fr" class="min-h-screen bg-slate-100 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="relative py-12 sm:py-16 md:py-20 px-3 sm:px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8 sm:mb-12">
          <h1
            class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 tracking-tight px-2"
          >
            Accompagnement Individuel
          </h1>
          <p
            class="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2"
          >
            Un service d'accompagnement individuel en mauricie pour explorer vos
            défis personnels et renforcer votre capacité de changement.
          </p>
        </div>

        <!-- Image principale -->
        <carroussel :situations="situations" />
      </div>
    </section>

    <!-- Section Présentation -->
    <section class="py-12 sm:py-16 px-3 sm:px-4">
      <div class="max-w-5xl mx-auto">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 border border-teal-100 dark:border-sky-700"
        >
          <h2
            class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6"
          >
            Qu'est-ce que l'accompagnement individuel?
          </h2>
          <div
            class="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            <p>
              L'accompagnement individuel est une démarche personnalisée qui
              vous permet de prendre du recul sur votre situation, d'identifier
              vos ressources intérieures et de développer vos solutions...celles
              qui sont adaptées à vos besoins spécifiques. Je cherche à trouver
              avec vous votre réponse plutôt que de vous donner la mienne.
            </p>
            <p>
              L'accompagnement peut aller de la gestion du stress et de
              l'anxiété à l'amélioration des relations interpersonnelles, en
              passant par le développement de compétences en communication et en
              résolution de problèmes au quotidien. Parfois un réel besoin de
              support est nécessaire pour traverser certaines périodes de
              transition ou de changement important dans la vie. Avec le temps
              ce support devient moins nécessaire et la personne recommence à
              avancer. Nous avons tous notre rythme, trouvons le vôtre.
            </p>
            <p>
              Dans un cadre confidentiel et sans jugement, nous travaillons
              ensemble à notre rythme pour vous aider à surmonter les obstacles
              qui se dressent sur votre chemin et à atteindre vos objectifs
              personnels.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Bénéfices -->
    <section class="py-12 sm:py-16 px-3 sm:px-4 bg-white dark:bg-gray-800">
      <div class="max-w-6xl mx-auto">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8 sm:mb-12 tracking-tight px-2"
        >
          Les bienfaits de l'accompagnement
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <!-- Bénéfice 1 - Check qui pulse -->
          <div
            class="bg-slate-100 dark:bg-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-teal-100 dark:border-sky-700 group"
          >
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 bg-sky-700 dark:bg-sky-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
            >
              <svg
                class="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:scale-125 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 text-center"
            >
              Clarté et perspective
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed"
            >
              Gagnez en clarté sur vos défis et découvrez de nouvelles
              perspectives pour avancer.
            </p>
          </div>

          <!-- Bénéfice 2 - Éclair qui se remplit -->
          <div
            class="bg-slate-100 dark:bg-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-teal-100 dark:border-sky-700 group"
          >
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 bg-sky-700 dark:bg-sky-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
            >
              <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24">
                <!-- Éclair en outline (toujours visible) -->
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
                <!-- Éclair qui se remplit -->
                <path
                  class="lightning-fill"
                  fill="currentColor"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 text-center"
            >
              Stratégies concrètes
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed"
            >
              Développez des outils pratiques et des stratégies adaptées à votre
              réalité.
            </p>
          </div>
          <!-- Bénéfice 3 - Smile qui bounce -->
          <div
            class="bg-slate-100 dark:bg-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-teal-100 dark:border-sky-700 group"
          >
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 bg-sky-700 dark:bg-sky-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
            >
              <svg
                class="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 text-center"
            >
              Confiance en soi
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed"
            >
              Renforcez votre confiance et votre capacité à faire face aux
              changements.
            </p>
          </div>

          <!-- Bénéfice 4 - Horloge qui tourne -->
          <div
            class="bg-slate-100 dark:bg-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-teal-100 dark:border-sky-700 group"
          >
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 bg-sky-700 dark:bg-sky-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
            >
              <svg
                class="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:rotate-180 transition-transform duration-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 text-center"
            >
              À votre rythme
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed"
            >
              Un accompagnement personnalisé qui respecte votre tempo et vos
              besoins.
            </p>
          </div>

          <!-- Bénéfice 5 - Cadenas qui s'ouvre -->
          <div
            class="bg-slate-100 dark:bg-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-teal-100 dark:border-sky-700 group"
          >
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 bg-sky-700 dark:bg-sky-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
            >
              <svg
                class="w-6 h-6 sm:w-7 sm:h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <!-- Arceau du cadenas qui monte -->
                <path
                  class="lock-shackle"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4"
                />
                <!-- Corps du cadenas (fixe) -->
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 11h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z"
                />
                <!-- Trait vertical (serrure) -->
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2"
                />
              </svg>
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 text-center"
            >
              Confidentialité
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed"
            >
              Un espace sécuritaire où vous pouvez vous exprimer librement et en
              toute confiance.
            </p>
          </div>

          <!-- Bénéfice 6 - Graphique qui grandit -->
          <div
            class="bg-slate-100 dark:bg-gray-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-teal-100 dark:border-sky-700 group"
          >
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 bg-sky-700 dark:bg-sky-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
            >
              <svg
                class="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:scale-y-125 group-hover:-translate-y-1 transition-all duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 text-center"
            >
              Croissance durable
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed"
            >
              Développez des changements durables qui s'intègrent naturellement
              à votre vie.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Déroulement -->
    <section class="py-12 sm:py-16 px-3 sm:px-4">
      <div class="max-w-5xl mx-auto">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-8 sm:mb-12 tracking-tight px-2"
        >
          Comment se déroule l'accompagnement?
        </h2>
        <div class="space-y-4 sm:space-y-6">
          <div
            class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border-l-4 border-sky-700 dark:border-sky-600"
          >
            <h3
              class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3"
            >
              1. Première rencontre
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              Nous prenons le temps de faire connaissance et d'explorer ensemble
              vos besoins, vos attentes et vos objectifs. Cette rencontre nous
              permet d'établir une relation de confiance et de définir le cadre
              de notre collaboration.
            </p>
          </div>

          <div
            class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border-l-4 border-sky-700 dark:border-sky-600"
          >
            <h3
              class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3"
            >
              2. Séances régulières
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              Les rencontres se déroulent à un rythme qui vous convient.
              Ensemble, nous explorons vos défis, identifions vos ressources et
              développons des stratégies concrètes adaptées à votre situation
              unique.
            </p>
          </div>

          <div
            class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border-l-4 border-sky-700 dark:border-sky-600"
          >
            <h3
              class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3"
            >
              3. Suivi et ajustements
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              Nous évaluons régulièrement vos progrès et ajustons notre approche
              selon vos besoins évolutifs. L'accompagnement reste flexible et
              s'adapte à votre cheminement personnel.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section CTA -->
    <section
      class="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-white dark:bg-gray-800"
    >
      <div class="max-w-4xl mx-auto text-center">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 tracking-tight px-2"
        >
          Prêt à commencer votre cheminement?
        </h2>
        <p
          class="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-10 leading-relaxed px-2"
        >
          Contactez-moi dès aujourd'hui pour planifier votre première rencontre
          à Shawinigan. Ensemble, nous pouvons explorer de nouvelles
          possibilités.
        </p>
        <div
          class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2"
        >
          <nuxt-link
            to="/contact-page"
            class="inline-block bg-sky-700 text-white py-3 px-6 sm:px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-sky-600 transition-all duration-500"
          >
            Prendre rendez-vous
          </nuxt-link>
          <nuxt-link
            to="/"
            class="inline-block bg-slate-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-3 px-6 sm:px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-500 border border-teal-100 dark:border-sky-700"
          >
            Retourner à l'accueil
          </nuxt-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const situations = [
  {
    image: "https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/TI1.png",
    titre: "Emcombrement et transition de vie",
    description:
      "Service d’accompagnement psychosocial spécialisé pour les personnes vivant avec situation qui implique une transition de vie. " +
      "Nous offrons des interventions respectueuses et graduelles pour rétablir la sécurité, le bien-être et la dignité dans le milieu de vie.",
  },
  {
    image: "https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/TI2.png",
    titre: "Gestion de l'anxiété",
    description:
      "Un changement d'emploi, un déménagement, une séparation? Je vous accompagne dans ces périodes de transition qui génère du stress et de l'anxiété.",
  },
  {
    image:
      "https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/Service1.png",
    titre: "Relations interpersonnelles",
    description:
      "Améliorez vos relations familiales, amicales ou professionnelles.",
  },
];
useHead({
  title: "Accompagnement Individuel à Shawinigan | Votre Service",
  meta: [
    {
      name: "description",
      content:
        "Service d'accompagnement individuel à Shawinigan par un travailleur social. Un espace bienveillant pour explorer vos défis personnels et développer des stratégies d'adaptation.",
    },
  ],
});
</script>

<style scoped>
/* Animation wiggle pour le cadenas */
@keyframes wiggle {
  0%,
  100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

.animate-wiggle {
  animation: wiggle 0.5s ease-in-out;
}

/* Éclair qui se remplit */
.lightning-fill {
  opacity: 0;
}

.group:hover .lightning-fill {
  animation: lightning-strike 0.8s ease-out forwards;
}

@keyframes lightning-strike {
  0% {
    opacity: 0;
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
  }
  25% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
    clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
  }
  75% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

/* Cadenas qui s'ouvre */
.lock-shackle {
  transition: transform 0.5s ease-in-out;
  transform-origin: center bottom;
}

.group:hover .lock-shackle {
  transform: translateY(-4px);
}
</style>
