<template>
  <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl border-t-4 border-sky-500">
    <header class="mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        <i class="fas fa-calendar-alt text-sky-500 mr-2"></i>
        Gestion des Événements
      </h2>

      <div class="flex justify-between items-center">
        <div class="flex gap-2">
          <select v-model="filterCategory" class="form-select text-sm">
            <option value="">Toutes les catégories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="filterStatus" class="form-select text-sm">
            <option value="">Tous les statuts</option>
            <option value="confirmed">Confirmé</option>
            <option value="tentative">Provisoire</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>

        <button @click="toggleView" class="bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-600 transition-all">
          <i :class="showCalendar ? 'fas fa-list' : 'fas fa-calendar-alt'" class="mr-2"></i>
          {{ showCalendar ? "Voir la liste" : "Voir le calendrier" }}
        </button>
      </div>
    </header>

    <Transition name="fade">
      <div v-if="message" :class="{'bg-green-500': message.type === 'success', 'bg-red-500': message.type === 'error'}" class="text-white p-3 rounded-lg shadow-md mb-4">
        {{ message.text }}
      </div>
    </Transition>

    <Transition name="fade" mode="out-in">
      <div v-if="showCalendar" key="calendar">
        <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 md:p-10">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>

      <div v-else key="gestion" class="space-y-6">
        <section class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
            {{ editMode ? "Modifier l'événement" : "Ajouter un événement" }}
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="form-group">
                <label class="form-label">Titre <span class="text-red-500">*</span></label>
                <input v-model="form.titleEvenement" type="text" class="form-input" required />
              </div>

              <div class="form-group">
                <label class="form-label">Auteur <span class="text-red-500">*</span></label>
                <input v-model="form.AuthorEvenement" type="text" class="form-input" required />
              </div>

              <div class="form-group">
                <label class="form-label">avatar de l'animateur</label>
                <textarea v-model="form.avatarAnimateur" class="form-textarea"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Catégorie <span class="text-red-500">*</span></label>
                <input v-model="form.CategoryEvenement" type="text" class="form-input" list="categories-list" required />
                <datalist id="categories-list">
                  <option v-for="cat in categories" :key="cat" :value="cat" />
                </datalist>
              </div>

              <div class="form-group">
                <label class="form-label">Statut</label>
                <select v-model="form.status" class="form-select">
                  <option value="confirmed">Confirmé</option>
                  <option value="tentative">Provisoire</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Lieu</label>
                <input v-model="form.location" type="text" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Couleur</label>
                <div class="flex gap-2">
                  <input v-model="form.color" type="color" class="h-10 w-20" />
                  <input v-model="form.color" type="text" class="form-input flex-1" />
                </div>
              </div>
            </div>

            <div class="border-t pt-4">
              <h4 class="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">
                <i class="fas fa-clock mr-2"></i>Date et Heure
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="form-group">
                  <label class="form-label">
                    <input v-model="form.allDay" type="checkbox" class="mr-2" />
                    Toute la journée
                  </label>
                </div>

                <div class="form-group">
                  <label class="form-label">Date de début <span class="text-red-500">*</span></label>
                  <input v-model="form.dateDebut" type="date" class="form-input" required />
                </div>

                <div v-if="!form.allDay" class="form-group">
                  <label class="form-label">Heure de début</label>
                  <input v-model="form.heureDebut" type="time" class="form-input" />
                </div>

                <div v-if="!form.allDay" class="form-group">
                  <label class="form-label">Heure de fin</label>
                  <input v-model="form.heureFin" type="time" class="form-input" />
                </div>
              </div>
            </div>

            <div class="border-t pt-4">
              <h4 class="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">
                <i class="fas fa-repeat mr-2"></i>Récurrence
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Fréquence</label>
                  <select v-model="form.frequency" class="form-select" @change="onFrequencyChange">
                    <option :value="null">Événement simple</option>
                    <option value="daily">Quotidien</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuel</option>
                    <option value="yearly">Annuel</option>
                  </select>
                </div>

                <div v-if="form.frequency" class="form-group">
                  <label class="form-label">Tous les</label>
                  <input v-model.number="form.interval" type="number" class="form-input" min="1" />
                </div>

                <div v-if="form.frequency" class="form-group">
                  <label class="form-label">Nombre d'occurrences</label>
                  <input 
                    v-model.number="form.count" 
                    type="number" 
                    class="form-input" 
                    min="1" 
                    placeholder="Ex: 10"
                    @input="onCountChange"
                  />
                </div>

                <div v-if="form.frequency" class="form-group">
                  <label class="form-label">OU date de fin</label>
                  <input 
                    v-model="form.endDate" 
                    type="date" 
                    class="form-input" 
                    :min="form.dateDebut"
                    :disabled="!!form.count"
                  />
                  <p v-if="suggestedEndDate && form.count" class="text-xs text-gray-500 mt-1">
                    Suggéré: {{ suggestedEndDate }}
                  </p>
                </div>
              </div>

              <!-- Preview de la récurrence -->
              <div v-if="form.frequency" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p class="text-sm text-blue-800 dark:text-blue-200">
                  <i class="fas fa-info-circle mr-2"></i>
                  <strong>Récurrence:</strong> {{ recurrencePreview }}
                </p>
              </div>
            </div>

            <div class="border-t pt-4">
              <h4 class="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">
                <i class="fas fa-tags mr-2"></i>Informations complémentaires
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="form-group">
                  <label class="form-label">Tags</label>
                  <input v-model="form.TagsEvenement" type="text" class="form-input" />
                </div>

                <div class="form-group">
                  <label class="form-label">Lien</label>
                  <input v-model="form.link" type="url" class="form-input" />
                </div>

                <div class="form-group">
                  <label class="form-label">Icône</label>
                  <select v-model="form.icon" class="form-select">
                    <option value="">Choisir</option>
                    <option v-for="icon in icons" :key="icon" :value="icon">{{ icon }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="form-group">
                <label class="form-label">Description <span class="text-red-500">*</span></label>
                <textarea v-model="form.TextEvenement" class="form-textarea" rows="4" required></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Image URL</label>
                <input v-model="form.ImageEvenement" type="text" class="form-input" />
                <img v-if="form.ImageEvenement" :src="form.ImageEvenement" alt="Aperçu" class="h-32 w-auto rounded shadow mt-2" @error="handleImageError" />
              </div>
            </div>

            <div class="flex flex-wrap gap-4 mt-6 pt-4 border-t">
              <button type="submit" :disabled="isLoading || !isFormValid" class="btn btn-primary">
                <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
                <FontAwesomeIcon :icon="editMode ? 'save' : 'plus'" class="mr-2" />
                {{ editMode ? "Mettre à jour" : "Ajouter" }}
              </button>

              <button type="button" @click="resetForm" :disabled="isLoading" class="btn btn-secondary">
                <i class="fas fa-times mr-2"></i>Annuler
              </button>
            </div>
          </form>
        </section>

        <section class="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium">Liste des événements ({{ filteredEvents.length }})</h3>
              <input v-model="searchQuery" type="text" placeholder="Rechercher..." class="form-input w-64" />
            </div>
          </div>

          <div v-if="isLoading" class="p-8 text-center">
            <i class="fas fa-spinner fa-spin text-2xl"></i>
            <p class="mt-2">Chargement...</p>
          </div>

          <div v-else-if="filteredEvents.length === 0" class="p-8 text-center">
            <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">Aucun événement</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="table-header">Titre</th>
                  <th class="table-header">Date/Heure</th>
                  <th class="table-header">Lieu</th>
                  <th class="table-header">Auteur</th>
                  <th class="table-header">Catégorie</th>
                  <th class="table-header">Statut</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-700 divide-y">
                <tr v-for="evenement in filteredEvents" :key="evenement.id" class="hover:bg-gray-50">
                  <td class="table-cell">
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full mr-2" :style="{backgroundColor: evenement.color || '#3b82f6'}"></div>
                      <div>
                        <div class="font-medium">{{ evenement.titleEvenement }}</div>
                        <div v-if="evenement.isRecurrent" class="text-xs text-blue-600">
                          <i class="fas fa-repeat mr-1"></i>{{ getRecurrenceLabel(evenement) }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="table-cell text-sm">
                    <div>{{ formatDateDisplay(evenement) }}</div>
                    <div v-if="!evenement.allDay && evenement.heureDebut" class="text-gray-500">
                      {{ evenement.heureDebut }}<span v-if="evenement.heureFin"> - {{ evenement.heureFin }}</span>
                    </div>
                  </td>
                  <td class="table-cell">{{ evenement.location || '-' }}</td>
                  <td class="table-cell">{{ evenement.AuthorEvenement }}</td>
                  <td class="table-cell">
                    <span class="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{{ evenement.CategoryEvenement }}</span>
                  </td>
                  <td class="table-cell">
                    <span class="px-2 py-1 rounded-full text-xs" :class="getStatusClass(evenement.status)">
                      {{ getStatusLabel(evenement.status) }}
                    </span>
                  </td>
                  <td class="table-cell">
                    <div class="flex gap-2">
                      <button @click="viewEvent(evenement)" class="btn btn-sm btn-info" title="Voir">
                        <FontAwesomeIcon icon="eye" />
                      </button>
                      <button @click="editEvent(evenement)" class="btn btn-sm btn-success" title="Modifier">
                        <FontAwesomeIcon icon="edit" />
                      </button>
                      <button @click="openDeleteModal(evenement)" class="btn btn-sm btn-error" title="Supprimer">
                        <FontAwesomeIcon icon="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Transition>

    <DeleteEventModal v-if="showDeleteModal" :show="showDeleteModal" :message="deleteModalMessage" @cancel="closeDeleteModal" @single="handleDelete" @group="handleDelete" />
    <EventModal v-if="showEventModal && currentEvent" :show="showEventModal" :event="currentEvent" @close="closeEventModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import type { Ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from '@fullcalendar/rrule';
import frLocale from "@fullcalendar/core/locales/fr";
import EventModal from "../components/EventModal.vue";
import DeleteEventModal from "../components/DeleteEventModal.vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


const icons = ['fa-calendar', 'fa-bell', 'fa-birthday-cake', 'fa-briefcase', 'fa-music', 'fa-heart', 'fa-star', 'fa-graduation-cap'];

interface EvenementSelect {
  id: number;
  titleEvenement: string;
  TextEvenement: string;
  dateDebut: Date | string | null;
  heureDebut: string | null;
  heureFin: string | null;
  allDay: boolean;
  isRecurrent: boolean;
  rrule: string | null;
  duration: string | null;
  exdate: string | null;
  AuthorEvenement: string | null;
  avatarAnimateur: string | null;
  CategoryEvenement: string | null;
  ImageEvenement: string | null;
  TagsEvenement: string | null;
  link: string | null;
  icon: string | null;
  color: string | null;
  status: string;
  location: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
}

interface EvenementForm {
  id: number | null;
  titleEvenement: string;
  TextEvenement: string;
  dateDebut: string;
  heureDebut: string | null;
  heureFin: string | null;
  allDay: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  interval: number;
  count: number | null;
  endDate: string | null;
  byweekday: string[];
  AuthorEvenement: string;
  avatarAnimateur: string;
  CategoryEvenement: string;
  ImageEvenement: string;
  TagsEvenement: string;
  link: string;
  icon: string;
  color: string;
  status: string;
  location: string;
}

interface Message {
  text: string;
  type: "success" | "error";
}

const evenements: Ref<EvenementSelect[]> = ref([]);
const showCalendar = ref(false);
const isLoading = ref(false);
const editMode = ref(false);
const message = ref<Message | null>(null);
const searchQuery = ref("");
const filterCategory = ref("");
const filterStatus = ref("");
const showEventModal = ref(false);
const currentEvent = ref<EvenementSelect | null>(null);
const showDeleteModal = ref(false);
const deleteTarget = ref<EvenementSelect | null>(null);

const defaultFormData: EvenementForm = {
  id: null,
  titleEvenement: "",
  TextEvenement: "",
  dateDebut: "",
  heureDebut: null,
  heureFin: null,
  allDay: false,
  frequency: null,
  interval: 1,
  count: null,
  endDate: null,
  byweekday: [],
  AuthorEvenement: "",
  avatarAnimateur: "nicolas.jpg",
  CategoryEvenement: "",
  ImageEvenement: "",
  TagsEvenement: "",
  link: "",
  icon: "",
  color: "#3b82f6",
  status: "confirmed",
  location: "",
};

const form = ref<EvenementForm>({ ...defaultFormData });

// ========================================
// COMPUTED PROPERTIES
// ========================================

const isFormValid = computed(() => {
  const baseValid = form.value.titleEvenement.trim() !== "" &&
    form.value.TextEvenement.trim() !== "" &&
    form.value.dateDebut !== "" &&
    form.value.AuthorEvenement.trim() !== "" &&
    form.value.CategoryEvenement?.trim() !== "";
  
  if (form.value.frequency) {
    // Pour récurrent, il faut COUNT ou ENDDATE
    return baseValid && (form.value.count !== null || form.value.endDate !== null);
  }
  
  return baseValid;
});

const deleteModalMessage = computed(() => {
  if (!deleteTarget.value) return "";
  return deleteTarget.value.isRecurrent ? "Supprimer cet événement récurrent ?" : "Supprimer cet événement ?";
});

const categories = computed(() => {
  const cats = new Set<string>();
  evenements.value.forEach((e) => {
    if (e.CategoryEvenement) cats.add(e.CategoryEvenement);
  });
  return Array.from(cats).sort();
});

const filteredEvents = computed(() => {
  return evenements.value.filter((e) => {
    const matchSearch = searchQuery.value === "" || e.titleEvenement.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCategory = filterCategory.value === "" || e.CategoryEvenement === filterCategory.value;
    const matchStatus = filterStatus.value === "" || e.status === filterStatus.value;
    return matchSearch && matchCategory && matchStatus;
  });
});

// Calcul automatique de la date de fin suggérée
const suggestedEndDate = computed(() => {
  if (!form.value.frequency || !form.value.count || !form.value.dateDebut) return null;
  
  const start = new Date(form.value.dateDebut);
  const multiplier = form.value.count * form.value.interval;
  
  switch (form.value.frequency) {
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
  
  return start.toLocaleDateString('fr-FR');
});

// Preview de la récurrence
const recurrencePreview = computed(() => {
  if (!form.value.frequency) return '';
  
  const freqLabels: Record<string, string> = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel'
  };
  
  let preview = freqLabels[form.value.frequency];
  
  if (form.value.interval > 1) {
    preview += ` (tous les ${form.value.interval})`;
  }
  
  if (form.value.count) {
    preview += `, ${form.value.count} fois`;
  } else if (form.value.endDate) {
    const end = new Date(form.value.endDate);
    preview += `, jusqu'au ${end.toLocaleDateString('fr-FR')}`;
  }
  
  return preview;
});

// ========================================
// PARSING RRULE POUR FULLCALENDAR
// ========================================

function parseRRuleForCalendar(rruleString: string) {
  const parts = rruleString.split(';');
  const rrule: any = {};
  
  parts.forEach(part => {
    const [key, value] = part.split(/[:=]/); // Accepte : ou =
    
    if (key === 'FREQ') rrule.freq = value.toLowerCase();
    if (key === 'INTERVAL') rrule.interval = parseInt(value);
    if (key === 'COUNT') rrule.count = parseInt(value);
    
    if (key === 'DTSTART') {
      // Convertir 20251030T090000 -> 2025-10-30T09:00:00
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      const hour = value.substring(9, 11);
      const minute = value.substring(11, 13);
      rrule.dtstart = `${year}-${month}-${day}T${hour}:${minute}:00`;
    }
    
    if (key === 'UNTIL') {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      const hour = value.substring(9, 11);
      const minute = value.substring(11, 13);
      rrule.until = `${year}-${month}-${day}T${hour}:${minute}:00`;
    }
    
    if (key === 'BYDAY') rrule.byweekday = value.toLowerCase().split(',');
  });
  
  return rrule;
}

// ========================================
// CALENDAR OPTIONS
// ========================================

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin],
  initialView: "dayGridMonth",
  locale: frLocale,
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  events: evenements.value
    .filter((event) => filterCategory.value === "" || event.CategoryEvenement === filterCategory.value)
    .filter((event) => filterStatus.value === "" || event.status === filterStatus.value)
    .map((event) => {
      if (event.isRecurrent && event.rrule) {
        // Événement récurrent avec RRule
        return {
          id: String(event.id),
          title: event.titleEvenement,
          rrule: parseRRuleForCalendar(event.rrule),
          duration: event.duration || '01:00',
          exdate: event.exdate?.split(',') || [],
          backgroundColor: event.color || "#3b82f6",
          borderColor: event.color || "#1d4ed8",
          extendedProps: { ...event, isRecurrent: true },
        };
      } else {
        // Événement simple
        const dateStr = formatDateForCalendar(event.dateDebut);
        const start = event.heureDebut ? `${dateStr}T${event.heureDebut}` : dateStr;
        const end = event.heureFin ? `${dateStr}T${event.heureFin}` : undefined;
        return {
          id: String(event.id),
          title: event.titleEvenement,
          start,
          end,
          allDay: event.allDay,
          backgroundColor: event.color || "#3b82f6",
          borderColor: event.color || "#1d4ed8",
          extendedProps: { ...event, isRecurrent: false },
        };
      }
    }),
  eventClick: (info: any) => {
    const eventId = parseInt(info.event.id);
    const evenement = evenements.value.find((e) => e.id === eventId);
    if (evenement) viewEvent(evenement);
  },
}));

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

