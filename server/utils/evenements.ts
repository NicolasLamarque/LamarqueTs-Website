// ========================================
// server/utils/evenements.ts - VERSION RRULE UNIFIÉE
// ========================================
import { db } from "./db";
import { evenements, Evenement } from "./schema";
import { eq } from "drizzle-orm";

// ========================================
// TYPES
// ========================================

/**
 * Type pour les données venant de la DB
 * (ce que Drizzle retourne avec $inferSelect)
 */
//export type { Evenement };

/**
 * Type pour la durée (calcul de durée entre heures)
 */
export interface EvenementDuree {
  heureDebut: string | null;
  heureFin: string | null;
}

// ========================================
// FONCTIONS CRUD DE BASE
// ========================================

/**
 * Créer un événement (simple OU récurrent)
 * La logique RRule est gérée par la route API
 */
export async function insertEvenement(evenement: Partial<Evenement>) {
  const [newEvenement] = await db.insert(evenements)
    .values({
      ...evenement,
      updatedAt: new Date(),
    } as Evenement)
    .returning();
  
  return newEvenement;
}

/**
 * Récupérer tous les événements
 * Retourne TOUS les événements (simples et récurrents)
 * FullCalendar se charge d'afficher les occurrences via RRule
 */
export async function getAllEvenements() {
  return db.select()
    .from(evenements)
    .orderBy(evenements.createdAt);
}

/**
 * Récupérer un événement par ID
 */
export async function getEvenementById(id: number): Promise<Evenement | undefined> {
  const [evenement] = await db.select()
    .from(evenements)
    .where(eq(evenements.id, id))
    .limit(1);
  
  return evenement;
}

/**
 * Mettre à jour un événement
 */
export async function updateEvenement(id: number, evenement: Partial<Evenement>) {
  const [updatedEvenement] = await db.update(evenements)
    .set({
      ...evenement,
      updatedAt: new Date(),
    })
    .where(eq(evenements.id, id))
    .returning();
  
  return updatedEvenement;
}

/**
 * Supprimer un événement
 */
export async function deleteEvenement(id: number) {
  const [deletedEvenement] = await db.delete(evenements)
    .where(eq(evenements.id, id))
    .returning();
  
  return deletedEvenement;
}

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

/**
 * Récupérer les heures d'un événement pour calculer sa durée
 * Utilisé par la route /api/events/getduree
 */
export async function getEvenementDureeData(id: number): Promise<EvenementDuree | undefined> {
  const [row] = await db.select({
    heureDebut: evenements.heureDebut,
    heureFin: evenements.heureFin,
  })
  .from(evenements)
  .where(eq(evenements.id, id))
  .limit(1);

  return row;
}

/**
 * Calculer la durée en minutes entre deux heures
 */
export function calculateDurationMinutes(heureDebut: string | null, heureFin: string | null): number {
  if (!heureDebut || !heureFin) return 0;
  
  try {
    const debut = new Date(`2000-01-01T${heureDebut}`);
    const fin = new Date(`2000-01-01T${heureFin}`);
    
    const dureeMs = fin.getTime() - debut.getTime();
    return dureeMs > 0 ? dureeMs / (1000 * 60) : 0;
  } catch {
    return 0;
  }
}

/**
 * Formater la durée en format HH:MM
 */
export function formatDuration(heureDebut: string | null, heureFin: string | null): string {
  if (!heureDebut || !heureFin) return '01:00';
  
  try {
    const debut = new Date(`2000-01-01T${heureDebut}`);
    const fin = new Date(`2000-01-01T${heureFin}`);
    
    const diffMs = fin.getTime() - debut.getTime();
    if (diffMs <= 0) return '01:00';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch {
    return '01:00';
  }
}

// ========================================
// HELPERS POUR RRULE (utilisés par les routes)
// ========================================

/**
 * Construire une string RRule à partir des paramètres
 */
export function buildRRuleString(params: {
  dateDebut: string;
  heureDebut?: string;
  frequency?: string;
  interval?: number;
  count?: number;
  endDate?: string;
  byweekday?: string[];
  allDay?: boolean;
}): string {
  const parts: string[] = [];
  
  // Fréquence (par défaut DAILY si non spécifié)
  const freq = params.frequency || 'daily';
  parts.push(`FREQ=${freq.toUpperCase()}`);
  
  // Intervalle
  const interval = params.interval || 1;
  if (interval > 1) {
    parts.push(`INTERVAL=${interval}`);
  }
  
  // Date/heure de début
  const time = params.heureDebut || (params.allDay ? '00:00' : '09:00');
  parts.push(`DTSTART=${params.dateDebut}T${time}:00`);
  
  // Fin : soit par COUNT, soit par UNTIL
  if (params.count && params.count > 0) {
    parts.push(`COUNT=${params.count}`);
  } else if (params.endDate) {
    const endTime = params.allDay ? '23:59:59' : `${time}:00`;
    parts.push(`UNTIL=${params.endDate}T${endTime}`);
  } else {
    // Par défaut : événement simple = 1 occurrence
    parts.push(`COUNT=1`);
  }
  
  // Jours de la semaine (pour récurrence hebdomadaire)
  if (params.byweekday && params.byweekday.length > 0) {
    parts.push(`BYDAY=${params.byweekday.join(',').toUpperCase()}`);
  }
  
  return parts.join(';');
}

/**
 * Parser une string RRule en objet
 */
export function parseRRuleString(rruleString: string): {
  freq: string;
  interval: number;
  dtstart: string;
  count?: number;
  until?: string;
  byweekday?: string[];
} {
  const parts = rruleString.split(';');
  const result: any = { interval: 1 };
  
  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key === 'FREQ') result.freq = value.toLowerCase();
    if (key === 'INTERVAL') result.interval = parseInt(value);
    if (key === 'DTSTART') result.dtstart = value;
    if (key === 'COUNT') result.count = parseInt(value);
    if (key === 'UNTIL') result.until = value;
    if (key === 'BYDAY') result.byweekday = value.toLowerCase().split(',');
  });
  
  return result;
}

