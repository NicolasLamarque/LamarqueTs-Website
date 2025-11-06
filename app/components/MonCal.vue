<template>
  <!-- Conteneur principal -->
  <div class="p-6 bg-slate-50 dark:bg-gray-950 min-h-screen transition-colors duration-500">
    <!-- Calendrier -->
    <div class="container mx-auto max-w-7xl"> 
      <h1 class="text-4xl font-extrabold text-slate-800 dark:text-gray-100 mb-6 text-center">
        Calendrier d'événements 📅
      </h1>
      
      <!-- Message de chargement -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
        <p class="font-semibold">Erreur de chargement</p>
        <p>{{ error }}</p>
      </div>

      <!-- Calendrier -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 md:p-8 transform transition-all duration-300 hover:shadow-3xl">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>

  <!-- Modale d'événement -->
  <EventModal
    :show="showModal"
    :evenement="currentEvenement"
    @close="closeModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// 💡 AJOUT NÉCESSAIRE : Importation du plugin rrule pour la récurrence
import rrulePlugin from '@fullcalendar/rrule'; 
import frLocale from '@fullcalendar/core/locales/fr';
import type { EventClickArg, EventInput } from '@fullcalendar/core';
// Importation du composant Modale (assurez-vous que le chemin est correct)
import EventModal from './EventModal.vue'; 

// 💡 HARMONISATION DU TYPE : Renommer l'interface pour utiliser EvenementSelect
// En se basant sur la structure EventData fournie.
interface EvenementSelect {
  id?: number | null;
  titleEvenement: string;
  TextEvenement: string;
  dateDebut: string | null | undefined;
  heureDebut: string | null;
  dateFin: string | null| undefined;
  heureFin: string | null;
  allDay: boolean;
  AuthorEvenement: string;
  groupId: string | null;
  CategoryEvenement: string | null;
  ImageEvenement?: string | null;
  TagsEvenement?: string | null;
  link?: string | null;
  icon?: string | null;
  color?: string | null;
  isRecurrent?: boolean;
  recurrentId?: number | null;
  recurrentRule?: string | null; // C'est la RRule au format texte
  originalDate?: string | null | undefined;
  status: string;
  location?: string | null;
  createdAt?: string;
  updatedAt?: string;
  recurrentCount?: number;
  // 💡 AJOUT pour les exceptions aux événements récurrents (exdate)
  exdate?: string | null; 
}

// États
const evenements = ref<EvenementSelect[]>([]); // Utilisation du nouveau type
const showModal = ref(false);
const currentEvenement = ref<EvenementSelect | null>(null); // Utilisation du nouveau type
const loading = ref(true);
const error = ref<string | null>(null);


// 💡 NOUVELLE FONCTION : Transformer la RRule du backend au format FullCalendar
function parseRRuleForFullCalendar(
  rruleString: string | null | undefined, 
  dtStart: string | null | undefined
): any | null {
  if (!rruleString || !dtStart) return null;

  // Si la règle est déjà au format "RRULE:...", on enlève le préfixe si nécessaire
  const rruleOnly = rruleString.startsWith('RRULE:') ? rruleString.substring(6) : rruleString;
  
  const rrule: any = {};
  const parts = rruleOnly.split(';');

  parts.forEach(part => {
    const [key, value] = part.split('=');
    
    // Fréquence (ex: DAILY, WEEKLY)
    if (key === 'FREQ') rrule.freq = value.toLowerCase();
    
    // Intervalle (ex: 1, 2)
    if (key === 'INTERVAL') rrule.interval = parseInt(value);
    
    // Compte (nombre d'occurrences)
    if (key === 'COUNT') rrule.count = parseInt(value);
    
    // Date de fin (ex: 20251231T000000Z)
    if (key === 'UNTIL') {
       // Convertir le format de l'API (YYYMMDDTHHMMSS) au format JavaScript (YYYY-MM-DDTHH:MM:SS)
       const year = value.substring(0, 4);
       const month = value.substring(4, 6);
       const day = value.substring(6, 8);
       const time = value.substring(9, 15);
       rrule.until = `${year}-${month}-${day}T${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)}`;
    }
    
    // Jours de la semaine (ex: MO,TU,WE)
    if (key === 'BYDAY') rrule.byweekday = value.split(',').map(d => d.toLowerCase());
  });
  
  // DTSTART est obligatoire pour la récurrence. On l'injecte à partir de l'événement.
  // FullCalendar attend la date/heure de la première occurrence.
  if (dtStart) {
    rrule.dtstart = dtStart;
  }
  
  return rrule;
}