const showMessage = (text: string, type: "success" | "error") => {
  message.value = { text, type };
  setTimeout(() => { message.value = null; }, 5000);
};

const formatDateForCalendar = (date: Date | string | null): string => {
  if (!date) return "";
  if (typeof date === "string") return date.includes("T") ? date.split("T")[0] : date;
  if (date instanceof Date) return date.toISOString().split("T")[0];
  return "";
};

const formatDateDisplay = (event: EvenementSelect): string => {
  // Pour événement récurrent, extraire la date du DTSTART
  if (event.isRecurrent && event.rrule) {
    const match = event.rrule.match(/DTSTART[:=](\d{8})/);
    if (match) {
      const dateStr = match[1];
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const date = new Date(`${year}-${month}-${day}`);
      return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
    }
  }
  
  // Pour événement simple
  if (!event.dateDebut) return "-";
  try {
    const dateObj = typeof event.dateDebut === "string" ? new Date(event.dateDebut) : event.dateDebut;
    return dateObj.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return String(event.dateDebut);
  }
};

const getRecurrenceLabel = (event: EvenementSelect): string => {
  if (!event.isRecurrent || !event.rrule) return "";
  
  const parsed = parseRRuleForCalendar(event.rrule);
  const labels: Record<string, string> = { 
    daily: "Quotidien", 
    weekly: "Hebdomadaire", 
    monthly: "Mensuel", 
    yearly: "Annuel" 
  };
  
  let label = labels[parsed.freq] || parsed.freq;
  
  if (parsed.count) {
    label += ` (${parsed.count}×)`;
  }
  
  return label;
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = { 
    confirmed: "Confirmé", 
    tentative: "Provisoire", 
    cancelled: "Annulé" 
  };
  return labels[status] || status;
};

