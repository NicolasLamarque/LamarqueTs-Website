<template>
  <div class="p-4 sm:p-6 space-y-6">

    <!-- ================= En-tête + actions ================= -->
    <div class="flex flex-wrap items-start justify-between gap-3 print:hidden">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
          Audit de sécurité
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Connexions au tableau de bord et tentatives d'accès refusées
        </p>
      </div>

      <div class="flex gap-2">
        <button
          @click="chargerTout"
          :disabled="chargement"
          class="px-4 py-2 rounded-lg text-sm font-semibold border border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {{ chargement ? 'Chargement…' : 'Actualiser' }}
        </button>
        <button
          @click="imprimer"
          class="px-4 py-2 rounded-lg text-sm font-semibold bg-sky-700 hover:bg-sky-600 text-white shadow transition-colors"
        >
          Télécharger en PDF
        </button>
      </div>
    </div>

    <!-- En-tête visible uniquement à l'impression -->
    <div class="hidden print:block mb-6">
      <h1 class="text-2xl font-bold">Rapport de sécurité — LamarqueTS</h1>
      <p class="text-sm">Édité le {{ dateEdition }}</p>
    </div>

    <p v-if="erreur" class="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
      {{ erreur }}
    </p>

    <!-- ================= Chiffres clés ================= -->
    <section>
      <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
        Chiffres clés
      </h3>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="t in tuiles"
          :key="t.libelle"
          class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-teal-100 dark:border-sky-700 shadow-sm"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ t.libelle }}</p>
          <p class="text-2xl font-bold tabular-nums mt-1" :class="t.classe">{{ t.valeur }}</p>
        </div>
      </div>
    </section>

    <!-- ================= Contrôles en direct ================= -->
    <section>
      <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
        État des protections
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Chaque route est appelée sans envoyer ton cookie de connexion, exactement
        comme le ferait un visiteur anonyme.
      </p>

      <div class="bg-white dark:bg-gray-800 rounded-xl border border-teal-100 dark:border-sky-700 shadow-sm overflow-hidden">
        <div
          v-for="c in controles"
          :key="c.route"
          class="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
        >
          <div class="min-w-0">
            <p class="font-mono text-sm text-gray-800 dark:text-gray-100 truncate">{{ c.route }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ c.attendu }}</p>
          </div>
          <span
            class="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
            :class="c.statut === 'ok'
              ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
              : c.statut === 'echec'
                ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
          >
            {{ c.statut === 'ok' ? '✓ Conforme' : c.statut === 'echec' ? '✕ ' + c.obtenu : '…' }}
          </span>
        </div>
      </div>
    </section>

    <!-- ================= Adresses insistantes ================= -->
    <section v-if="ipsFrequentes.length">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
        Adresses répétées
      </h3>
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-teal-100 dark:border-sky-700 shadow-sm overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th class="px-4 py-2 font-semibold">Adresse</th>
              <th class="px-4 py-2 font-semibold">Tentatives</th>
              <th class="px-4 py-2 font-semibold">Dernière</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ip in ipsFrequentes" :key="ip.ip" class="border-b border-gray-100 dark:border-gray-700 last:border-0">
              <td class="px-4 py-2 font-mono text-gray-800 dark:text-gray-100">{{ ip.ip }}</td>
              <td class="px-4 py-2 tabular-nums font-semibold" :class="ip.nombre >= 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'">
                {{ ip.nombre }}
              </td>
              <td class="px-4 py-2 text-gray-500 dark:text-gray-400">{{ formaterDate(ip.derniere) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ================= Journal ================= -->
    <section>
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Journal ({{ entreesFiltrees.length }})
        </h3>
        <div class="flex gap-1 print:hidden">
          <button
            v-for="f in filtres"
            :key="f.valeur"
            @click="filtreActif = f.valeur"
            class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            :class="filtreActif === f.valeur
              ? 'bg-sky-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            {{ f.libelle }}
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl border border-teal-100 dark:border-sky-700 shadow-sm overflow-x-auto">
        <table class="w-full text-sm min-w-[640px]">
          <thead>
            <tr class="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th class="px-4 py-2 font-semibold">Date</th>
              <th class="px-4 py-2 font-semibold">Événement</th>
              <th class="px-4 py-2 font-semibold">Requête</th>
              <th class="px-4 py-2 font-semibold">Adresse</th>
              <th class="px-4 py-2 font-semibold">Identifiant</th>
              <th class="px-4 py-2 font-semibold">Navigateur</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!entreesFiltrees.length">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                Aucune entrée. C'est la bonne nouvelle : personne n'a tenté d'accéder
                à une route protégée.
              </td>
            </tr>
            <tr
              v-for="e in entreesFiltrees"
              :key="e.id"
              class="border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <td class="px-4 py-2 whitespace-nowrap text-gray-500 dark:text-gray-400 tabular-nums">
                {{ formaterDate(e.created_at) }}
              </td>
              <td class="px-4 py-2">
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" :class="classeEvenement(e.event)">
                  {{ libelleEvenement(e.event) }}
                </span>
              </td>
              <td class="px-4 py-2 font-mono text-xs text-gray-700 dark:text-gray-300">
                {{ e.method }} {{ e.path }}
              </td>
              <td class="px-4 py-2 font-mono text-xs text-gray-600 dark:text-gray-400">{{ e.ip }}</td>
              <td class="px-4 py-2 text-gray-700 dark:text-gray-300">{{ e.username || '—' }}</td>
              <td class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 max-w-[220px] truncate" :title="e.user_agent || ''">
                {{ resumerNavigateur(e.user_agent) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
      Ce journal n'enregistre aucune visite de page ni aucun parcours de visiteur.
      Les routes publiques du site — blog, événements, formulaire de contact — ne
      produisent aucune entrée. Conservation : 90 jours.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Entree {
  id: number
  created_at: string
  event: string
  method: string | null
  path: string | null
  ip: string | null
  username: string | null
  user_agent: string | null
}

const entrees = ref<Entree[]>([])
const ipsFrequentes = ref<any[]>([])
const stats = ref<Record<string, number>>({})
const chargement = ref(false)
const erreur = ref('')
const filtreActif = ref('tous')

const filtres = [
  { valeur: 'tous', libelle: 'Tout' },
  { valeur: 'denied', libelle: 'Refus' },
  { valeur: 'login_badpass', libelle: 'Mot de passe faux' },
  { valeur: 'login_unknown', libelle: 'Compte inconnu' },
  { valeur: 'login_ok', libelle: 'Connexions' },
]

const dateEdition = new Date().toLocaleString('fr-CA')

const tuiles = computed(() => [
  { libelle: 'Refus d\'accès', valeur: stats.value.refus ?? 0, classe: (stats.value.refus ?? 0) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-800 dark:text-gray-100' },
  { libelle: 'Mot de passe faux', valeur: stats.value.motsDePasseFaux ?? 0, classe: (stats.value.motsDePasseFaux ?? 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-100' },
  { libelle: 'Compte inconnu', valeur: stats.value.comptesInconnus ?? 0, classe: 'text-gray-800 dark:text-gray-100' },
  { libelle: 'Connexions réussies', valeur: stats.value.connexions ?? 0, classe: 'text-gray-800 dark:text-gray-100' },
  { libelle: 'Dernières 24 h', valeur: stats.value.dernieres24h ?? 0, classe: 'text-gray-800 dark:text-gray-100' },
])

const entreesFiltrees = computed(() =>
  filtreActif.value === 'tous'
    ? entrees.value
    : entrees.value.filter((e) => e.event === filtreActif.value)
)

const libelleEvenement = (e: string) =>
  ({
    denied: 'Refus',
    login_unknown: 'Compte inconnu',
    login_badpass: 'Mot de passe faux',
    login_fail: 'Échec connexion', // ancien type, conserve pour l'historique
    login_ok: 'Connexion',
  }[e] || e)

const classeEvenement = (e: string) =>
  ({
    denied: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    // Compte inconnu : bruit de fond, ton neutre.
    login_unknown: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    // Mot de passe faux sur un compte reel : le signal serieux, en rouge.
    login_badpass: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    login_fail: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    login_ok: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  }[e] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300')

// L'en-tete complet d'un navigateur est illisible dans un tableau. On en
// extrait l'essentiel ; la valeur integrale reste disponible au survol.
const resumerNavigateur = (ua: string | null) => {
  if (!ua) return '—'
  if (/bot|crawl|spider|curl|wget|python|scan/i.test(ua)) return '🤖 Robot / script'
  if (/Edg\//.test(ua)) return 'Edge'
  if (/Chrome\//.test(ua)) return 'Chrome'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Safari\//.test(ua)) return 'Safari'
  return ua.slice(0, 28) + '…'
}

const formaterDate = (d: string | null) =>
  d ? new Date(d).toLocaleString('fr-CA', { dateStyle: 'short', timeStyle: 'short' }) : '—'

// ---------------------------------------------------------------------------
// Contrôles en direct
// ---------------------------------------------------------------------------
// `credentials: 'omit'` est la clé : sans lui, le navigateur enverrait ton
// cookie de session et toutes les routes répondraient 200, ce qui ne
// prouverait rien. En l'omettant, la requête part exactement comme celle d'un
// visiteur anonyme — c'est bien la protection qu'on mesure.
const controles = ref([
  { route: 'GET /api/mail', attendu: 'doit être refusé', code: 401, url: '/api/mail', methode: 'GET', statut: '', obtenu: '' },
  { route: 'GET /api/users', attendu: 'doit être refusé', code: 401, url: '/api/users', methode: 'GET', statut: '', obtenu: '' },
  { route: 'GET /api/database/tables', attendu: 'doit être refusé', code: 401, url: '/api/database/tables', methode: 'GET', statut: '', obtenu: '' },
  { route: 'GET /api/security-log', attendu: 'doit être refusé', code: 401, url: '/api/security-log', methode: 'GET', statut: '', obtenu: '' },
  { route: 'GET /api/articles', attendu: 'doit rester public', code: 200, url: '/api/articles', methode: 'GET', statut: '', obtenu: '' },
  { route: 'GET /api/events', attendu: 'doit rester public', code: 200, url: '/api/events', methode: 'GET', statut: '', obtenu: '' },
])

const lancerControles = async () => {
  await Promise.all(
    controles.value.map(async (c) => {
      c.statut = ''
      try {
        const r = await fetch(c.url, { method: c.methode, credentials: 'omit' })
        c.obtenu = String(r.status)
        c.statut = r.status === c.code ? 'ok' : 'echec'
      } catch {
        c.obtenu = 'injoignable'
        c.statut = 'echec'
      }
    })
  )
}

const chargerJournal = async () => {
  const data = await $fetch<{ entrees: Entree[]; stats: any; ipsFrequentes: any[] }>('/api/security-log')
  entrees.value = data.entrees || []
  stats.value = data.stats || {}
  ipsFrequentes.value = data.ipsFrequentes || []
}

const chargerTout = async () => {
  chargement.value = true
  erreur.value = ''
  try {
    await Promise.all([chargerJournal(), lancerControles()])
  } catch (e: any) {
    erreur.value = e?.data?.statusMessage || 'Impossible de charger le journal de sécurité.'
  } finally {
    chargement.value = false
  }
}

const imprimer = () => window.print()

onMounted(chargerTout)
</script>

<style scoped>
@media print {
  /* Le rapport imprimé doit tenir sans les couleurs de fond ni les ombres,
     et les tableaux ne doivent pas être coupés au milieu d'une ligne. */
  section { break-inside: avoid; }
  table { font-size: 11px; }
}
</style>
