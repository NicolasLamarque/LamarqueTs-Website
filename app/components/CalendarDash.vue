<template>
  <div class="p-4 sm:p-6 space-y-5">
    <header class="space-y-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Calendrier</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Séances, groupes et rencontres</p>
      </div>

      <div class="flex flex-wrap justify-between items-center gap-3">
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

        <!-- Bascule calendrier / liste, presentee comme deux positions d'un
             meme interrupteur plutot qu'un bouton dont le libelle change. -->
        <div class="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            type="button"
            @click="showCalendar || toggleView()"
            class="px-4 py-1.5 text-sm font-medium transition-colors"
            :class="showCalendar
              ? 'bg-sky-700 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            Calendrier
          </button>
          <button
            type="button"
            @click="!showCalendar || toggleView()"
            class="px-4 py-1.5 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600"
            :class="!showCalendar
              ? 'bg-sky-700 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            Liste
          </button>
        </div>
      </div>
    </header>

    <Transition name="fade">
      <p v-if="message"
        class="px-4 py-3 rounded-lg text-sm border"
        :class="message.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/25 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
          : 'bg-red-50 dark:bg-red-900/25 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'">
        {{ message.text }}
      </p>
    </Transition>

    <Transition name="fade" mode="out-in">
      <div v-if="showCalendar" key="calendar">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-6">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>

      <div v-else key="gestion" class="space-y-6">
        <section
          class="bg-white dark:bg-gray-800 rounded-xl border shadow-sm border-l-4 transition-colors"
          :class="editMode
            ? 'border-gray-200 dark:border-gray-700 border-l-sky-600 dark:border-l-sky-500'
            : 'border-gray-200 dark:border-gray-700 border-l-gray-300 dark:border-l-gray-600'"
        >
          <div class="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-100">
                {{ editMode ? "Modification en cours" : "Nouvel événement" }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ editMode
                  ? "Les modifications s'appliquent à toute la série."
                  : "Une séance unique, ou une série récurrente." }}
              </p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
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

              <!-- Aperçu : les vraies dates.
                   Voir « jeu 17 sept · jeu 24 sept · … » plutôt qu'un code de
                   récurrence permet de reperer immediatement une erreur — un
                   mauvais jour de la semaine, une serie qui deborde sur les
                   fetes, un « le 31 » qui saute fevrier. -->
              <div
                v-if="occurrencesApercu.length"
                class="mt-4 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20 p-3"
              >
                <p class="text-sm font-medium text-sky-900 dark:text-sky-200">
                  {{ recurrencePreview }}
                </p>

                <div class="mt-2 flex flex-wrap gap-1.5">
                  <span
                    v-for="(d, i) in occurrencesApercu.slice(0, 14)"
                    :key="i"
                    class="px-2 py-0.5 rounded text-xs bg-white dark:bg-gray-800 border border-sky-200 dark:border-sky-800 text-gray-700 dark:text-gray-300 tabular-nums"
                  >
                    {{ dateLisible(d) }}
                  </span>
                  <span
                    v-if="occurrencesApercu.length > 14"
                    class="px-2 py-0.5 text-xs text-sky-700 dark:text-sky-400"
                  >
                    + {{ occurrencesApercu.length - 14 }} autres
                  </span>
                </div>
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

            <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                :disabled="isLoading || !isFormValid"
                class="px-5 py-2 rounded-lg text-sm font-semibold bg-sky-700 hover:bg-sky-600 text-white shadow-sm transition-colors disabled:opacity-50"
              >
                {{ isLoading ? "Enregistrement…" : editMode ? "Enregistrer les modifications" : "Créer l'événement" }}
              </button>

              <button
                type="button"
                @click="resetForm"
                :disabled="isLoading"
                class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </section>

        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-semibold text-gray-800 dark:text-gray-100">
              Événements <span class="font-normal text-gray-400">({{ filteredEvents.length }})</span>
            </h3>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher…"
              class="w-full sm:w-64 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div v-if="isLoading" class="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            Chargement…
          </div>

          <div v-else-if="filteredEvents.length === 0" class="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            Aucun événement.
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
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
                        <font-awesome-icon icon="eye" />
                      </button>
                      <button @click="editEvent(evenement)" class="btn btn-sm btn-success" title="Modifier">
                        <font-awesome-icon icon="edit" />
                      </button>
                      <button @click="openDeleteModal(evenement)" class="btn btn-sm btn-error" title="Supprimer">
                        <font-awesome-icon icon="trash" />
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