const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    confirmed: "bg-green-100 text-green-800",
    tentative: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
  showMessage("Image non chargée", "error");
};

const toggleView = () => { 
  showCalendar.value = !showCalendar.value; 
};

const resetForm = () => { 
  form.value = { ...defaultFormData }; 
  editMode.value = false; 
};

// ========================================
// GESTION DE LA RÉCURRENCE (NOUVEAU)
// ========================================

const onFrequencyChange = () => {
  // Réinitialiser les champs de récurrence quand on change de fréquence
  if (!form.value.frequency) {
    form.value.count = null;
    form.value.endDate = null;
    form.value.interval = 1;
    form.value.byweekday = [];
  } else {
    // Valeurs par défaut
    if (!form.value.count && !form.value.endDate) {
      form.value.count = 8; // 8 occurrences par défaut
    }
  }
};

const onCountChange = () => {
  // Si on définit un COUNT, effacer ENDDATE
  if (form.value.count && form.value.count > 0) {
    form.value.endDate = null;
  }
};

// ========================================
// API CALLS
// ========================================

const loadEvents = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const response = await $fetch<EvenementSelect[]>("/api/events");
    evenements.value = response || [];
    console.log('✅ Événements chargés:', evenements.value.length);
  } catch (error) {
    console.error("❌ Erreur chargement:", error);
    showMessage("Erreur de chargement", "error");
    evenements.value = [];
  } finally {
    isLoading.value = false;
  }
};

