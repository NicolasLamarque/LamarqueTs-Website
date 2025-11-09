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

/**
 * Calcule la date de fin suggérée basée sur COUNT
 * @param dateDebut - Date de début (YYYY-MM-DD)
 * @param frequency - Fréquence (daily, weekly, monthly, yearly)
 * @param count - Nombre d'occurrences
 * @param interval - Intervalle (défaut: 1)
 * @returns Date de fin au format YYYY-MM-DD
 */
export function calculateEndDate(
  dateDebut: string,
  frequency: string,
  count: number,
  interval: number = 1
): string {
  const start = new Date(dateDebut);
  const multiplier = count * interval;
  
  switch (frequency.toLowerCase()) {
    case 'daily':
      start.setDate(start.getDate() + multiplier);
      break;
    case 'weekly':
      start.setDate(start.getDate() + (multiplier * 7));
      break;
    case 'monthly':
      start.setMonth(start.getMonth() + multiplier);
      break;
    case 'yearly':
      start.setFullYear(start.getFullYear() + multiplier);
      break;
  }
  
  return start.toISOString().split('T')[0];
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
 * Obtient une description complète de la récurrence
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
    const until = new Date(parsed.until);
    desc += `, jusqu'au ${until.toLocaleDateString('fr-FR')}`;
  }
  
  if (parsed.byweekday && parsed.byweekday.length > 0) {
    desc += ` (${parsed.byweekday.join(', ')})`;
  }
  
  return desc;
}

/**
 * Calcule la date de fin d'un événement récurrent et renvoie une ISO string normalisée (YYYY-MM-DD)
 * @param dateDebut - Date de début (string ou Date)
 * @param frequency - Fréquence (daily, weekly, monthly, yearly)
 * @param count - Nombre d'occurrences
 * @param interval - Intervalle (défaut 1)
 * @returns Date de fin en string ISO YYYY-MM-DD
 */
export function calculateEndDateToIsoString(
  dateDebut: string | Date,
  frequency: string,
  count: number,
  interval: number = 1
): string {
  const start = typeof dateDebut === 'string' ? new Date(dateDebut) : new Date(dateDebut.getTime());
  const multiplier = count * interval;

  switch (frequency.toLowerCase()) {
    case 'daily':
      start.setDate(start.getDate() + multiplier);
      break;
    case 'weekly':
      start.setDate(start.getDate() + multiplier * 7);
      break;
    case 'monthly':
      start.setMonth(start.getMonth() + multiplier);
      break;
    case 'yearly':
      start.setFullYear(start.getFullYear() + multiplier);
      break;
  }

  // Retourne YYYY-MM-DD
  return start.toISOString().split('T')[0];
}

/**
 * Normalise une date (string ISO ou Date) en string YYYY-MM-DD
 * @param date - string ISO (ex: 2025-10-30T09:00:00) ou Date
 * @returns YYYY-MM-DD
 */
export function toIsoDateString(date: string | Date): string {
  const Madate = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(Madate.getTime())) return ''; // date invalide
  return Madate.toISOString().split('T')[0];
}



//  Génère une description textuelle pour un événement récurrent

export function formatRecurrentEventDisplay(event: any, clickedDate: Date | string): string {
  if (!event.rrule) return '';

  const parsed = parseRRule(event.rrule);

  const startDateStr = toIsoDateString(event.dateDebut!);
  const clickDateStr = toIsoDateString(clickedDate);

  const occurrences: string[] = [];
  if (parsed.count && parsed.freq) {
    for (let i = 0; i < parsed.count; i++) {
      const d = calculateEndDateToIsoString(startDateStr, parsed.freq, i + 1, parsed.interval || 1);
      occurrences.push(d);
    }
  } else if (parsed.until) {
    const start = new Date(startDateStr);
    const end = new Date(parsed.until);
    let current = new Date(start);
    while (current <= end) {
      occurrences.push(toIsoDateString(current));
      switch (parsed.freq) {
        case 'daily': current.setDate(current.getDate() + (parsed.interval || 1)); break;
        case 'weekly': current.setDate(current.getDate() + 7 * (parsed.interval || 1)); break;
        case 'monthly': current.setMonth(current.getMonth() + (parsed.interval || 1)); break;
        case 'yearly': current.setFullYear(current.getFullYear() + (parsed.interval || 1)); break;
      }
    }
  } else {
    occurrences.push(startDateStr);
  }

  const sessionIndex = occurrences.findIndex(d => d === clickDateStr) + 1;
  const name = event.titleEvenement || 'Groupe';
  const freqLabel = parsed.freq ? parsed.freq.charAt(0).toUpperCase() + parsed.freq.slice(1).toLowerCase() : '';
  const totalSessions = parsed.count || occurrences.length;
  const endDateStr = parsed.count
    ? calculateEndDateToIsoString(startDateStr, parsed.freq!, parsed.count, parsed.interval || 1)
    : parsed.until
      ? toIsoDateString(parsed.until)
      : startDateStr;
  const timeRange = event.allDay
    ? 'Toute la journée'
    : `${event.heureDebut || '--'} → ${event.heureFin || '--'}`;
  const ordinal = (n: number) => n === 1 ? '1ʳᵉ' : `${n}ᵉ`;

  return `${ordinal(sessionIndex)} séance du ${name} tenue ${freqLabel} pendant ${totalSessions} fois. À partir du : ${startDateStr} Au : ${endDateStr} Heure : ${timeRange}`;
};

/**
 * Génère une description lisible et naturelle d’un événement (simple ou récurrent)
 * en combinant la RRule et les champs de la DB.
 */
export function describeEvenement(event: any): string {
  if (!event) return "";

  const { rrule, allDay, heureDebut, heureFin, dateDebut } = event;
  const parsed = rrule ? parseRRule(rrule) : null;

  // Format de date locale
  const formatDate = (d: string | Date) =>
    new Date(d).toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Horaire
  const horaire = allDay
    ? "toute la journée"
    : `${heureDebut || "--"} → ${heureFin || "--"}`;

  // Événement non récurrent
  if (!parsed || !parsed.freq) {
    return `Activité prévue le ${formatDate(dateDebut)}. Horaire : ${horaire}.`;
  }

  // Événement récurrent
  const freqLabel = getFrequencyLabel(parsed.freq);
  const startStr = formatDate(parsed.dtstart || dateDebut);
  let endStr = "";

  // Calcul de la fin
  if (parsed.count && parsed.freq) {
    const endDateIso = calculateEndDateToIsoString(
      dateDebut,
      parsed.freq,
      parsed.count,
      parsed.interval || 1
    );
    endStr = formatDate(endDateIso);
  } else if (parsed.until) {
    endStr = formatDate(parsed.until);
  } else {
    endStr = startStr;
  }

  // Nombre de séances
  const nbSessions = parsed.count
    ? `${parsed.count} séance${parsed.count > 1 ? "s" : ""}`
    : "plusieurs séances";

  // Phrase finale
  return `Activité ${freqLabel.toLowerCase()} pendant ${nbSessions}. Du ${startStr} au ${endStr}. Horaire : ${horaire}.`;
};