/**
 * Extraire la date de début d'une RRule
 */
export function extractDateFromRRule(rrule: string): string {
  const match = rrule.match(/DTSTART=(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : new Date().toISOString().split('T')[0];
}

/**
 * Extraire l'heure de début d'une RRule
 */
export function extractTimeFromRRule(rrule: string): string {
  const match = rrule.match(/DTSTART=\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/);
  return match ? match[1] : '00:00';
}

/**
 * Vérifier si un événement est récurrent
 * (plus d'une occurrence)
 */
export function isRecurrentEvent(rrule: string | null): boolean {
  if (!rrule) return false;
  
  const parsed = parseRRuleString(rrule);
  
  // Si COUNT > 1 ou si UNTIL existe, c'est récurrent
  if (parsed.count && parsed.count > 1) return true;
  if (parsed.until) return true;
  
  return false;
}

// ========================================
// FONCTIONS DE VALIDATION
// ========================================

/**
 * Valider les données d'un événement avant insertion/mise à jour
 */
export function validateEventData(data: Partial<Evenement>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Champs obligatoires
  if (!data.titleEvenement || data.titleEvenement.trim() === '') {
    errors.push('Le titre est requis');
  }
  
  if (!data.TextEvenement || data.TextEvenement.trim() === '') {
    errors.push('La description est requise');
  }
  
  // Pour événement simple, dateDebut obligatoire
  if (!data.isRecurrent && !data.dateDebut) {
    errors.push('La date de début est requise pour un événement simple');
  }
  
  // Pour événement récurrent, RRule obligatoire
  if (data.isRecurrent && !data.rrule) {
    errors.push('La règle de récurrence est requise pour un événement récurrent');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// ========================================
// NOTES IMPORTANTES
// ========================================

/*
LOGIQUE RRULE UNIFIÉE :

1. ÉVÉNEMENT SIMPLE :
   - dateDebut: Date de l'événement
   - heureDebut/heureFin: Heures de l'événement
   - isRecurrent: false
   - rrule: null OU "FREQ=DAILY;COUNT=1;DTSTART=..."
   - duration: null

2. ÉVÉNEMENT RÉCURRENT :
   - dateDebut: null (pas utilisé, info dans rrule)
   - heureDebut/heureFin: null (pas utilisé, info dans rrule)
   - isRecurrent: true
   - rrule: "FREQ=WEEKLY;INTERVAL=2;COUNT=10;DTSTART=2025-10-30T09:00:00"
   - duration: "08:00" (durée de chaque occurrence)

3. AVANTAGES :
   - 1 ligne en DB au lieu de 100 pour 100 occurrences
   - FullCalendar génère automatiquement les occurrences
   - Modification = 1 UPDATE au lieu de 100
   - Standard RFC 5545 (compatible Google Calendar, Outlook, etc.)

4. MIGRATION DEPUIS L'ANCIEN SYSTÈME :
   - Supprimer toutes les occurrences dupliquées
   - Garder uniquement le master avec la RRule
   - Supprimer les colonnes : recurrentId, originalDate, groupId
   - Ajouter les colonnes : rrule, duration, exdate

5. GESTION DES EXCEPTIONS :
   - Pour annuler UNE occurrence : ajouter la date dans exdate
   - exdate: "2025-11-13,2025-12-25" (dates séparées par virgules)
   - FullCalendar ne les affichera pas automatiquement
*/