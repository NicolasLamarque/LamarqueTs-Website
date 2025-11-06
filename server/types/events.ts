// ============================================
// 📁 server/types/events.ts
// Types partagés pour les événements
// ============================================

export interface RecurrentEventInput {
  // Info de base
  titleEvenement: string;
  TextEvenement: string;
  
  // Horaire de chaque occurrence
  dateDebut: string;        // "2025-10-30"
  heureDebut: string;       // "09:00"
  heureFin: string;         // "17:00"
  allDay: boolean;
  
  // Récurrence
  recurrentRule: string;    // "FREQ=WEEKLY;INTERVAL=2"
  recurrentEndDate?: string; // "2025-12-30"
  recurrentCount?: number;   // OU nombre d'occurrences
  
  // Autres
  AuthorEvenement?: string;
  CategoryEvenement?: string;
  color?: string;
  location?: string;
  status?: string;
}

export interface RecurrentRule {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  byday?: string[];  // ['MO', 'WE', 'FR']
}

export interface EventOccurrence {
  titleEvenement: string;
  TextEvenement: string;
  dateDebut: Date;
  dateFin: Date | null;
  heureDebut: string | null;
  heureFin: string | null;
  allDay: boolean;
  isRecurrent: boolean;
  recurrentId: number | null;
  recurrentRule: string | null;
  originalDate: Date | null;
  AuthorEvenement: string | null;
  CategoryEvenement: string | null;
  color: string;
  location: string | null;
  status: string;
  updatedAt: Date;
}

