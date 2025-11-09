<template>
  <!-- Conteneur principal -->
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 transition-colors duration-500">
    <div class="container mx-auto max-w-7xl px-4 py-8">
      <!-- En-tête -->
      <header class="mb-8 text-center">
        <h1 class="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          📅 Calendrier d'Événements
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          Découvrez tous nos événements à venir
        </p>
      </header>

      <!-- Filtres -->
      <div class="mb-6 flex flex-wrap gap-4 items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            <i class="fas fa-filter mr-1"></i>Catégorie:
          </label>
          <select v-model="filterCategory" class="form-select text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option value="">Toutes</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            <i class="fas fa-check-circle mr-1"></i>Statut:
          </label>
          <select v-model="filterStatus" class="form-select text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option value="">Tous</option>
            <option value="confirmed">Confirmé</option>
            <option value="tentative">Provisoire</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>

        <button 
          @click="resetFilters" 
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          <i class="fas fa-redo mr-1"></i>Réinitialiser
        </button>
      </div>

      <!-- Message de chargement -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-20">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <i class="fas fa-calendar text-blue-600 text-2xl"></i>
          </div>
        </div>
        <p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">Chargement des événements...</p>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-6 rounded-lg shadow-lg mb-6">
        <div class="flex items-start">
          <i class="fas fa-exclamation-triangle text-2xl mr-3 mt-1"></i>
          <div>
            <p class="font-bold text-lg mb-1">Erreur de chargement</p>
            <p>{{ error }}</p>
            <button @click="loadEvents" class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              <i class="fas fa-sync-alt mr-1"></i>Réessayer
            </button>
          </div>
        </div>
      </div>

      <!-- Message si aucun événement -->
      <div v-else-if="filteredEvents.length === 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
        <i class="fas fa-calendar-times text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Aucun événement</h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ filterCategory || filterStatus ? "Aucun événement ne correspond à vos filtres." : "Aucun événement n'est programmé pour le moment." }}
        </p>
      </div>

      <!-- Calendrier -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 transform transition-all duration-300 hover:shadow-3xl">
        <FullCalendar :options="calendarOptions" />
      </div>

      <!-- Statistiques -->
      <div v-if="!loading && evenements.length > 0" class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <i class="fas fa-calendar-check text-3xl text-green-500 mb-2"></i>
          <p class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{ stats.confirmed }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Événements confirmés</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <i class="fas fa-repeat text-3xl text-blue-500 mb-2"></i>
          <p class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{ stats.recurrent }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Événements récurrents</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <i class="fas fa-tags text-3xl text-purple-500 mb-2"></i>
          <p class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{ categories.length }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Catégories</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Modale d'événement -->
  <EventModal
    :show="showModal"
    :event="selectedEvent"
    :clicked-date="clickedEventDate"
    @close="closeModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import frLocale from '@fullcalendar/core/locales/fr';
import type { EventClickArg, EventInput } from '@fullcalendar/core';
import EventModal from './EventModal.vue';

// ========================================
// INTERFACES
// ========================================

interface EvenementSelect {
  id?: number | null;
  titleEvenement: string;
  TextEvenement: string;
  dateDebut: string | null | undefined;
  heureDebut: string | null;
  dateFin: string | null | undefined;
  heureFin: string | null;
  allDay: boolean;
  AuthorEvenement: string;
  CategoryEvenement: string | null;
  ImageEvenement?: string | null;
  TagsEvenement?: string | null;
  Link?: string | null;
  color?: string | null;
  isRecurrent?: boolean;
  rrule?: string | null;
  duration?: string | null;
  status: string;
  location?: string | null;
  createdAt?: string;
  updatedAt?: string;
  exdate?: string | null;
  avatarAnimateur?: string | null;
  nomAnimateur?: string | null;
  iconEvenement?: string | null;
  themeVisuel?: string | null;
}

// ========================================
// ÉTATS
// ========================================

const evenements = ref<EvenementSelect[]>([]);
const showModal = ref(false);
const selectedEvent = ref<EvenementSelect | null>(null);
const clickedEventDate = ref<Date | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const filterCategory = ref("");
const filterStatus = ref("");

// ========================================
// COMPUTED PROPERTIES
// ========================================

const categories = computed(() => {
  const cats = new Set<string>();
  evenements.value.forEach((e) => {
    if (e.CategoryEvenement) cats.add(e.CategoryEvenement);
  });
  return Array.from(cats).sort();
});

