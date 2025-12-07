<template>
  <div class="min-h-screen bg-slate-100 dark:bg-gray-900">
    <!-- Background fixe avec vagues -->
    <div class="fixed inset-0 bg-slate-100 dark:bg-gray-900 z-0">
      <WavesBackground />
    </div>

    <!-- Contenu principal au-dessus du background -->
    <div class="relative z-[1]">
      <!-- Header -->
      <section class="py-12 sm:py-16 landscape:short:py-8 px-4">
        <div class="max-w-6xl mx-auto">
          <div
            class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-sky-700"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="bg-sky-600 p-3 rounded-xl">
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1
                  class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100"
                >
                  Déclaration Sous Serment
                </h1>
                <p
                  class="text-sm sm:text-base text-gray-600 dark:text-gray-400"
                >
                  Homologation de Mandat de Protection
                </p>
              </div>
            </div>

            <div
              class="bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-600 p-4 rounded-lg"
            >
              <div class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-sky-600 dark:text-sky-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div class="text-sm text-sky-900 dark:text-sky-300">
                  <p class="font-semibold mb-1">
                    Outil confidentiel et sécurisé
                  </p>
                  <p>
                    Aucune donnée n'est collectée. Ce formulaire génère un
                    document à imprimer et à faire signer devant un commissaire
                    à l'assermentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Options principales -->
      <section class="py-8 sm:py-12 landscape:short:py-6 px-4">
        <div class="max-w-6xl mx-auto">
          <div
            class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-sky-700"
          >
            <h2
              class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3"
            >
              <svg
                class="w-6 h-6 text-sky-600 dark:text-sky-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Type de mandat
            </h2>

            <div class="grid md:grid-cols-2 gap-4 mb-6">
              <button
                @click="typeMandat = 'notarie'"
                :class="[
                  'p-6 rounded-xl border-2 transition-all duration-300 text-left',
                  typeMandat === 'notarie'
                    ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-600 dark:border-sky-500 shadow-lg'
                    : 'bg-white dark:bg-gray-700/30 border-gray-300 dark:border-gray-600 hover:border-sky-400 dark:hover:border-sky-500',
                ]"
              >
                <div class="flex items-start gap-3">
                  <div
                    :class="[
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1',
                      typeMandat === 'notarie'
                        ? 'border-sky-600 dark:border-sky-400 bg-sky-600 dark:bg-sky-500'
                        : 'border-gray-400 dark:border-gray-500',
                    ]"
                  >
                    <div
                      v-if="typeMandat === 'notarie'"
                      class="w-3 h-3 bg-white rounded-full"
                    ></div>
                  </div>
                  <div>
                    <h3
                      class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2"
                    >
                      Mandat Notarié
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Le mandat a été signé devant un notaire (acte notarié en
                      minute)
                    </p>
                  </div>
                </div>
              </button>

              <button
                @click="typeMandat = 'holographe'"
                :class="[
                  'p-6 rounded-xl border-2 transition-all duration-300 text-left',
                  typeMandat === 'holographe'
                    ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-600 dark:border-sky-500 shadow-lg'
                    : 'bg-white dark:bg-gray-700/30 border-gray-300 dark:border-gray-600 hover:border-sky-400 dark:hover:border-sky-500',
                ]"
              >
                <div class="flex items-start gap-3">
                  <div
                    :class="[
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1',
                      typeMandat === 'holographe'
                        ? 'border-sky-600 dark:border-sky-400 bg-sky-600 dark:bg-sky-500'
                        : 'border-gray-400 dark:border-gray-500',
                    ]"
                  >
                    <div
                      v-if="typeMandat === 'holographe'"
                      class="w-3 h-3 bg-white rounded-full"
                    ></div>
                  </div>
                  <div>
                    <h3
                      class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2"
                    >
                      Holographe *signé devant Témoins
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Le mandat a été signé devant deux témoins (acte sous seing
                      privé)
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <!-- Options d'évaluation -->
            <div
              class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
            >
              <h3
                class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5 text-sky-600 dark:text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Demandes d'évaluation
              </h3>

              <div class="space-y-3">
                <label class="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    v-model="demandeEvaluationPsycho"
                    class="w-5 h-5 rounded border-gray-400 dark:border-gray-500 text-sky-600 focus:ring-sky-500 focus:ring-offset-0 dark:focus:ring-offset-gray-800 mt-0.5"
                  />
                  <div>
                    <span
                      class="text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                      >Demander l'évaluation psychosociale</span
                    >
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Réalisée par un travailleur social
                    </p>
                  </div>
                </label>

                <label class="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    v-model="demandeEvaluationMedicale"
                    class="w-5 h-5 rounded border-gray-400 dark:border-gray-500 text-sky-600 focus:ring-sky-500 focus:ring-offset-0 dark:focus:ring-offset-gray-800 mt-0.5"
                  />
                  <div>
                    <span
                      class="text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                      >Demander l'évaluation médicale</span
                    >
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Réalisée par un médecin
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Formulaire -->
      <section class="py-8 sm:py-12 landscape:short:py-6 px-4">
        <div class="max-w-6xl mx-auto">
          <div
            class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-sky-700"
          >
            <div class="space-y-8">
              <!-- Section Témoin Déclarant (seulement pour holographe) -->
              <div v-if="typeMandat === 'holographe'">
                <div
                  class="flex items-center gap-3 mb-6 pb-3 border-b-2 border-sky-200 dark:border-sky-700"
                >
                  <svg
                    class="w-6 h-6 text-sky-600 dark:text-sky-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <h2
                    class="text-xl font-bold text-gray-800 dark:text-gray-100"
                  >
                    Témoin Déclarant
                  </h2>
                  <span class="text-xs text-gray-500 dark:text-gray-400"
                    >(Celui qui fait la déclaration)</span
                  >
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Nom complet du témoin *
                    </label>
                    <input
                      v-model="formData.nomTemoin"
                      type="text"
                      placeholder="Prénom et nom"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/50 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Adresse complète du témoin *
                    </label>
                    <input
                      v-model="formData.adresseTemoin"
                      type="text"
                      placeholder="Numéro, rue, ville, code postal"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/50 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <!-- Section Mandant -->
              <div>
                <div
                  class="flex items-center gap-3 mb-6 pb-3 border-b-2 border-green-200 dark:border-green-700"
                >
                  <svg
                    class="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <h2
                    class="text-xl font-bold text-gray-800 dark:text-gray-100"
                  >
                    Mandant
                  </h2>
                  <span class="text-xs text-gray-500 dark:text-gray-400"
                    >(Personne protégée)</span
                  >
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Nom du mandant *
                    </label>
                    <input
                      v-model="formData.nomMandant"
                      type="text"
                      placeholder="Nom de la personne protégée"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-500/50 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Adresse du mandant *
                    </label>
                    <input
                      v-model="formData.adresseMandant"
                      type="text"
                      placeholder="Adresse complète"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-500/50 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <!-- Section Mandataire -->
              <div>
                <div
                  class="flex items-center gap-3 mb-6 pb-3 border-b-2 border-purple-200 dark:border-purple-700"
                >
                  <svg
                    class="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <h2
                    class="text-xl font-bold text-gray-800 dark:text-gray-100"
                  >
                    Mandataire
                  </h2>
                  <span class="text-xs text-gray-500 dark:text-gray-400"
                    >(Vous)</span
                  >
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Votre nom (mandataire) *
                    </label>
                    <input
                      v-model="formData.nomMandataire"
                      type="text"
                      placeholder="Votre nom complet"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/50 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Votre adresse *
                    </label>
                    <input
                      v-model="formData.adresseMandataire"
                      type="text"
                      placeholder="Votre adresse complète"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/50 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <!-- Section Signature du Mandat (holographe uniquement) -->
              <div v-if="typeMandat === 'holographe'">
                <div
                  class="flex items-center gap-3 mb-6 pb-3 border-b-2 border-orange-200 dark:border-orange-700"
                >
                  <svg
                    class="w-6 h-6 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h2
                    class="text-xl font-bold text-gray-800 dark:text-gray-100"
                  >
                    Signature du Mandat
                  </h2>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Lieu de signature *
                    </label>
                    <input
                      v-model="formData.lieuSignature"
                      type="text"
                      placeholder="Ville"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/50 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Date de signature *
                    </label>
                    <input
                      v-model="formData.dateSignature"
                      type="date"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/50 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Nom de l'autre témoin *
                    </label>
                    <input
                      v-model="formData.nomAutreTemoin"
                      type="text"
                      placeholder="Nom du 2e témoin"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/50 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <!-- Section Notaire/Détails -->
              <div>
                <div
                  class="flex items-center gap-3 mb-6 pb-3 border-b-2 border-indigo-200 dark:border-indigo-700"
                >
                  <svg
                    class="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h2
                    class="text-xl font-bold text-gray-800 dark:text-gray-100"
                  >
                    Détails du Mandat
                  </h2>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                  <div v-if="typeMandat === 'notarie'">
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Nom du notaire *
                    </label>
                    <input
                      v-model="formData.nomNotaire"
                      type="text"
                      placeholder="Me [Nom]"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/50 transition-all outline-none"
                    />
                  </div>
                  <div v-if="typeMandat === 'notarie'">
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Numéro de minute *
                    </label>
                    <input
                      v-model="formData.numeroMinute"
                      type="text"
                      placeholder="Ex: 12345"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/50 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Date du mandat *
                    </label>
                    <input
                      v-model="formData.dateMandat"
                      type="date"
                      class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/50 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <!-- Option Travailleur Social -->
              <div
                class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
              >
                <label class="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    v-model="inclureNomTS"
                    class="w-5 h-5 rounded border-gray-400 dark:border-gray-500 text-sky-600 focus:ring-sky-500 focus:ring-offset-0 dark:focus:ring-offset-gray-800 mt-0.5"
                  />
                  <div class="flex-1">
                    <span
                      class="text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors font-semibold"
                      >Inclure le nom du travailleur social</span
                    >
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Si vous connaissez déjà le TS assigné au dossier
                    </p>
                    <p class="text-gray-500 italic mt-2">
                      Vous pouvez indiquer le nom du travailleur social à qui
                      vous remettrez l’affidavit. Sachez toutefois que cela est
                      optionnel et que cette mention est limitative, notamment
                      si la situation évolue et qu’un autre TS doit être mandaté
                      au cours de la démarche.
                    </p>
                    <div v-if="inclureNomTS" class="mt-4">
                      <input
                        v-model="formData.nomTS"
                        type="text"
                        placeholder="Nom du travailleur social"
                        class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-500/50 transition-all outline-none"
                      />
                    </div>
                  </div>
                </label>
              </div>

              <!-- Action Buttons -->
              <div
                class="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-200 dark:border-gray-700"
              >
                <button
                  @click="showPreview = !showPreview"
                  :disabled="!isFormComplete"
                  class="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {{ showPreview ? "Masquer l'aperçu" : "Aperçu du document" }}
                </button>
                <button
                  @click="generateDocument"
                  :disabled="!isFormComplete"
                  class="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Télécharger le document
                </button>
              </div>

              <div
                v-if="!isFormComplete"
                class="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg"
              >
                <p class="text-sm text-amber-800 dark:text-amber-300">
                  Veuillez remplir tous les champs requis pour générer le
                  document.
                </p>
              </div>
            </div>

            <!-- Preview -->
            <div
              v-if="showPreview && isFormComplete"
              class="mt-8 pt-8 border-t-2 border-gray-200 dark:border-gray-700"
            >
              <div
                class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3
                  class="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2"
                >
                  <svg
                    class="w-5 h-5 text-sky-600 dark:text-sky-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  APERÇU DU DOCUMENT
                </h3>
                <div
                  class="space-y-4 text-gray-700 dark:text-gray-300 text-sm font-mono whitespace-pre-wrap bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-600 max-h-96 overflow-y-auto custom-scrollbar"
                >
                  {{ previewContent }}
                </div>
              </div>
            </div>

            <!-- Instructions -->
            <div
              class="mt-8 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-lg"
            >
              <div class="flex items-start gap-3">
                <svg
                  class="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 class="font-bold text-green-800 dark:text-green-300 mb-2">
                    Prochaines étapes
                  </h3>
                  <ol
                    class="list-decimal list-inside space-y-2 text-sm text-green-700 dark:text-green-200"
                  >
                    <li>
                      Rédigez l'affidavit pour l'homologation du mandat de
                      protection
                    </li>
                    <li v-if="typeMandat === 'holographe'">
                      Le témoin doit signer l'affidavit si requis
                    </li>
                    <li>
                      Si vous le faites assermenter :
                      <a
                        href="https://www.assermentation.justice.gouv.qc.ca/ServicesPublicsConsultation/Commissaires/Proximite/Criteres.aspx"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-sky-700 dark:text-sky-400 underline hover:text-sky-900 dark:hover:text-sky-300"
                        >prenez rendez‑vous avec un commissaire à
                        l’assermentation (≈ 5 $)</a
                      >
                    </li>
                    <li>
                      Le commissaire complétera et signera la section
                      d'assermentation
                    </li>
                    <li>
                      Remettez l'affidavit au travailleur social, au médecin
                      évaluateur ou au notaire selon le processus choisi
                    </li>
                    <li>
                      Indiquez dans l'affidavit le nom du notaire si vous l'avez
                      consulté
                    </li>
                    <li>
                      Le mandat original doit être disponible pour les
                      démarches, surtout si vous utilisez l'option
                      assermentation
                    </li>
                  </ol>
                  
                  <p class="mt-4 text-sm text-green-700 dark:text-green-200">
                    <strong>!</strong> Génère un exemple de lettre seulement. Même s'il est vrai que l'on peut remettre l'affidavit directement au travailleur social, il est recommandé de consulter un professionnel du droit pour s'assurer que le document répond aux exigences légales spécifiques à votre situation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bouton retour -->
      <section class="py-8 px-4">
        <div class="max-w-6xl mx-auto text-center">
          <nuxt-link
            to="/mandat"
            class="inline-flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-100 px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all border border-gray-200 dark:border-sky-700"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour à la page Mandat
          </nuxt-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const typeMandat = ref("notarie");