// Chargement des événements
onMounted(async () => {
  try {
    loading.value = true;
    // 💡 S'assurer du bon typage à la réception
    const response = await $fetch<EvenementSelect[]>('/api/events'); 
    
    evenements.value = response;
    
  } catch (err: any) {
    error.value = err?.message || 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
});

// Fonction pour déterminer la couleur d'un événement (inchangée)
const getEventColor = (event: EvenementSelect): { background: string; border: string } => {
  // ... (Logique inchangée : couleur personnalisée, puis icône, puis catégorie)
  if (event.color) {
    return {
      background: event.color,
      border: event.color
    };
  }
  
  const categoryColors: Record<string, { background: string; border: string }> = {
    work: { background: '#3b82f6', border: '#1d4ed8' },
    personal: { background: '#10b981', border: '#059669' },
    meeting: { background: '#8b5cf6', border: '#6d28d9' },
    holiday: { background: '#f59e0b', border: '#d97706' },
    default: { background: '#6b7280', border: '#4b5563' }
  };
  
  if (event.icon) {
    // Si l'icône est utilisée pour la couleur
    return {
      background: event.icon,
      border: event.icon
    };
  }
  
  const category = event.CategoryEvenement?.toLowerCase() || 'default';
  return (categoryColors[category] ?? categoryColors.default) as { background: string; border: string };
};

// 💡 MODIFICATION MAJEURE : Transformation des événements pour FullCalendar (gestion de la récurrence)
const calendarEvents = computed<EventInput[]>(() => {
  return evenements.value.map((event: EvenementSelect) => {
    const colors = getEventColor(event);
    
    // Construire les dates de début et fin
    let startDate = event.dateDebut;
    let endDate = event.dateFin;
    
    // Ajouter les heures si non "allDay"
    if (!event.allDay && event.heureDebut && startDate) {
      startDate = `${startDate}T${event.heureDebut}`;
    }
    if (!event.allDay && event.heureFin && endDate) {
      endDate = `${endDate}T${event.heureFin}`;
    }
    
    const baseEvent = {
      id: event.id?.toString() || '',
      title: event.titleEvenement || 'Sans titre',
      allDay: event.allDay,
      backgroundColor: colors.background,
      borderColor: colors.border,
      extendedProps: {
        location: event.location,
        status: event.status,
        category: event.CategoryEvenement,
        description: event.TextEvenement,
        icon: event.icon,
        author: event.AuthorEvenement,
        image: event.ImageEvenement,
        tags: event.TagsEvenement,
        link: event.link,
        color: event.color,
        isRecurrent: event.isRecurrent,
        recurrentId: event.recurrentId,
        recurrentRule: event.recurrentRule,
        originalDate: event.originalDate,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        recurrentCount: event.recurrentCount,
        groupId: event.groupId
      }
    };
    
    if (event.isRecurrent && event.recurrentRule && startDate) {
      // 💡 LOGIQUE DE RÉCURRENCE
      const rrule = parseRRuleForFullCalendar(event.recurrentRule, startDate);
      
      // La durée est nécessaire pour les événements récurrents (ex: '01:00')
      let duration = null;
      if (!event.allDay && event.heureDebut && event.heureFin) {
        // Calculer la durée entre heureDebut et heureFin au format HH:MM:SS (simplifié)
        const start = new Date(`2000/01/01 ${event.heureDebut}`);
        const end = new Date(`2000/01/01 ${event.heureFin}`);
        const diffInMs = end.getTime() - start.getTime();
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        duration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
      } else if (event.allDay) {
        // Durée pour les événements AllDay si nécessaire (sinon pas de duration)
        duration = '24:00:00'; 
      }
      
      return {
        ...baseEvent,
        rrule: rrule,
        duration: duration || '01:00:00', // Durée par défaut si non calculée
        // Les dates d'exceptions (exdates) peuvent être fournies par l'API
        exdate: event.exdate ? event.exdate.split(',').map(d => d.trim()).filter(Boolean) : [],
        // Pour un événement récurrent, FullCalendar gère start/end via rrule
        start: undefined, 
        end: undefined
      };
      
    } else {
      // Événement simple (non récurrent)
      return {
        ...baseEvent,
        start: startDate || undefined,
        end: endDate || undefined,
      };
    }
  });
});

// Gestion du clic sur un événement (inchangée)
const handleEventClick = (info: EventClickArg) => {
  const eventId = info.event.id;
  // Utiliser find avec la propriété id de l'événement et pas seulement l'extendedProps
  const evenement = evenements.value.find(event => event.id?.toString() === eventId);
  
  if (evenement) {
    currentEvenement.value = evenement;
    showModal.value = true;
  }
};

// Fermeture de la modale (inchangée)
const closeModal = () => {
  showModal.value = false;
  currentEvenement.value = null;
};

// 💡 MODIFICATION : Configuration du calendrier (ajout de rrulePlugin)
const calendarOptions = computed(() => ({
  // 💡 AJOUT DU PLUGIN rrulePlugin
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin], 
  initialView: 'dayGridMonth',
  locale: frLocale,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  buttonText: {
    today: "Aujourd'hui",
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour'
  },
  events: calendarEvents.value,
  eventClick: handleEventClick,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  editable: false,
  eventDisplay: 'block',
  displayEventTime: true,
  displayEventEnd: true,
  height: 'auto',
  eventTimeFormat: {
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    meridiem: false
  },
  slotLabelFormat: {
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    meridiem: false
  }
}));
</script>
<style scoped>
/* Styles globaux du calendrier */
:deep(.fc) {
  @apply text-sm;
}