const filteredEvents = computed(() => {
  return evenements.value.filter((e) => {
    const matchCategory = filterCategory.value === "" || e.CategoryEvenement === filterCategory.value;
    const matchStatus = filterStatus.value === "" || e.status === filterStatus.value;
    return matchCategory && matchStatus;
  });
});

const stats = computed(() => ({
  confirmed: evenements.value.filter(e => e.status === 'confirmed').length,
  recurrent: evenements.value.filter(e => e.isRecurrent).length,
  total: evenements.value.length
}));

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

function parseRRuleForFullCalendar(
  rruleString: string | null | undefined, 
  dtStart: string | null | undefined
): any | null {
  if (!rruleString || !dtStart) return null;

  const rruleOnly = rruleString.startsWith('RRULE:') ? rruleString.substring(6) : rruleString;
  const rrule: any = {};
  const parts = rruleOnly.split(';');

  parts.forEach(part => {
    const [key, value] = part.split(/[:=]/);
    
    if (key === 'FREQ') rrule.freq = value.toLowerCase();
    if (key === 'INTERVAL') rrule.interval = parseInt(value);
    if (key === 'COUNT') rrule.count = parseInt(value);
    
    if (key === 'DTSTART') {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      const hour = value.substring(9, 11) || '00';
      const minute = value.substring(11, 13) || '00';
      rrule.dtstart = `${year}-${month}-${day}T${hour}:${minute}:00`;
    }
    
    if (key === 'UNTIL') {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      const hour = value.substring(9, 11) || '23';
      const minute = value.substring(11, 13) || '59';
      rrule.until = `${year}-${month}-${day}T${hour}:${minute}:00`;
    }
    
    if (key === 'BYDAY') rrule.byweekday = value.split(',').map(d => d.toLowerCase());
  });
  
  if (dtStart) {
    rrule.dtstart = dtStart;
  }
  
  return rrule;
}

function getEventColor(event: EvenementSelect): { background: string; border: string } {
  if (event.color) {
    return {
      background: event.color,
      border: event.color
    };
  }
  
  const categoryColors: Record<string, { background: string; border: string }> = {
    rencontre: { background: '#57c7db', border: '#369fb3' },
    allo: { background: '#369459', border: '#286841' },
    'groupe fermé': { background: '#7354de', border: '#5a3fb8' },
    work: { background: '#3b82f6', border: '#1d4ed8' },
    personal: { background: '#10b981', border: '#059669' },
    meeting: { background: '#8b5cf6', border: '#6d28d9' },
    holiday: { background: '#f59e0b', border: '#d97706' },
    sport: { background: '#ef4444', border: '#dc2626' },
    culture: { background: '#ec4899', border: '#db2777' },
    default: { background: '#6b7280', border: '#4b5563' }
  };
  
  const category = event.CategoryEvenement?.toLowerCase() || 'default';
  return categoryColors[category] || categoryColors.default;
}

const resetFilters = () => {
  filterCategory.value = "";
  filterStatus.value = "";
};

// ========================================
// TRANSFORMATION DES ÉVÉNEMENTS POUR FULLCALENDAR
// ========================================

const calendarEvents = computed<EventInput[]>(() => {
  return filteredEvents.value.map((event: EvenementSelect) => {
    const colors = getEventColor(event);
    
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
        author: event.AuthorEvenement,
        image: event.ImageEvenement,
        tags: event.TagsEvenement,
        link: event.Link,
        isRecurrent: event.isRecurrent,
        avatarAnimateur: event.avatarAnimateur,
        nomAnimateur: event.nomAnimateur,
        iconEvenement: event.iconEvenement,
        themeVisuel: event.themeVisuel
      }
    };
    
    // Gestion des événements récurrents
    if (event.isRecurrent && event.rrule) {
      let startDate = event.dateDebut;
      
      // Si pas de dateDebut, extraire de la RRule
      if (!startDate && event.rrule) {
        const match = event.rrule.match(/DTSTART[=:](\d{8}T\d{6})/);
        if (match) {
          const timeStr = match[1];
          const year = timeStr.substring(0, 4);
          const month = timeStr.substring(4, 6);
          const day = timeStr.substring(6, 8);
          const hour = timeStr.substring(9, 11);
          const minute = timeStr.substring(11, 13);
          startDate = `${year}-${month}-${day}T${hour}:${minute}:00`;
        }
      }
      
      const rrule = parseRRuleForFullCalendar(event.rrule, startDate);
      
      let duration = event.duration || '01:00:00';
      if (!event.allDay && event.heureDebut && event.heureFin && !event.duration) {
        const start = new Date(`2000/01/01 ${event.heureDebut}`);
        const end = new Date(`2000/01/01 ${event.heureFin}`);
        const diffInMs = end.getTime() - start.getTime();
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        duration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
      }
      
      return {
        ...baseEvent,
        rrule: rrule,
        duration: duration,
        exdate: event.exdate ? event.exdate.split(',').map(d => d.trim()).filter(Boolean) : [],
        start: undefined,
        end: undefined
      };
    }
    
    // Événement simple
    let startDate = event.dateDebut;
    let endDate = event.dateFin;
    
    if (!event.allDay && event.heureDebut && startDate) {
      startDate = `${startDate}T${event.heureDebut}`;
    }
    if (!event.allDay && event.heureFin && endDate) {
      endDate = `${endDate}T${event.heureFin}`;
    }
    
    return {
      ...baseEvent,
      start: startDate || undefined,
      end: endDate || undefined,
    };
  });
});