const demandeEvaluationPsycho = ref(false);
const demandeEvaluationMedicale = ref(false);
const inclureNomTS = ref(false);
const showPreview = ref(false);

const formData = ref({
  nomTemoin: "",
  adresseTemoin: "",
  lieuSignature: "",
  dateSignature: "",
  nomMandant: "",
  nomAutreTemoin: "",
  numeroMinute: "",
  dateMandat: "",
  adresseMandant: "",
  nomMandataire: "",
  adresseMandataire: "", // Corrigé : était "nomadresseMandataire" dans le template
  nomNotaire: "",
  nomTS: "",
});

const isFormComplete = computed(() => {
  const base =
    formData.value.nomMandant &&
    formData.value.adresseMandant &&
    formData.value.nomMandataire &&
    formData.value.adresseMandataire &&
    formData.value.dateMandat;

  if (typeMandat.value === "notarie") {
    return base && formData.value.nomNotaire && formData.value.numeroMinute;
  } else {
    return (
      base &&
      formData.value.nomTemoin &&
      formData.value.adresseTemoin &&
      formData.value.lieuSignature &&
      formData.value.dateSignature &&
      formData.value.nomAutreTemoin
    );
  }
});

const previewContent = computed(() => {
  if (!isFormComplete.value) return "";

  let evaluationText = "";
  if (demandeEvaluationPsycho.value && demandeEvaluationMedicale.value) {
    evaluationText =
      "d'une évaluation médicale et d'une évaluation psychosociale";
  } else if (demandeEvaluationPsycho.value) {
    evaluationText = "d'une évaluation psychosociale";
  } else if (demandeEvaluationMedicale.value) {
    evaluationText = "d'une évaluation médicale";
  }

  if (typeMandat.value === "notarie") {
    return `DÉCLARATION SOUS SERMENT DU DEMANDEUR
(AFFIDAVIT)

Je soussigné(e), ${formData.value.nomMandataire}, résidant au ${formData.value.adresseMandataire}, déclare sous serment ce qui suit :

1. Je suis le/la mandataire de ${formData.value.nomMandant}, nommé(e) à cette fonction aux termes d'un mandat de protection reçu devant ${formData.value.nomNotaire}, notaire, le ${formData.value.dateMandat}, sous le numéro ${formData.value.numeroMinute} de ses minutes;

2. J'entends demander l'homologation du mandat de protection de ${formData.value.nomMandant};

${evaluationText ? `3. Je requiers à cette fin la tenue ${evaluationText} concernant ${formData.value.nomMandant}, conformément aux dispositions du Code civil du Québec;` : ""}

${evaluationText && inclureNomTS.value ? `4. Je demande que ces évaluations soient acheminées directement à ${formData.value.nomTS}, travailleur social.` : evaluationText ? `4. Je demande que ces évaluations soient acheminées au professionnel responsable.` : ""}

EN FOI DE QUOI J'AI SIGNÉ :

Signature du déclarant : ____________________________


Attestation du serment

Déclaré sous serment devant moi,
à __________________, ce ________________.

____________________________
Commissaire à l'assermentation
Numéro: __________________`;
  } else {
    return `DÉCLARATION SOUS SERMENT
Mandat de Protection

Je soussigné(e), ${formData.value.nomTemoin}, domicilié(e) au ${formData.value.adresseTemoin}, déclare sous serment ce qui suit :

1) Je suis l'un des témoins à la signature du mandat de protection de ${formData.value.nomMandant}, signé devant témoins à ${formData.value.lieuSignature}, le ${formData.value.dateSignature}.

2) Je connais personnellement le mandant et déclare que celui-ci était apte lors de la signature de son mandat de protection.

3) Je n'ai pas d'intérêt dans ledit mandat de protection.

4) Le mandant a signé son mandat de protection en ma présence et en présence de ${formData.value.nomAutreTemoin}, et nous avons tous deux signé comme témoins en présence du mandant.

5) Moi et l'autre témoin étions tous deux aptes lors de la signature dudit mandat de protection.

INFORMATIONS COMPLÉMENTAIRES

Mandant: ${formData.value.nomMandant}
Adresse: ${formData.value.adresseMandant}

Mandataire: ${formData.value.nomMandataire}
Adresse: ${formData.value.adresseMandataire}

Date du mandat: ${formData.value.dateMandat}

${evaluationText ? `\nDemande d'évaluation: ${evaluationText}` : ""}
${inclureNomTS.value ? `\nTravailleur social: ${formData.value.nomTS}` : ""}

____________________________
Signature du témoin déclarant

____________________________
Date

À FAIRE SIGNER PAR UN COMMISSAIRE À L'ASSERMENTATION

Assermenté devant moi à __________________, ce ________ jour de ____________ 20__

____________________________
Commissaire à l'assermentation
Numéro: __________________`;
  }
});

const generateDocument = () => {
  const content = previewContent.value;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Declaration_Serment_${formData.value.nomMandant.replace(/\s+/g, "_")}_${typeMandat.value}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
/* Scrollbar personnalisée */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(229, 231, 235, 0.3);
  border-radius: 10px;
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #0369a1, #0284c7);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #0284c7, #0ea5e9);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #0284c7 rgba(229, 231, 235, 0.3);
}

.dark .custom-scrollbar {
  scrollbar-color: #0284c7 rgba(31, 41, 55, 0.5);
}
</style>
