<template>
  <div class="w-full">
    <!-- Section avec vagues en arrière-plan -->
    <section class="relative py-12 sm:py-16 md:py-24 text-gray-800 dark:text-gray-100 w-full overflow-hidden">
      
      <!-- Arrière-plan avec vagues -->
      <div class="absolute inset-0 bg-slate-100 dark:bg-gray-900">
        <WavesBackground :show-controls-button="true" />
      </div>

      <div class="relative w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        
        <!-- En-tête -->
        <div class="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight mb-4">
            Politique de Confidentialité
          </h1>
          <p class="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Protection de vos renseignements personnels et respect de votre vie privée
          </p>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
            Dernière mise à jour : {{ new Date().toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
        </div>

        <!-- Grille de cartes -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12">
          
          <!-- Carte Engagement professionnel -->
          <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 border border-teal-100 dark:border-sky-700">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-3xl sm:text-4xl">🛡️</span>
              <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Notre Engagement
              </h2>
            </div>
            
            <div class="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                En tant que travailleur social membre de l'<strong>Ordre des travailleurs sociaux et des thérapeutes conjugaux 
                et familiaux du Québec (OTSTCFQ)</strong>, je suis soumis à des obligations déontologiques strictes 
                en matière de confidentialité.
              </p>
              <p>
                La protection de vos renseignements personnels n'est pas seulement une obligation légale, 
                c'est un pilier fondamental de la relation de confiance thérapeutique.
              </p>
              <div class="border-l-4 border-teal-500 pl-4 sm:pl-6 py-2 mt-4 bg-teal-50 dark:bg-gray-700 rounded">
                <p class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Conformité légale
                </p>
                <p class="text-sm">
                  Cette politique respecte la <strong>Loi 25</strong> du Québec sur la protection des renseignements personnels 
                  et le <a href="https://www.legisquebec.gouv.qc.ca/fr/document/rc/C-26,%20r.%20286%20/" target="_blank" rel="noopener noreferrer" class="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 underline font-semibold">Code de déontologie de l'OTSTCFQ</a>.
                </p>
                <p class="text-xs mt-2 text-gray-600 dark:text-gray-400">
                  📖 Consultez aussi le <a href="https://www.otstcfq.org/documentation/guide-de-reference-pour-linterpretation-du-code-de-deontologie-des-membres-de-lotstcfq/" target="_blank" rel="noopener noreferrer" class="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline">Guide d'interprétation du Code de déontologie</a>
                </p>
              </div>
            </div>
          </div>

          <!-- Carte Collecte d'informations -->
          <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 border border-teal-100 dark:border-sky-700">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-3xl sm:text-4xl">📋</span>
              <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Informations Collectées
              </h2>
            </div>
            
            <div class="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              <div class="border-l-4 border-sky-600 pl-4 sm:pl-6 py-2">
                <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Lors de la prise de contact
                </h3>
                <ul class="space-y-1 text-sm">
                  <li>• Nom et coordonnées</li>
                  <li>• Motif de consultation</li>
                  <li>• Informations de contact préférées</li>
                </ul>
              </div>

              <div class="border-l-4 border-purple-600 pl-4 sm:pl-6 py-2">
                <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Durant le suivi professionnel
                </h3>
                <ul class="space-y-1 text-sm">
                  <li>• Dossier clinique confidentiel (conservé hors ligne uniquement)</li>
                  <li>• Notes d'évolution (format papier sécurisé)</li>
                  <li>• Documents relatifs au mandat d'homologation (si applicable)</li>
                </ul>
              </div>

              <div class="bg-amber-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg mt-4">
                <p class="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200">
                  ⚠️ Important
                </p>
                <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-2">
                  Seules les informations nécessaires à votre suivi professionnel sont collectées.
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Carte Utilisation des données (pleine largeur) -->
        <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 border border-teal-100 dark:border-sky-700 mb-8 sm:mb-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl sm:text-4xl">🎯</span>
            <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Utilisation de Vos Informations
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div class="bg-slate-50 dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
              <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                <span class="text-xl">📞</span>
                Communication
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Pour vous contacter concernant vos rendez-vous et votre suivi
              </p>
            </div>

            <div class="bg-slate-50 dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
              <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                <span class="text-xl">📝</span>
                Dossier clinique
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Pour assurer la continuité et la qualité de votre accompagnement
              </p>
            </div>

            <div class="bg-slate-50 dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
              <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                <span class="text-xl">⚖️</span>
                Obligations légales
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Pour respecter les exigences déontologiques et légales
              </p>
            </div>
          </div>
        </div>

        <!-- Carte Cookies (pleine largeur) -->
        <div class="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-gray-800 dark:to-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 border-2 border-sky-200 dark:border-sky-900/50 mb-8 sm:mb-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl sm:text-4xl">🍪</span>
            <h2 class="text-xl sm:text-2xl font-semibold text-sky-900 dark:text-sky-200">
              Utilisation des Cookies
            </h2>
          </div>
          
          <div class="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <div class="bg-white dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
              <h3 class="font-semibold text-lg text-sky-900 dark:text-sky-200 mb-3 flex items-center gap-2">
                <span class="text-green-600 dark:text-green-400 text-xl">✅</span>
                Cookies essentiels uniquement
              </h3>
              <p class="leading-relaxed mb-3">
                Notre site utilise <strong>uniquement des cookies essentiels</strong> nécessaires au fonctionnement du site. 
                Ces cookies permettent de mémoriser vos préférences (comme le mode sombre/clair) et d'assurer la navigation.
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Ils ne collectent aucune information personnelle et ne nécessitent pas de consentement selon la Loi 25.
              </p>
            </div>

            <div class="bg-white dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
              <h3 class="font-semibold text-lg text-sky-900 dark:text-sky-200 mb-3 flex items-center gap-2">
                <span class="text-red-600 dark:text-red-400 text-xl">🚫</span>
                Aucun cookie de suivi
              </h3>
              <p class="leading-relaxed mb-3">
                J'ai fait le <strong>choix professionnel conscient</strong> de privilégier votre vie privée plutôt que 
                l'analyse de vos comportements de navigation. Dans une démarche d'aide psychosociale, la confiance 
                et le respect de votre confidentialité sont plus importants que les statistiques.
              </p>
              <p class="leading-relaxed">
                C'est pourquoi nous n'utilisons <strong>PAS</strong> :
              </p>
              <ul class="mt-2 space-y-1 pl-4">
                <li class="flex items-start gap-2">
                  <span class="text-gray-600 dark:text-gray-400 mt-1">•</span>
                  <span>Google Analytics ou autres outils d'analyse</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-gray-600 dark:text-gray-400 mt-1">•</span>
                  <span>Facebook Pixel ou traceurs publicitaires</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-gray-600 dark:text-gray-400 mt-1">•</span>
                  <span>Cookies tiers de suivi</span>
                </li>
              </ul>
              <p class="mt-3 text-sm font-semibold text-green-700 dark:text-green-400">
                ✨ Votre navigation reste entièrement privée et n'est pas suivie.
              </p>
            </div>
          </div>
        </div>

        <!-- Carte Sécurité et Protection -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12">
          
          <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 border border-teal-100 dark:border-sky-700">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-3xl sm:text-4xl">🔒</span>
              <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Sécurité des Données
              </h2>
            </div>
            
            <div class="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              <p class="leading-relaxed">
                Vos informations sont protégées par des mesures de sécurité appropriées :
              </p>
              
              <ul class="space-y-2">
                <li class="flex items-start gap-2">
                  <span class="text-teal-600 dark:text-teal-400 mt-1">✓</span>
                  <span><strong>Chiffrement HTTPS</strong> pour toutes les communications web</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-teal-600 dark:text-teal-400 mt-1">✓</span>
                  <span><strong>Chiffrement AES-256</strong> pour les données du formulaire de contact</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-teal-600 dark:text-teal-400 mt-1">✓</span>
                  <span><strong>Dossiers cliniques hors ligne</strong> - vos dossiers thérapeutiques ne sont jamais stockés en ligne</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-teal-600 dark:text-teal-400 mt-1">✓</span>
                  <span><strong>Hébergement sécurisé</strong> avec Vercel (certifié) pour le site web uniquement</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-teal-600 dark:text-teal-400 mt-1">✓</span>
                  <span><strong>Accès restreint</strong> - seul le professionnel a accès aux dossiers</span>
                </li>
              </ul>

              <div class="bg-teal-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                <p class="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                  🔐 Choix de sécurité maximale
                </p>
                <p class="text-sm">
                  Par souci de protection maximale de votre vie privée, vos dossiers cliniques et notes thérapeutiques 
                  sont conservés <strong>exclusivement hors ligne</strong> dans un système sécurisé. Seules les informations 
                  de contact initiales sont stockées dans une base de données chiffrée AES-256.
                </p>
              </div>
            </div>
          </div>

          <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 border border-teal-100 dark:border-sky-700">
            <div class="flex items-center gap-3 mb-6">
              <span class="text-3xl sm:text-4xl">👤</span>
              <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Vos Droits
              </h2>
            </div>
            
            <div class="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              <p class="leading-relaxed">
                Conformément à la Loi 25, vous avez le droit de :
              </p>
              
              <div class="space-y-3">
                <div class="border-l-4 border-purple-500 pl-4 py-2">
                  <p class="font-semibold text-gray-800 dark:text-gray-100">Accès</p>
                  <p class="text-sm">Consulter vos informations personnelles</p>
                </div>
                <div class="border-l-4 border-blue-500 pl-4 py-2">
                  <p class="font-semibold text-gray-800 dark:text-gray-100">Rectification</p>
                  <p class="text-sm">Corriger des informations inexactes</p>
                </div>
                <div class="border-l-4 border-orange-500 pl-4 py-2">
                  <p class="font-semibold text-gray-800 dark:text-gray-100">Suppression</p>
                  <p class="text-sm">Demander l'effacement (selon les limites légales)</p>
                </div>
                <div class="border-l-4 border-pink-500 pl-4 py-2">
                  <p class="font-semibold text-gray-800 dark:text-gray-100">Portabilité</p>
                  <p class="text-sm">Obtenir une copie de vos données</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Carte Conservation et Partage -->
        <div class="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-5 sm:p-6 md:p-8 border border-teal-100 dark:border-sky-700 mb-8 sm:mb-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl sm:text-4xl">📁</span>
            <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Conservation et Partage des Données
            </h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3">
                Durée de conservation
              </h3>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                Conformément au Code de déontologie de l'OTSTCFQ, vos dossiers cliniques sont conservés 
                pour une période minimale de <strong>5 ans</strong> après le dernier service.
              </p>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Cette durée peut être prolongée selon les exigences légales spécifiques (ex: mandats d'homologation).
              </p>
            </div>

            <div>
              <h3 class="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3">
                Partage d'informations
              </h3>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                Vos informations ne sont <strong>jamais vendues</strong> ou partagées à des fins commerciales.
              </p>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Le partage est limité aux situations suivantes :
              </p>
              <ul class="mt-2 space-y-1 text-sm">
                <li class="flex items-start gap-2">
                  <span class="text-gray-600 dark:text-gray-400 mt-1">•</span>
                  <span>Avec votre consentement écrit explicite</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-gray-600 dark:text-gray-400 mt-1">•</span>
                  <span>Obligations légales (ordonnance de la cour)</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-gray-600 dark:text-gray-400 mt-1">•</span>
                  <span>Situations d'urgence (risque imminent)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Carte Contact (accent) -->
        <div class="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 border-2 border-teal-200 dark:border-teal-900/50 mb-8 sm:mb-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl sm:text-4xl">✉️</span>
            <h2 class="text-xl sm:text-2xl font-semibold text-teal-900 dark:text-teal-200">
              Questions ou Demandes
            </h2>
          </div>
          
          <div class="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <p class="leading-relaxed">
              Pour toute question concernant cette politique de confidentialité, l'utilisation de vos données personnelles, 
              ou pour exercer vos droits :
            </p>

            <div class="bg-white dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
              <p class="font-semibold text-teal-900 dark:text-teal-200 mb-2">
                Responsable de la protection des données
              </p>
              <p class="mb-3">Nicolas Lamarque, T.S.</p>
              <div class="space-y-2 text-sm">
                <p class="flex items-center gap-2">
                  <span class="text-teal-600 dark:text-teal-400">📧</span>
                  <a href="mailto:contact@lamarquets.com" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                    contact@lamarquets.com
                  </a>
                </p>
                <p class="flex items-center gap-2">
                  <span class="text-teal-600 dark:text-teal-400">🌐</span>
                  <span>lamarquets.com</span>
                </p>
              </div>
            </div>

            <div class="bg-amber-50 dark:bg-gray-700 p-4 rounded-lg">
              <p class="text-xs sm:text-sm">
                <strong>Note :</strong> Si vous estimez que vos droits n'ont pas été respectés, vous pouvez également 
                déposer une plainte auprès de la <strong>Commission d'accès à l'information du Québec (CAI)</strong>.
              </p>
            </div>
          </div>
        </div>

        <!-- Bouton retour -->
        <div class="text-center">
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 px-4">
            Merci de votre confiance. La protection de votre vie privée est ma priorité.
          </p>
          <NuxtLink 
            to="/" 
            class="inline-block bg-sky-700 text-white py-2 sm:py-3 px-5 sm:px-6 rounded-xl font-semibold shadow hover:bg-sky-600 transition-colors text-sm sm:text-base"
          >
            Retour à l'accueil
          </NuxtLink>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { useDarkMode } from "../composables/useDarkMode";

const { initTheme } = useDarkMode();
onMounted(() => {
  initTheme();
});

// Meta tags pour SEO
useHead({
  title: 'Politique de Confidentialité',
  meta: [
    { 
      name: 'description', 
      content: 'Politique de confidentialité et gestion des cookies conforme à la Loi 25 du Québec - Lamarque TS, services psychosociaux professionnels' 
    }
  ]
})
</script>