const editEvent = (evenement: EvenementSelect) => {
  // Pour événement récurrent, parser la RRule
  if (evenement.isRecurrent && evenement.rrule) {
    const parsed = parseRRuleForCalendar(evenement.rrule);
    
    form.value = {
      id: evenement.id,
      titleEvenement: evenement.titleEvenement,
      TextEvenement: evenement.TextEvenement,
      dateDebut: parsed.dtstart?.split('T')[0] || '',
      heureDebut: parsed.dtstart?.split('T')[1]?.substring(0, 5) || null,
      heureFin: null, // Calculer depuis duration si nécessaire
      allDay: evenement.allDay,
      frequency: parsed.freq as any || null,
      interval: parsed.interval || 1,
      count: parsed.count || null,
      endDate: parsed.until?.split('T')[0] || null,
      byweekday: parsed.byweekday || [],
      AuthorEvenement: evenement.AuthorEvenement || "",
      avatarAnimateur: evenement.avatarAnimateur || "",
      CategoryEvenement: evenement.CategoryEvenement || "",
      ImageEvenement: evenement.ImageEvenement || "",
      TagsEvenement: evenement.TagsEvenement || "",
      link: evenement.link || "",
      icon: evenement.icon || "",
      color: evenement.color || "#3b82f6",
      status: evenement.status,
      location: evenement.location || "",
    };
  } else {
    // Événement simple
    form.value = {
      id: evenement.id,
      titleEvenement: evenement.titleEvenement,
      TextEvenement: evenement.TextEvenement,
      dateDebut: formatDateForCalendar(evenement.dateDebut),
      heureDebut: evenement.heureDebut,
      heureFin: evenement.heureFin,
      allDay: evenement.allDay,
      frequency: null,
      interval: 1,
      count: null,
      endDate: null,
      byweekday: [],
      AuthorEvenement: evenement.AuthorEvenement || "",
      avatarAnimateur: evenement.avatarAnimateur || "nicolas.jpg",
      CategoryEvenement: evenement.CategoryEvenement || "",
      ImageEvenement: evenement.ImageEvenement || "",
      TagsEvenement: evenement.TagsEvenement || "",
      link: evenement.link || "",
      icon: evenement.icon || "",
      color: evenement.color || "#3b82f6",
      status: evenement.status,
      location: evenement.location || "",
    };
  }
  
  editMode.value = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const viewEvent = (evenement: EvenementSelect) => {
  currentEvent.value = evenement;
  showEventModal.value = true;
};

const closeEventModal = () => {
  showEventModal.value = false;
  currentEvent.value = null;
};

const openDeleteModal = (evenement: EvenementSelect) => {
  deleteTarget.value = evenement;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deleteTarget.value = null;
};

const handleDelete = async () => {
  if (!deleteTarget.value || isLoading.value) return;
  isLoading.value = true;
  try {
    await $fetch(`/api/events/${deleteTarget.value.id}`, { method: "DELETE" });
    showMessage("Événement supprimé", "success");
    await loadEvents();
  } catch (error) {
    console.error("❌ Erreur suppression:", error);
    showMessage("Erreur suppression", "error");
  } finally {
    closeDeleteModal();
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (!isFormValid.value || isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    const eventData: any = {
      titleEvenement: form.value.titleEvenement,
      TextEvenement: form.value.TextEvenement,
      AuthorEvenement: form.value.AuthorEvenement,
      avatarAnimateur: form.value.avatarAnimateur,
      CategoryEvenement: form.value.CategoryEvenement,
      ImageEvenement: form.value.ImageEvenement,
      TagsEvenement: form.value.TagsEvenement,
      link: form.value.link,
      icon: form.value.icon,
      color: form.value.color,
      status: form.value.status,
      location: form.value.location,
      allDay: form.value.allDay,
      dateDebut: form.value.dateDebut, // Toujours envoyé
    };
    
    // Heures (pour simple OU récurrent)
    eventData.heureDebut = form.value.heureDebut || (form.value.allDay ? '00:00' : '09:00');
    eventData.heureFin = form.value.heureFin || (form.value.allDay ? '23:59' : '17:00');
    
    // Si récurrent, ajouter les paramètres de récurrence
    if (form.value.frequency) {
      eventData.frequency = form.value.frequency;
      eventData.interval = form.value.interval;
      eventData.count = form.value.count;
      eventData.endDate = form.value.endDate;
      eventData.byweekday = form.value.byweekday;
      
      console.log('📤 Envoi événement récurrent:', {
        frequency: eventData.frequency,
        count: eventData.count,
        endDate: eventData.endDate
      });
    }
    
    if (editMode.value && form.value.id) {
      // Mise à jour
      await $fetch(`/api/events/${form.value.id}`, { 
        method: "PATCH", 
        body: eventData 
      });
      showMessage("Événement mis à jour", "success");
    } else {
      // Création
      const response = await $fetch("/api/events", { 
        method: "POST", 
        body: eventData 
      });
      
      console.log('✅ Réponse création:', response);
      
      showMessage(
        form.value.frequency 
          ? `Série récurrente créée (${form.value.count || 'plusieurs'} occurrences)` 
          : "Événement créé", 
        "success"
      );
    }
    
    resetForm();
    await loadEvents();
    
  } catch (error: any) {
    console.error("❌ Erreur soumission:", error);
    showMessage(
      error.data?.message || error.message || "Erreur lors de la soumission", 
      "error"
    );
  } finally {
    isLoading.value = false;
  }
};

// ========================================
// LIFECYCLE
// ========================================

onMounted(() => { 
  loadEvents(); 
});

watch(() => form.value.allDay, (newVal) => {
  if (newVal) {
    form.value.heureDebut = null;
    form.value.heureFin = null;
  }
});

watch(() => form.value.endDate, (newVal) => {
  // Si on définit une ENDDATE, effacer COUNT
  if (newVal) {
    form.value.count = null;
  }
});
</script>

<style scoped>
.form-group { @apply space-y-1; }
.form-label { @apply block text-sm font-medium text-gray-700 dark:text-gray-300; }
.form-input { @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white; }
.form-select { @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white; }
.form-textarea { @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y dark:bg-gray-600 dark:border-gray-500 dark:text-white; }
.btn { @apply px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-primary { @apply bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500; }
.btn-secondary { @apply bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500; }
.btn-info { @apply bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500; }
.btn-success { @apply bg-green-500 text-white hover:bg-green-600 focus:ring-green-500; }
.btn-error { @apply bg-red-500 text-white hover:bg-red-600 focus:ring-red-500; }
.btn-sm { @apply px-2 py-1 text-sm; }
.table-header { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider; }
.table-cell { @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:deep(.fc-event) { cursor: pointer; transition: transform 0.2s; }
:deep(.fc-event:hover) { transform: scale(1.05); z-index: 10; }
</style>