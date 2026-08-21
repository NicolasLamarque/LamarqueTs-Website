// ============================================================================
// server/api/events/[id]/ics.get.ts — Export d'un événement au format iCalendar
// ============================================================================
//
// POURQUOI
// --------
// Quelqu'un consulte l'horaire d'un groupe et veut le retrouver dans l'agenda
// de son téléphone. Sans cette route, il doit recopier huit dates à la main —
// et c'est exactement le genre de friction qui fait qu'on ne le fait pas, puis
// qu'on oublie une séance.
//
// Le fichier produit est lu par Google Agenda, Apple Calendrier, Outlook et
// tous les autres : c'est un format normalisé (RFC 5545).
//
// CE QUI RENDAIT CET EXPORT IMPOSSIBLE JUSQU'ICI
// ----------------------------------------------
// La règle de récurrence était stockée avec DTSTART à l'intérieur de la chaîne
// RRULE, séparé par un point-virgule. Aucun agenda ne sait relire ça : la norme
// veut que DTSTART soit une propriété distincte. separerDtstart() rétablit la
// forme attendue.
//
// ACCÈS
// -----
// Cette route est publique en lecture, comme le reste de /api/events : elle ne
// fait que reformater une information déjà affichée sur le calendrier public.
// ============================================================================

import { db } from '../../../utils/db'
import { evenements } from '../../../utils/schema'
import { eq } from 'drizzle-orm'
import { separerDtstart, genererOccurrences, versDateISO } from '../../../../shared/utils/rruleOccurrences'

/**
 * Échappe les caractères que la norme réserve.
 *
 * Sans cela, une virgule ou un point-virgule dans un titre casse la structure
 * du fichier, et l'agenda refuse l'import entier.
 */
function echapper(texte: string | null | undefined): string {
  if (!texte) return ''
  return String(texte)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/** Assemble une date et une heure au format compact attendu par la norme. */
function horodatage(date: string | Date | null | undefined, heure?: string | null): string {
  const iso = versDateISO(date)
  if (!iso) return ''
  const [h, m] = (heure || '00:00').split(':')
  return `${iso.replace(/-/g, '')}T${(h || '00').padStart(2, '0')}${(m || '00').padStart(2, '0')}00`
}

/**
 * Replie les lignes à 75 octets, comme l'exige la RFC 5545.
 *
 * Les lignes trop longues sont tronquées par certains clients — une longue
 * description ferait alors perdre la fin du fichier.
 */
function plier(ligne: string): string {
  if (ligne.length <= 75) return ligne
  const morceaux: string[] = [ligne.slice(0, 75)]
  let reste = ligne.slice(75)
  while (reste.length > 74) {
    morceaux.push(' ' + reste.slice(0, 74))
    reste = reste.slice(74)
  }
  if (reste) morceaux.push(' ' + reste)
  return morceaux.join('\r\n')
}

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!idParam || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Identifiant invalide' })
  }

  const [ev] = await db.select().from(evenements).where(eq(evenements.id, id)).limit(1)

  if (!ev) {
    throw createError({ statusCode: 404, statusMessage: 'Événement introuvable' })
  }

  const lignes: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LamarqueTS//Calendrier//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:evenement-${ev.id}@lamarquets.com`,
    `DTSTAMP:${horodatage(new Date(), '00:00')}Z`,
  ]

  // Début de la première séance.
  //
  // La colonne dateDebut peut être vide : sur les événements récurrents créés
  // par certaines versions du formulaire, la date n'existe QUE dans la chaîne
  // de récurrence. On la récupère alors depuis DTSTART, sans quoi le fichier
  // sortirait avec une date vide et serait rejeté par les agendas.
  const normalise = ev.rrule ? separerDtstart(ev.rrule, ev.dateDebut) : null
  const debut = horodatage(ev.dateDebut, ev.heureDebut) || normalise?.dtstart || ''

  if (!debut) {
    throw createError({ statusCode: 422, statusMessage: 'Événement sans date exploitable' })
  }

  if (ev.allDay) {
    lignes.push(`DTSTART;VALUE=DATE:${debut.slice(0, 8)}`)
  } else {
    lignes.push(`DTSTART:${debut}`)

    // Fin : l'heure de fin si elle existe, sinon la durée enregistrée, sinon
    // une heure par défaut. Un événement sans fin s'affiche mal dans un agenda.
    const finExplicite = ev.heureFin ? horodatage(ev.dateDebut || debut.slice(0, 8), ev.heureFin) : ''
    if (finExplicite && finExplicite !== debut) {
      lignes.push(`DTEND:${finExplicite}`)
    } else {
      const [dh, dm] = (ev.duration || '01:00').split(':').map((n) => parseInt(n) || 0)
      const d = new Date(
        Date.UTC(
          +debut.slice(0, 4), +debut.slice(4, 6) - 1, +debut.slice(6, 8),
          +debut.slice(9, 11) + (dh || 1), +debut.slice(11, 13) + (dm || 0)
        )
      )
      const p2 = (n: number) => String(n).padStart(2, '0')
      lignes.push(
        `DTEND:${d.getUTCFullYear()}${p2(d.getUTCMonth() + 1)}${p2(d.getUTCDate())}` +
        `T${p2(d.getUTCHours())}${p2(d.getUTCMinutes())}00`
      )
    }
  }

  // Récurrence, sous la forme normalisée : DTSTART hors de la règle.
  if (ev.isRecurrent && normalise?.rrule) {
    lignes.push(`RRULE:${normalise.rrule}`)

    // Séances annulées : l'agenda du destinataire les retire aussi.
    if (ev.exdate) {
      for (const d of ev.exdate.split(',').map((x) => x.trim()).filter(Boolean)) {
        const ex = horodatage(d, ev.heureDebut)
        if (ex) lignes.push(`EXDATE:${ex}`)
      }
    }
  }

  lignes.push(`SUMMARY:${echapper(ev.titleEvenement)}`)
  if (ev.TextEvenement) lignes.push(`DESCRIPTION:${echapper(ev.TextEvenement)}`)
  if (ev.location) lignes.push(`LOCATION:${echapper(ev.location)}`)
  if (ev.Link) lignes.push(`URL:${echapper(ev.Link)}`)
  if (ev.CategoryEvenement) lignes.push(`CATEGORIES:${echapper(ev.CategoryEvenement)}`)

  lignes.push(ev.status === 'cancelled' ? 'STATUS:CANCELLED' : 'STATUS:CONFIRMED')
  lignes.push('END:VEVENT', 'END:VCALENDAR')

  // Nom de fichier lisible, construit à partir du titre.
  const nom =
    (ev.titleEvenement || 'evenement')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'evenement'

  setHeader(event, 'Content-Type', 'text/calendar; charset=utf-8')
  setHeader(event, 'Content-Disposition', `attachment; filename="${nom}.ics"`)

  // La norme impose des fins de ligne CRLF.
  return lignes.map(plier).join('\r\n')
})
