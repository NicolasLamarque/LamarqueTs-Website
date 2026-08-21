// ============================================================================
// server/utils/rruleOccurrences.ts — Calcul des occurrences réelles
// ============================================================================
//
// POURQUOI CE FICHIER EXISTE
// --------------------------
// Les dates de récurrence étaient calculées à la main, avec des boucles du
// type « date de début + count × interval ». Trois défauts en découlaient :
//
//   1. Une période de trop. Huit séances hebdomadaires, c'est SEPT semaines
//      après la première, pas huit. La date de fin annoncée était donc
//      systématiquement décalée d'une période.
//
//   2. Un décalage de fuseau. `new Date('2026-11-12')` est interprétée comme
//      minuit UTC ; réaffichée en heure du Québec, elle recule d'un jour.
//      Cumulé au premier défaut, l'écart atteignait six jours.
//
//   3. BYDAY ignoré. Un groupe « mardi et jeudi » produit deux séances par
//      semaine, mais le calcul en supposait une seule par période.
//
// Plutôt que de corriger ces formules une à une, ce module délègue à la
// bibliothèque `rrule`, déjà présente dans le projet. Elle applique la norme
// RFC 5545 : c'est elle qui sait qu'un « tous les 2 mois le 31 » saute février,
// ou qu'un « mardi et jeudi » double les occurrences.
//
// LE FUSEAU HORAIRE
// -----------------
// Les heures saisies sont des heures « murales » : 19 h, c'est 19 h, sans
// notion de fuseau. On construit donc les dates avec Date.UTC et on les relit
// avec les accesseurs UTC. L'heure traverse ainsi tous les calculs sans jamais
// être décalée — c'est le piège classique des dates en JavaScript.
// ============================================================================

// La bibliotheque expose du CommonJS pour `main` et de l'ESM pour `module`.
// Selon le contexte d'execution — build Nuxt, script tsx, test — l'un ou
// l'autre est resolu. Cette forme fonctionne dans les deux cas ; un import
// nomme direct echoue sur la variante CommonJS.
import * as ModuleRRule from 'rrule'

const RRule: any =
  (ModuleRRule as any).RRule ?? (ModuleRRule as any).default?.RRule ?? (ModuleRRule as any).default

/** Correspondance entre les codes de jour RFC 5545 et la bibliothèque. */
const JOURS: Record<string, number> = {
  mo: RRule.MO.weekday, tu: RRule.TU.weekday, we: RRule.WE.weekday,
  th: RRule.TH.weekday, fr: RRule.FR.weekday, sa: RRule.SA.weekday,
  su: RRule.SU.weekday,
}

const FREQUENCES: Record<string, number> = {
  daily: RRule.DAILY,
  weekly: RRule.WEEKLY,
  monthly: RRule.MONTHLY,
  yearly: RRule.YEARLY,
}

/**
 * Lit une date au format compact RRule (20260917T190000) et la reconstruit
 * en conservant l'heure telle qu'elle a été saisie.
 */
function lireDateCompacte(compact: string): Date | null {
  const m = compact.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?/)
  if (!m) return null
  const [, a, mo, j, h = '0', mi = '0', s = '0'] = m
  return new Date(Date.UTC(+a, +mo - 1, +j, +h, +mi, +s))
}

/**
 * Lit une date « YYYY-MM-DD » ou « YYYY-MM-DDTHH:mm » sans décalage.
 *
 * `new Date('2026-09-17')` donnerait minuit UTC, ce qui recule d'un jour une
 * fois réaffiché au Québec. On découpe donc la chaîne nous-mêmes.
 */
export function lireDate(valeur: string | Date | null | undefined): Date | null {
  if (!valeur) return null
  if (valeur instanceof Date) return isNaN(valeur.getTime()) ? null : valeur

  const m = String(valeur).match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/)
  if (!m) {
    const d = new Date(valeur)
    return isNaN(d.getTime()) ? null : d
  }
  const [, a, mo, j, h = '0', mi = '0'] = m
  return new Date(Date.UTC(+a, +mo - 1, +j, +h, +mi))
}

/** Rend une date au format YYYY-MM-DD, sans décalage de fuseau. */
export function versDateISO(d: Date | string | null | undefined): string {
  const date = lireDate(d)
  if (!date) return ''
  const a = date.getUTCFullYear()
  const mo = String(date.getUTCMonth() + 1).padStart(2, '0')
  const j = String(date.getUTCDate()).padStart(2, '0')
  return `${a}-${mo}-${j}`
}

/**
 * Construit une règle exploitable à partir de notre chaîne stockée.
 *
 * Accepte les deux formes :
 *   - l'ancienne, avec DTSTART dans la chaîne : « FREQ=WEEKLY;DTSTART:…;COUNT=8 »
 *   - la forme normalisée, DTSTART séparé
 *
 * La compatibilité avec l'ancienne est nécessaire : les événements déjà
 * enregistrés l'utilisent.
 */
