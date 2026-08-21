// ============================================
// server/utils/rruleHelpers.ts
// Utilitaires pour gérer les RRules (RFC 5545)
// ============================================

/**
 * Formate une date au format RRule ISO compact : YYYYMMDDTHHMMSS
 * @param date - Date au format YYYY-MM-DD
 * @param time - Heure au format HH:mm
 * @returns String au format 20251030T090000
 */
export function formatRRuleDate(date: string, time: string = '00:00'): string {
  // Enlever les tirets de la date
  const cleanDate = date.replace(/-/g, '');
  
  // Enlever les deux-points de l'heure et ajouter les secondes
  const cleanTime = time.replace(/:/g, '') + '00';
  
  return `${cleanDate}T${cleanTime}`;
}

/**
 * Calcule la durée entre deux heures au format HH:MM
 * @param heureDebut - Heure de début (HH:mm)
 * @param heureFin - Heure de fin (HH:mm)
 * @param allDay - Si true, retourne 24:00
 * @returns Durée au format HH:MM
 */
export function calculateDuration(
  heureDebut?: string | null, 
  heureFin?: string | null, 
  allDay: boolean = false
): string {
  if (allDay) return '24:00';
  if (!heureDebut || !heureFin) return '01:00';
  
  try {
    const debut = new Date(`2000-01-01T${heureDebut}:00`);
    const fin = new Date(`2000-01-01T${heureFin}:00`);
    
    let diffMs = fin.getTime() - debut.getTime();
    
    // Si la fin est avant le début, ajouter 24h (cas minuit)
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
    
    // Durée minimale de 1h
    if (diffMs === 0) diffMs = 60 * 60 * 1000;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch {
    return '01:00';
  }
}

/**
 * Construit une RRule complète selon RFC 5545
 * @param params - Paramètres de récurrence
 * @returns String RRule (ex: "FREQ=WEEKLY;INTERVAL=1;DTSTART:20251030T090000;COUNT=8")
 */
export function buildRRule(params: {
  dateDebut: string;
  heureDebut?: string | null;
  frequency: string;
  interval?: number;
  count?: number | null;
  endDate?: string | null;
  byweekday?: string[];
  allDay?: boolean;
}): string {
  const parts: string[] = [];
  
  // 1. FREQ (obligatoire)
  parts.push(`FREQ=${params.frequency.toUpperCase()}`);
  
  // 2. INTERVAL (défaut: 1)
  if (params.interval && params.interval > 1) {
    parts.push(`INTERVAL=${params.interval}`);
  }
  
  // 3. DTSTART (CRITIQUE : Format ISO compact)
  const time = params.heureDebut || (params.allDay ? '00:00' : '09:00');
  const dtstart = formatRRuleDate(params.dateDebut, time);
  parts.push(`DTSTART:${dtstart}`);
  
  // 4. COUNT ou UNTIL (mutuellement exclusifs)
  if (params.count && params.count > 0) {
    parts.push(`COUNT=${params.count}`);
  } else if (params.endDate) {
    const until = formatRRuleDate(params.endDate, '23:59');
    parts.push(`UNTIL:${until}`);
  }
  
  // 5. BYDAY (pour WEEKLY)
  if (params.byweekday && params.byweekday.length > 0) {
    const days = params.byweekday.map(d => d.toUpperCase()).join(',');
    parts.push(`BYDAY=${days}`);
  }
  
  return parts.join(';');
}

/**
 * Parse une RRule en objet
 * @param rrule - String RRule
 * @returns Objet avec les composants de la RRule
 */
export function parseRRule(rrule: string | null): {
  freq?: string;
  interval?: number;
  dtstart?: string;
  count?: number;
  until?: string;
  byweekday?: string[];
} {
  if (!rrule) return {};
  
  const result: any = {};
  const parts = rrule.split(';');
  
  parts.forEach(part => {
    const [key, value] = part.split(/[:=]/); // Accepte : ou =
    
    switch (key) {
      case 'FREQ':
        result.freq = value.toLowerCase();
        break;
      case 'INTERVAL':
        result.interval = parseInt(value);
        break;
      case 'DTSTART':
        // Convertir 20251030T090000 -> 2025-10-30T09:00:00
        result.dtstart = formatISOFromCompact(value);
        break;
      case 'COUNT':
        result.count = parseInt(value);
        break;
      case 'UNTIL':
        result.until = formatISOFromCompact(value);
        break;
      case 'BYDAY':
        result.byweekday = value.toLowerCase().split(',');
        break;
    }
  });
  
  return result;
}

/**
 * Convertit le format compact RRule en ISO
 * @param compact - 20251030T090000
 * @returns 2025-10-30T09:00:00
 */
function formatISOFromCompact(compact: string): string {
  // Format: YYYYMMDDTHHMMSS
  const year = compact.substring(0, 4);
  const month = compact.substring(4, 6);
  const day = compact.substring(6, 8);
  const hour = compact.substring(9, 11);
  const minute = compact.substring(11, 13);
  const second = compact.substring(13, 15);
  
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

/**
 * Convertit une RRule en objet pour FullCalendar
 * @param rrule - String RRule
 * @returns Objet compatible FullCalendar
 */
export function rruleToFullCalendar(rrule: string | null) {
  if (!rrule) return null;
  
  const parsed = parseRRule(rrule);
  
  return {
    freq: parsed.freq,
    dtstart: parsed.dtstart,
    interval: parsed.interval || 1,
    count: parsed.count,
    until: parsed.until,
    byweekday: parsed.byweekday,
  };
}

/**
 * Valide une RRule
 * @param rrule - String RRule
 * @returns { valid: boolean, errors: string[] }
 */
export function validateRRule(rrule: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!rrule) {
    errors.push('RRule vide');
    return { valid: false, errors };
  }
  
  const parsed = parseRRule(rrule);
  
  // FREQ obligatoire
  if (!parsed.freq) {
    errors.push('FREQ manquant');
  }
  
  // DTSTART obligatoire
  if (!parsed.dtstart) {
    errors.push('DTSTART manquant');
  }
  
  // COUNT et UNTIL mutuellement exclusifs
  if (parsed.count && parsed.until) {
    errors.push('COUNT et UNTIL ne peuvent pas coexister');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

import {
  genererOccurrences,
  derniereOccurrence,
  rangOccurrence,
  versDateISO,
} from './rruleOccurrences';

/**
 * Calcule la date de la DERNIÈRE occurrence.
 *
 * L'ancienne implémentation ajoutait `count × interval` périodes à la date de
 * début. Huit séances hebdomadaires, c'est sept semaines après la première :
 * la date annoncée était donc systématiquement décalée d'une période, et
 * BYDAY n'était pas pris en compte du tout.
 *
 * Le calcul est désormais délégué au moteur d'occurrences, qui applique la
 * norme RFC 5545 via la bibliothèque `rrule`.
 */
export function calculateEndDate(
  dateDebut: string,
  frequency: string,
  count: number,
  interval: number = 1
): string {
  const rrule = `FREQ=${frequency.toUpperCase()};INTERVAL=${interval};COUNT=${count}`;
  return derniereOccurrence(rrule, dateDebut);
}

/** Identique à calculateEndDate — conservée pour les appels existants. */
export function calculateEndDateToIsoString(
  dateDebut: string | Date,
  frequency: string,
  count: number,
  interval: number = 1
): string {
  const rrule = `FREQ=${frequency.toUpperCase()};INTERVAL=${interval};COUNT=${count}`;
  return derniereOccurrence(rrule, dateDebut);
}

/**
 * Normalise une date en YYYY-MM-DD, sans décalage de fuseau.
 *
 * L'ancienne version passait par toISOString(), qui convertit en UTC : une
 * date locale du 12 novembre ressortait au 11 novembre en heure du Québec.
 */
export function toIsoDateString(date: string | Date): string {
  return versDateISO(date);
}

/**
 * Obtient un label lisible pour la fréquence
 */
export function getFrequencyLabel(freq: string): string {
  const labels: Record<string, string> = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel',
  };
  return labels[freq.toLowerCase()] || freq;
}

/**
 * Description courte de la récurrence, à partir de la règle seule.
 */
export function getRecurrenceDescription(rrule: string | null): string {
  if (!rrule) return '';

  const parsed = parseRRule(rrule);
  if (!parsed.freq) return '';

  let desc = getFrequencyLabel(parsed.freq);

  if (parsed.interval && parsed.interval > 1) {
    desc += ` (tous les ${parsed.interval})`;
  }
  if (parsed.count) {
    desc += `, ${parsed.count} fois`;
  } else if (parsed.until) {
    desc += `, jusqu'au ${new Date(parsed.until).toLocaleDateString('fr-CA')}`;
  }
  if (parsed.byweekday && parsed.byweekday.length > 0) {
    desc += ` (${parsed.byweekday.join(', ')})`;
  }
  return desc;
}

/**
 * Texte affiché quand on clique sur une séance précise.
 *
 * L'ancienne version reconstruisait la liste des dates avec la formule
 * fautive : la première séance n'y figurait pas, et le rang affiché commençait
 * donc à zéro (« 0ᵉ séance »). Le rang vient maintenant du moteur.
 */
export function formatRecurrentEventDisplay(event: any, clickedDate: Date | string): string {
  if (!event?.rrule) return '';

  const rang = rangOccurrence(event.rrule, event.dateDebut, clickedDate, event.exdate);
  const dates = genererOccurrences(event.rrule, event.dateDebut, event.exdate);
  if (!dates.length) return '';

  const nom = event.titleEvenement || 'Groupe';
  const total = dates.length;
  const debut = versDateISO(dates[0]);
  const fin = versDateISO(dates[dates.length - 1]);
  const horaire = event.allDay
    ? 'toute la journée'
    : `${event.heureDebut || '--'} → ${event.heureFin || '--'}`;

  const ordinal = (n: number) => (n === 1 ? '1ʳᵉ' : `${n}ᵉ`);
  const position = rang > 0 ? `${ordinal(rang)} séance sur ${total}` : `Séance du ${nom}`;

  return `${position} — ${nom}. Du ${debut} au ${fin}. Horaire : ${horaire}.`;
}

/**
 * Description lisible d'un événement, simple ou récurrent.
 */
export function describeEvenement(event: any): string {
  if (!event) return '';

  const { rrule, allDay, heureDebut, heureFin, dateDebut, exdate } = event;

  const formatDate = (d: string | Date) => {
    const iso = versDateISO(d);
    if (!iso) return '';
    const [a, m, j] = iso.split('-').map(Number);
    return new Date(a, m - 1, j).toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const horaire = allDay ? 'toute la journée' : `${heureDebut || '--'} → ${heureFin || '--'}`;
  const parsed = rrule ? parseRRule(rrule) : null;

  if (!parsed || !parsed.freq) {
    return `Activité prévue le ${formatDate(dateDebut)}. Horaire : ${horaire}.`;
  }

  const dates = genererOccurrences(rrule, dateDebut, exdate);
  const total = dates.length;
  const debut = dates.length ? formatDate(dates[0]) : formatDate(dateDebut);
  const fin = dates.length ? formatDate(dates[dates.length - 1]) : debut;
  const seances = `${total} séance${total > 1 ? 's' : ''}`;

  return `Activité ${getFrequencyLabel(parsed.freq).toLowerCase()} pendant ${seances}. Du ${debut} au ${fin}. Horaire : ${horaire}.`;
}