// ============================================================================
// Apercu de la recurrence : les VRAIES dates, pas un code
// ============================================================================
//
// L'apercu precedent recomposait une phrase a partir des libelles :
// « Hebdomadaire, 8 fois ». Cela n'apprenait rien de plus que ce qui venait
// d'etre saisi, et surtout ne disait pas QUAND tombent les seances.
//
// On calcule desormais les occurrences reelles avec le moteur partage, le
// meme que celui du serveur. Voir les dates evite les mauvaises surprises :
// un « tous les mois le 31 » qui saute fevrier se remarque immediatement.

const occurrencesApercu = computed<Date[]>(() => {
  if (!form.value.frequency || !form.value.dateDebut) return [];

  const parties = [`FREQ=${form.value.frequency.toUpperCase()}`];
  if (form.value.interval > 1) parties.push(`INTERVAL=${form.value.interval}`);
  if (form.value.count) parties.push(`COUNT=${form.value.count}`);
  else if (form.value.endDate) parties.push(`UNTIL=${form.value.endDate.replace(/-/g, '')}T235900`);
  else parties.push("COUNT=12");
  if (form.value.byweekday?.length) parties.push(`BYDAY=${form.value.byweekday.join(',').toUpperCase()}`);

  const debut = form.value.heureDebut
    ? `${form.value.dateDebut}T${form.value.heureDebut}`
    : form.value.dateDebut;

  try {
    return genererOccurrences(parties.join(';'), debut);
  } catch {
    return [];
  }
});

/** Date lisible, sans decalage de fuseau. */
const dateLisible = (d: Date) => {
  const iso = versDateISO(d);
  if (!iso) return "";
  const [a, m, j] = iso.split("-").map(Number);
  return new Date(a, m - 1, j).toLocaleDateString("fr-CA", {
    weekday: "short", day: "numeric", month: "short",
  });
};

/** Phrase de synthese affichee au-dessus des dates. */
const recurrencePreview = computed(() => {
  const dates = occurrencesApercu.value;
  if (!dates.length) return "";

  const total = dates.length;
  const premiere = dateLisible(dates[0]);
  const derniere = dateLisible(dates[total - 1]);

  if (total === 1) return `Une seule séance, le ${premiere}.`;
  return `${total} séances, du ${premiere} au ${derniere}.`;
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
/* Ces classes sont definies ici plutot que repetees sur chaque balise.
   Les realigner a la source suffit a harmoniser tout le composant. */
.form-label { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5; }
.form-input { @apply w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition disabled:opacity-50; }
.form-select { @apply w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition disabled:opacity-50; }
.form-textarea { @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y dark:bg-gray-600 dark:border-gray-500 dark:text-white; }
/* Le hover:scale-105 faisait sursauter chaque bouton au survol. Sur une
   barre d'actions, cela produit un effet de tremblement peu agreable. */
.btn { @apply px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-primary { @apply bg-sky-700 text-white hover:bg-sky-600 shadow-sm; }
.btn-secondary { @apply border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700; }
.btn-info { @apply border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/30; }
.btn-success { @apply border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30; }
.btn-error { @apply text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30; }
.btn-sm { @apply px-3 py-1.5 text-xs; }
.table-header { @apply px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400; }
.table-cell { @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:deep(.fc-event) { cursor: pointer; transition: transform 0.2s; }
:deep(.fc-event:hover) { transform: scale(1.05); z-index: 10; }
</style>