export function construireRegle(
  rruleString: string | null | undefined,
  dateDebutSecours?: string | Date | null
): RRule | null {
  if (!rruleString) return null

  const options: any = { interval: 1 }
  let dtstart: Date | null = null

  const corps = rruleString.replace(/^RRULE:/i, '').replace(/\r?\n/g, ';')

  for (const morceau of corps.split(';')) {
    if (!morceau.trim()) continue
    const sep = morceau.search(/[:=]/)
    if (sep === -1) continue
    const cle = morceau.slice(0, sep).trim().toUpperCase()
    const valeur = morceau.slice(sep + 1).trim()

    switch (cle) {
      case 'FREQ':
        options.freq = FREQUENCES[valeur.toLowerCase()]
        break
      case 'INTERVAL':
        options.interval = Math.max(1, parseInt(valeur) || 1)
        break
      case 'COUNT':
        options.count = parseInt(valeur)
        break
      case 'UNTIL':
        options.until = lireDateCompacte(valeur)
        break
      case 'DTSTART':
        dtstart = lireDateCompacte(valeur)
        break
      case 'BYDAY':
        options.byweekday = valeur
          .toLowerCase()
          .split(',')
          .map((d) => JOURS[d.trim().slice(-2)])
          .filter((d) => d !== undefined)
        break
      case 'BYMONTHDAY':
        options.bymonthday = valeur.split(',').map((n) => parseInt(n)).filter(Boolean)
        break
    }
  }

  options.dtstart = dtstart || lireDate(dateDebutSecours)
  if (options.freq === undefined || !options.dtstart) return null

  // Sans COUNT ni UNTIL, la série est infinie : on borne à cinq ans pour ne
  // jamais boucler indéfiniment sur un calcul de date de fin.
  if (!options.count && !options.until) {
    const limite = new Date(options.dtstart)
    limite.setUTCFullYear(limite.getUTCFullYear() + 5)
    options.until = limite
  }

  try {
    return new RRule(options)
  } catch {
    return null
  }
}

/**
 * Renvoie les dates réelles de toutes les séances, exceptions retirées.
 *
 * C'est la source unique : date de fin, nombre de séances et numérotation
 * en découlent tous, au lieu d'être recalculés séparément par des formules
 * qui divergeaient.
 */
export function genererOccurrences(
  rruleString: string | null | undefined,
  dateDebut?: string | Date | null,
  exdate?: string | null
): Date[] {
  const regle = construireRegle(rruleString, dateDebut)
  if (!regle) {
    const seule = lireDate(dateDebut)
    return seule ? [seule] : []
  }

  const exclues = new Set(
    (exdate || '')
      .split(',')
      .map((d) => versDateISO(d.trim()))
      .filter(Boolean)
  )

  // Plafond de sécurité : une série mal formée ne doit pas produire des
  // dizaines de milliers de dates.
  return regle.all((_, i) => i < 500).filter((d) => !exclues.has(versDateISO(d)))
}

/** Date de la dernière séance, au format YYYY-MM-DD. */
export function derniereOccurrence(
  rruleString: string | null | undefined,
  dateDebut?: string | Date | null,
  exdate?: string | null
): string {
  const dates = genererOccurrences(rruleString, dateDebut, exdate)
  return dates.length ? versDateISO(dates[dates.length - 1]) : versDateISO(dateDebut)
}

/** Nombre réel de séances, exceptions retirées. */
export function nombreOccurrences(
  rruleString: string | null | undefined,
  dateDebut?: string | Date | null,
  exdate?: string | null
): number {
  return genererOccurrences(rruleString, dateDebut, exdate).length
}

/**
 * Rang d'une séance dans la série, à partir de 1.
 * Renvoie 0 si la date ne correspond à aucune séance.
 */
export function rangOccurrence(
  rruleString: string | null | undefined,
  dateDebut: string | Date | null | undefined,
  dateCherchee: string | Date,
  exdate?: string | null
): number {
  const cible = versDateISO(dateCherchee)
  const dates = genererOccurrences(rruleString, dateDebut, exdate)
  return dates.findIndex((d) => versDateISO(d) === cible) + 1
}

/**
 * Sépare DTSTART du corps de la règle, comme l'exige la RFC 5545.
 *
 * DTSTART est une propriété distincte, pas un composant de RRULE. Le stockage
 * actuel les mélange dans une seule chaîne : c'est sans conséquence tant que
 * l'application relit ses propres données avec son propre analyseur, mais
 * aucun outil externe — agenda, export .ics — ne saurait l'interpréter.
 */
export function separerDtstart(
  rruleString: string | null | undefined,
  dateDebut?: string | Date | null
): { dtstart: string; rrule: string } | null {
  if (!rruleString) return null

  const morceaux = rruleString
    .replace(/^RRULE:/i, '')
    .replace(/\r?\n/g, ';')
    .split(';')
    .filter((p) => p.trim() && !/^DTSTART[:=]/i.test(p.trim()))

  const debut = construireRegle(rruleString, dateDebut)?.options?.dtstart
  if (!debut) return null

  const p = (n: number) => String(n).padStart(2, '0')
  const dtstart =
    `${debut.getUTCFullYear()}${p(debut.getUTCMonth() + 1)}${p(debut.getUTCDate())}` +
    `T${p(debut.getUTCHours())}${p(debut.getUTCMinutes())}00`

  return { dtstart, rrule: morceaux.join(';') }
}