:deep(.fc-theme-standard td),
:deep(.fc-theme-standard th) {
  @apply border-gray-200 dark:border-gray-700;
}

:deep(.fc-theme-standard) {
  @apply text-gray-800 dark:text-gray-200;
}

:deep(.fc-toolbar-title) {
  @apply text-2xl font-bold text-slate-700 dark:text-gray-100;
}

:deep(.fc-button) {
  @apply bg-slate-200 text-slate-700 rounded-lg shadow-md hover:bg-slate-300;
  @apply dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600;
  @apply transition-colors duration-200 border-0;
}

:deep(.fc-button-active) {
  @apply bg-blue-500 text-white dark:bg-blue-600;
}

:deep(.fc-button:disabled) {
  @apply opacity-50 cursor-not-allowed;
}

:deep(.fc-daygrid-day-number) {
  @apply text-gray-700 dark:text-gray-300;
}

:deep(.fc-col-header-cell) {
  @apply bg-slate-100 dark:bg-gray-700 font-semibold;
}

:deep(.fc-day-today) {
  @apply bg-blue-50 dark:bg-blue-900/20;
}

:deep(.fc-event) {
  @apply cursor-pointer transition-transform duration-150 hover:scale-105;
}

:deep(.fc-event-title) {
  @apply font-medium;
}

:deep(.fc-scrollgrid) {
  @apply border-gray-200 dark:border-gray-700;
}

/* Animation d'apparition */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  animation: fadeIn 0.5s ease-out;
}
</style>