// ========================================
// GESTION DES ÉVÉNEMENTS
// ========================================

const handleEventClick = (info: EventClickArg) => {
  const eventId = info.event.id;
  const evenement = evenements.value.find(event => event.id?.toString() === eventId);
  
  if (evenement) {
    // ✅ Capture de la date cliquée (occurrence spécifique)
    clickedEventDate.value = info.event.start ? new Date(info.event.start) : new Date();
    selectedEvent.value = evenement;
    showModal.value = true;
    
    console.log('🖱️ Événement cliqué:', {
      titre: evenement.titleEvenement,
      date: clickedEventDate.value,
      isRecurrent: evenement.isRecurrent
    });
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedEvent.value = null;
  clickedEventDate.value = null;
};

// ========================================
// CHARGEMENT DES DONNÉES
// ========================================

const loadEvents = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    console.log('📡 Chargement des événements...');
    const response = await $fetch<EvenementSelect[]>('/api/events');
    
    if (!response) {
      throw new Error('Aucune donnée reçue du serveur');
    }
    
    evenements.value = response;
    console.log('✅ Événements chargés:', evenements.value.length);
    
    const recurrent = evenements.value.filter(e => e.isRecurrent);
    if (recurrent.length > 0) {
      console.log('🔄 Événements récurrents:', recurrent.length);
      recurrent.forEach(e => {
        console.log('  -', e.titleEvenement, ':', e.rrule);
      });
    }
    
  } catch (err: any) {
    console.error('❌ Erreur lors du chargement des événements:', err);
    error.value = err.message || 'Impossible de charger les événements. Veuillez réessayer.';
    evenements.value = [];
  } finally {
    loading.value = false;
  }
};

// ========================================
// CONFIGURATION DU CALENDRIER
// ========================================

const calendarOptions = computed(() => ({
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
  },
  nowIndicator: true,
  navLinks: true,
  eventClassNames: 'cursor-pointer transition-transform hover:scale-105',
  dayCellClassNames: 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
}));

// ========================================
// WATCHERS
// ========================================

watch([filterCategory, filterStatus], () => {
  console.log('🔍 Filtres appliqués:', {
    category: filterCategory.value || 'Toutes',
    status: filterStatus.value || 'Tous',
    résultats: filteredEvents.value.length
  });
});

// ========================================
// LIFECYCLE
// ========================================

onMounted(() => {
  console.log('🚀 MonCal.vue monté');
  loadEvents();
});
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
  @apply text-3xl font-bold text-slate-700 dark:text-gray-100;
}

:deep(.fc-button) {
  @apply bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700;
  @apply dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800;
  @apply transition-all duration-200 border-0 font-medium;
}

:deep(.fc-button-active) {
  @apply bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105;
}

:deep(.fc-button:disabled) {
  @apply opacity-50 cursor-not-allowed;
}

:deep(.fc-daygrid-day-number) {
  @apply text-gray-700 dark:text-gray-300 font-semibold;
}

:deep(.fc-col-header-cell) {
  @apply bg-gradient-to-r from-slate-100 to-blue-50 dark:from-gray-700 dark:to-gray-600 font-bold text-gray-700 dark:text-gray-200;
}

:deep(.fc-day-today) {
  @apply bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20;
}

:deep(.fc-event) {
  @apply cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg;
}

:deep(.fc-event-title) {
  @apply font-semibold;
}

:deep(.fc-scrollgrid) {
  @apply border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden;
}

:deep(.fc-daygrid-day:hover) {
  @apply bg-gray-50 dark:bg-gray-700 transition-colors;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  animation: fadeIn 0.6s ease-out;
}

.form-select {
  @apply px-4 py-2 rounded-lg border-2 focus:border-blue-500 focus:outline-none transition-all;
}

.shadow-3xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>