<template>
  <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl border-t-4 border-sky-500">
    <header class="mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        <i class="fas fa-calendar-alt text-sky-500 mr-2"></i>
        Gestion des Événements
      </h2>

      <div class="flex justify-between items-center">
        <!-- Filtres -->
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

        <button
          @click="toggleView"
          class="bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <i :class="showCalendar ? 'fas fa-list' : 'fas fa-calendar-alt'" class="mr-2"></i>
          {{ showCalendar ? "Voir la liste" : "Voir le calendrier" }}
        </button>
      </div>
    </header>

    <!-- Message de feedback -->
    <Transition name="fade">
      <div
        v-if="message"
        :class="{
          'bg-green-500': message.type === 'success',
          'bg-red-500': message.type === 'error'
        }"
        class="text-white p-3 rounded-lg shadow-md mb-4"
      >
        {{ message.text }}
      </div>
    </Transition>

    <!-- Vue principale avec transition -->
    <Transition name="fade" mode="out-in">
      <!-- Vue Calendrier -->
      <div v-if="showCalendar" key="calendar">
        <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 md:p-10">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>

      <!-- Vue Liste/Gestion -->
      <div v-else key="gestion" class="space-y-6">
        <!-- Formulaire d'ajout/édition -->
        <section class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
            {{ editMode ? "Modifier l'événement" : "Ajouter un événement" }}
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Informations de base -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="form-group">
                <label class="form-label">
                  Titre de l'événement <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.titleEvenement"
                  type="text"
                  class="form-input"
                  :disabled="isLoading"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  Auteur <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.AuthorEvenement"
                  type="text"
                  class="form-input"
                  :disabled="isLoading"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  Catégorie <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.CategoryEvenement"
                  type="text"
                  class="form-input"
                  :disabled="isLoading"
                  list="categories-list"
                  required
                />
                <datalist id="categories-list">
                  <option v-for="cat in categories" :key="cat" :value="cat" />
                </datalist>
              </div>

              <div class="form-group">
                <label class="form-label">Statut</label>
                <select v-model="form.status" class="form-select" :disabled="isLoading">
                  <option value="confirmed">Confirmé</option>
                  <option value="tentative">Provisoire</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Lieu</label>
                <input
                  v-model="form.location"
                  type="text"
                  class="form-input"
                  :disabled="isLoading"
                  placeholder="Lieu de l'événement"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Couleur</label>
                <div class="flex gap-2">
                  <input
                    v-model="form.color"
                    type="color"
                    class="h-10 w-20"
                    :disabled="isLoading"
                  />
                  <input
                    v-model="form.color"
                    type="text"
                    class="form-input flex-1"
                    :disabled="isLoading"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            <!-- Dates et heures -->
            <div class="border-t pt-4">
              <h4 class="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">
                <i class="fas fa-clock mr-2"></i>Date et Heure
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="form-group">
                  <label class="form-label">
                    <input
                      v-model="form.allDay"
                      type="checkbox"
                      class="mr-2"
                      :disabled="isLoading"
                    />
                    Toute la journée
                  </label>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    Date de début <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.dateDebut"
                    type="date"
                    class="form-input"
                    :disabled="isLoading"
                    required
                  />
                </div>

                <div v-if="!form.allDay" class="form-group">
                  <label class="form-label">Heure de début</label>
                  <input
                    v-model="form.heureDebut"
                    type="time"
                    class="form-input"
                    :disabled="isLoading"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Date de fin</label>
                  <input
                    v-model="form.dateFin"
                    type="date"
                    class="form-input"
                    :disabled="isLoading"
                    :min="form.dateDebut || ''"
                  />
                </div>

                <div v-if="!form.allDay" class="form-group">
                  <label class="form-label">Heure de fin</label>
                  <input
                    v-model="form.heureFin"
                    type="time"
                    class="form-input"
                    :disabled="isLoading"
                  />
                </div>
              </div>
            </div>

            <!-- Métadonnées -->
            <div class="border-t pt-4">
              <h4 class="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">
                <i class="fas fa-tags mr-2"></i>Informations complémentaires
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="form-group">
                  <label class="form-label">Tags</label>
                  <input
                    v-model="form.TagsEvenement"
                    type="text"
                    class="form-input"
                    :disabled="isLoading"
                    placeholder="Séparés par des virgules"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Lien</label>
                  <input
                    v-model="form.link"
                    type="url"
                    class="form-input"
                    :disabled="isLoading"
                    placeholder="https://..."
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Icône</label>
                  <div class="flex gap-2">
                    <input
                      v-model="form.icon"
                      type="text"
                      class="form-input flex-1"
                      :disabled="isLoading"
                      placeholder="fa-calendar"
                    />
                    <span v-if="form.icon" class="flex items-center px-3 bg-gray-100 rounded">
                      <i :class="`fas ${form.icon}`"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Récurrence -->
            <div class="border-t pt-4">
              <h4 class="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">
                <i class="fas fa-repeat mr-2"></i>Récurrence
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Règle de récurrence</label>
                  <select
                    v-model="form.recurrentRule"
                    class="form-select"
                    :disabled="isLoading"
                  >
                    <option :value="null">Aucune</option>
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuelle</option>
                    <option value="yearly">Annuelle</option>
                  </select>
                </div>

                <div v-if="form.recurrentRule" class="form-group">
                  <label class="form-label">
                    Nombre d'occurrences <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="form.recurrentCount"
                    type="number"
                    class="form-input"
                    min="1"
                    max="365"
                    :disabled="isLoading"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Description et image -->
            <div class="space-y-4">
              <div class="form-group">
                <label class="form-label">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="form.TextEvenement"
                  class="form-textarea"
                  rows="4"
                  :disabled="isLoading"
                  required
                  placeholder="Description détaillée de l'événement..."
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Image URL</label>
                <div class="space-y-2">
                  <input
                    v-model="form.ImageEvenement"
                    type="text"
                    class="form-input"
                    :disabled="isLoading"
                    placeholder="URL de l'image"
                  />
                  <div v-if="form.ImageEvenement" class="mt-2">
                    <img 
                      :src="form.ImageEvenement" 
                      alt="Aperçu" 
                      class="h-32 w-auto rounded shadow"
                      @error="handleImageError"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-4 mt-6 pt-4 border-t">
              <button
                type="submit"
                :disabled="isLoading || !isFormValid"
                class="btn btn-primary flex items-center"
              >
                <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else :class="editMode ? 'fas fa-save' : 'fas fa-plus'" class="mr-2"></i>
                {{ editMode ? "Mettre à jour" : "Ajouter" }} l'événement
              </button>

              <button
                type="button"
                @click="resetForm"
                :disabled="isLoading"
                class="btn btn-secondary"
              >
                <i class="fas fa-times mr-2"></i>
                Annuler
              </button>

              <button
                v-if="editMode && form.groupId"
                type="button"
                @click="updateEntireGroup"
                :disabled="isLoading"
                class="btn btn-info"
              >
                <i class="fas fa-layer-group mr-2"></i>
                Modifier tout le groupe
              </button>
            </div>
          </form>
        </section>

        <!-- Liste des événements -->
        <section class="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                Liste des événements ({{ filteredEvents.length }})
              </h3>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher..."
                class="form-input w-64"
              />
            </div>
          </div>

          <div v-if="isLoading" class="p-8 text-center">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-500"></i>
            <p class="mt-2 text-gray-500">Chargement des événements...</p>
          </div>

          <div v-else-if="filteredEvents.length === 0" class="p-8 text-center">
            <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-500">Aucun événement trouvé</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="table-header">Titre</th>
                  <th class="table-header">Date/Heure</th>
                  <th class="table-header">Lieu</th>
                  <th class="table-header">Auteur</th>
                  <th class="table-header">Catégorie</th>
                  <th class="table-header">Statut</th>
                  <th class="table-header">Actions</th>
                  <th class="table-header">Durée</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                <tr
                  v-for="evenement in filteredEvents"
                  :key="evenement.id || `temp-${Math.random()}`"
                  class="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                ><!-- Titre -->
                  <td class="table-cell">
                    <div class="flex items-center">
                      <div 
                        class="w-3 h-3 rounded-full mr-2" 
                        :style="{ backgroundColor: evenement.color || '#3b82f6' }"
                      ></div>
                      <div>
                        <div class="font-medium">{{ evenement.titleEvenement }}</div>
                        <div v-if="evenement.recurrentRule" class="text-xs text-blue-600">
                          <i class="fas fa-repeat mr-1"></i>
                          {{ getRecurrenceLabel(evenement.recurrentRule) }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <!-- Date/Heure -->
                  <td class="table-cell text-sm">
                    <div>{{ evenement.dateDebut }}</div>
                    <div v-if="!evenement.allDay && evenement.heureDebut" class="text-gray-500">
                      {{ evenement.heureDebut }}
                      <span v-if="evenement.heureFin"> - {{ evenement.heureFin }}</span>
                    </div>
                    <div v-if="evenement.allDay" class="text-gray-500 text-xs">
                      <font-awesome-icon :icon="['fas', 'sun']" /><i class="fas fa-sun mr-1">Toute la journée</i>
                    </div>
                  </td>
                  <!-- Lieu -->
                  <td class="table-cell">
                    <span v-if="evenement.location">
                      <i class="fas fa-map-marker-alt mr-1 text-gray-400"></i>
                      {{ evenement.location }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                  <td class="table-cell">
                    {{ evenement.AuthorEvenement }}
                  </td>
                  <!-- Catégorie -->
                  <td class="table-cell">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ evenement.CategoryEvenement }}
                    </span>
                  </td>
                  <!-- Statut -->
                  <td class="table-cell">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(evenement.status)"
                    >
                      {{ getStatusLabel(evenement.status) }}
                    </span>
                  </td>
                  <td class="table-cell">
                    <MiniInfosDureeInfosEvent :event="evenement" />
                  </td>
<!-- Boutons d'actions de gestion de l'événement -->
<td class="table-cell">
  <div class="flex gap-2">
    <!-- Boutons d'actions voir l'événement-->
    <button 
      @click="viewEvent(evenement)" 
      class="btn btn-sm btn-info"
      title="Voir"
    >
      <font-awesome-icon :icon="['fas', 'eye']" />
    </button>
<!-- Boutons d'actions modifier l'événement-->
    <button 
      @click="editEvent(evenement)" 
      class="btn btn-sm btn-success"
      title="Modifier"
    >
      <font-awesome-icon :icon="['fas', 'edit']" />
    </button>
<!-- Boutons d'actions supprimer l'événement-->
    <button 
      @click="openDeleteModal(evenement)" 
      class="btn btn-sm btn-error"
      title="Supprimer"
    >
      <font-awesome-icon :icon="['fas', 'trash']" />
    </button>
<!-- Bouton lien externe si disponible -->
    <a 
      v-if="evenement.link" 
      :href="evenement.link" 
      target="_blank"
      class="btn btn-sm btn-secondary"
      title="Lien externe"
    >
      <font-awesome-icon :icon="['fas', 'external-link-alt']" />
    </a>
  </div>
</td>


                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Transition>

    <!-- Modales -->
    <DeleteEventModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :message="deleteModalMessage"
      :is-series="!!deleteTarget?.recurrentId"
      @cancel="closeDeleteModal"
      @single="handleDeleteSingle"
      @group="handleDeleteGroup"
    />

    <EventModal
      :show="showEventModal"
      :event="currentEvent || {}"
      @close="closeEventModal"
    />
  </div>
</template>

<script setup lang="ts">

// Imports et types
import { ref, onMounted, computed, watch } from 'vue'
import type { Ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import EventModal from '~/components/EventModal.vue'
import DeleteEventModal from '~/components/DeleteEventModal.vue'

// Types plus précis pour les événements
interface EventData {
  id?: number | null
  titleEvenement: string
  TextEvenement: string
  dateDebut: string | null
  heureDebut: string | null
  dateFin: string | null
  heureFin: string | null
  allDay: boolean
  AuthorEvenement: string
  groupId: string | null
  CategoryEvenement: string | null
  ImageEvenement?: string | null
  TagsEvenement?: string | null
  link?: string | null
  icon?: string | null
  color?: string | null
  isRecurrent?: boolean
  recurrentId?: number | null
  recurrentRule?: string | null
  originalDate?: string | null
  status: string
  location?: string | null
  createdAt?: string
  updatedAt?: string
  recurrentCount?: number
}
// Message type for feedback
interface Message {
  text: string
  type: 'success' | 'error'
}

// État réactif et variables
const evenements: Ref<EventData[]> = ref([])
const showCalendar = ref(false)
const isLoading = ref(false)
const editMode = ref(false)
const message = ref<Message | null>(null)
const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

// Formulaire d'événement et données par défaut
const defaultFormData: EventData = {
  id: null,
  titleEvenement: '',
  TextEvenement: '',
  dateDebut: '',
  heureDebut: null,
  dateFin: null,
  heureFin: null,
  allDay: false,
  AuthorEvenement: '',
  groupId: null,
  CategoryEvenement: '',
  ImageEvenement: '',
  TagsEvenement: '',
  link: '',
  icon: '',
  color: '#3b82f6',
  recurrentRule: null,
  isRecurrent: false,
  recurrentId: null,
  originalDate: null,
  status: 'confirmed',
  location: '',
  recurrentCount: 1,
}

const form = ref<EventData>({ ...defaultFormData })

// Modales et événements sélectionnés
const showEventModal = ref(false)
const currentEvent = ref<EventData | null>(null)
const showDeleteModal = ref(false)
const deleteTarget = ref<EventData | null>(null)

// Computed properties for validation and filtering
const isFormValid = computed(() => {
  return (
    form.value.titleEvenement.trim() !== '' &&
    form.value.TextEvenement.trim() !== '' &&
    form.value.dateDebut !== '' &&
    form.value.AuthorEvenement.trim() !== '' &&
    form.value.CategoryEvenement?.trim() !== '' &&
    (!form.value.recurrentRule || (form.value.recurrentCount && form.value.recurrentCount > 0))
  )
})
// Message de confirmation pour la suppression
const deleteModalMessage = computed(() => {
  if (!deleteTarget.value) return ''
  return deleteTarget.value.recurrentId
    ? 'Cet événement fait partie d\'une série récurrente. Que souhaitez-vous supprimer ?'
    : 'Êtes-vous sûr de vouloir supprimer cet événement ?'
})
// Catégories uniques pour le filtre
const categories = computed(() => {
  const cats = new Set<string>()
  evenements.value.forEach(e => {
    if (e.CategoryEvenement) cats.add(e.CategoryEvenement)
  })
  return Array.from(cats).sort()
})
// Filtres
const filteredEvents = computed(() => {
  return evenements.value.filter(e => {
    const matchSearch = searchQuery.value === '' || 
      e.titleEvenement.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e.TextEvenement.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e.AuthorEvenement.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchCategory = filterCategory.value === '' || e.CategoryEvenement === filterCategory.value
    const matchStatus = filterStatus.value === '' || e.status === filterStatus.value
    
    return matchSearch && matchCategory && matchStatus
  })
})
// Options FullCalendar
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: frLocale,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  events: evenements.value
    .filter(event => filterCategory.value === '' || event.CategoryEvenement === filterCategory.value)
    .filter(event => filterStatus.value === '' || event.status === filterStatus.value)
    .map((event) => ({
      title: event.titleEvenement,
      start: event.dateDebut ? 
        (event.heureDebut ? `${event.dateDebut}T${event.heureDebut}` : event.dateDebut) : 
        new Date().toISOString(),
      end: event.dateFin ? 
        (event.heureFin ? `${event.dateFin}T${event.heureFin}` : event.dateFin) : 
        undefined,
      allDay: event.allDay,
      id: event.id ? String(event.id) : undefined,
      backgroundColor: event.color || (event.groupId ? '#3b82f6' : '#10b981'),
      borderColor: event.color || (event.groupId ? '#1d4ed8' : '#059669'),
      extendedProps: {
        location: event.location,
        status: event.status,
        category: event.CategoryEvenement,
        description: event.TextEvenement,
        icon: event.icon
      },
      className: event.status === 'cancelled' ? 'event-cancelled' : ''
    })),

  // Gestion du clic sur un événement
  eventClick: (info: any) => {
    const eventId = parseInt(info.event.id)
    const evenement = evenements.value.find((e) => e.id === eventId)
    if (evenement) {
      viewEvent(evenement)
    }
  },
  eventDisplay: 'auto',
  eventTimeFormat: {
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    meridiem: false
  }
}))

// Méthodes utilitaires
const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = null
  }, 5000)
}
// Formatage des dates
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}
// Libellé de récurrence
const getRecurrenceLabel = (rule: string): string => {
  const labels: Record<string, string> = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    yearly: 'Annuel'
  }
  return labels[rule] || rule
}
// Statut
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    confirmed: 'Confirmé',
    tentative: 'Provisoire',
    cancelled: 'Annulé'
  }
  return labels[status] || status
}
// Classe CSS pour le statut
const getStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-800',
    tentative: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
// Gestion des erreurs d'image
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  showMessage('L\'image n\'a pas pu être chargée', 'error')
}

// API calls functions and handlers 

const loadEvents = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    const data = await $fetch<EventData[]>('/api/evenements')
     console.log("Événements reçus :", data)  // 👈 vérifie le retour exact
    evenements.value = data || []
  } catch (error) {
    console.error('Erreur lors du chargement des événements:', error)
    showMessage('Erreur lors du chargement des événements.', 'error')
    evenements.value = []
  } finally {
    isLoading.value = false
  }
}

// Soumission du formulaire
const handleSubmit = async () => {
  if (!isFormValid.value || isLoading.value) return

  isLoading.value = true
  try {
    // Préparer les données
    const eventData = { ...form.value }
    
    // Gérer les dates
    if (!eventData.dateFin) {
      eventData.dateFin = eventData.dateDebut
    }
    
    if (editMode.value && form.value.id) {
      // Mise à jour d'un événement existant
      await $fetch(`/api/evenements/${form.value.id}`, {
        method: 'PUT',
        body: eventData,
      })
      showMessage('Événement mis à jour avec succès !', 'success')
      console.log("date de début retenue : ", eventData.dateDebut)
    } else {
      // Création d'un nouvel événement
      if (form.value.recurrentRule && form.value.recurrentCount) {
        // Événement récurrent
        await $fetch('/api/evenements/recurrent', {
          method: 'POST',
          body: {
            evenement: eventData,
            recurrenceCount: form.value.recurrentCount,
          },
        })
        showMessage(
          `${form.value.recurrentCount} événements récurrents créés avec succès !`,
          'success'
        )
      } else {
        // Événement unique
        await $fetch('/api/evenements', {
          method: 'POST',
          body: eventData,
        })
        showMessage('Événement créé avec succès !', 'success')
      }
    }

    resetForm()
    await loadEvents()
  } catch (error: any) {
    console.error('Erreur lors de la soumission:', error)
    const errorMessage = error?.data?.message || error?.message || 'Une erreur est survenue'
    showMessage(errorMessage, 'error')
  } finally {
    isLoading.value = false
  }
}
// Mise à jour de toute la série
const updateEntireGroup = async () => {
  if (!form.value.groupId || isLoading.value) return

  isLoading.value = true
  try {
    await $fetch(`/api/evenements/group/${form.value.groupId}`, {
      method: 'PUT',
      body: form.value,
    })
    showMessage('Groupe d\'événements mis à jour avec succès !', 'success')
    resetForm()
    await loadEvents()
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du groupe:', error)
    const errorMessage = error?.data?.message || error?.message || 'Une erreur est survenue'
    showMessage(errorMessage, 'error')
  } finally {
    isLoading.value = false
  }
}

// Actions sur les événements
const viewEvent = (evenement: EventData) => {
  currentEvent.value = evenement
  showEventModal.value = true
}
  // Édition d'un événement
const editEvent = (evenement: EventData) => {
  form.value = { ...evenement, recurrentCount: form.value.recurrentCount || 1 }
  editMode.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
// Réinitialisation du formulaire
const resetForm = () => {
  form.value = { ...defaultFormData }
  editMode.value = false
}
// Basculer entre les vues calendrier et liste
const toggleView = () => {
  showCalendar.value = !showCalendar.value
}

// Gestion des modales
const closeEventModal = () => {
  showEventModal.value = false
  currentEvent.value = null
}
// Suppression d'un événement
const openDeleteModal = (evenement: EventData) => {
  deleteTarget.value = evenement
  showDeleteModal.value = true
}
// Fermeture de la modale
const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleteTarget.value = null
}
// Suppression simple ou en groupe
const handleDeleteSingle = async () => {
  if (!deleteTarget.value?.id) return;

  try {
    await $fetch(`/api/evenements/${deleteTarget.value.id}?isRecurrent=false`, {
      method: 'delete' as any});
    showMessage('Événement supprimé avec succès !', 'success');
    await loadEvents();
  } catch (error: any) {
    console.error('Erreur lors de la suppression:', error);
    showMessage("Erreur lors de la suppression de l'événement.", 'error');
  } finally {
    closeDeleteModal();
  }
};
// Suppression de toute la série
const handleDeleteGroup = async () => {
  const recurrentId = deleteTarget.value?.recurrentId;
  if (!recurrentId) return;

  console.log("Début suppression série", recurrentId);

  try {
    // Récupère tous les événements correspondant au recurrentId
    const seriesToDelete = evenements.value.filter(ev => ev.recurrentId === recurrentId);

    for (const ev of seriesToDelete) {
      try {
        const res = await $fetch(`/api/evenements/${ev.id}`, { method: 'delete' as any });
        // Si tu veux, tu peux loguer chaque suppression :
        console.log(`Événement ${ev.id} supprimé.`);
      } catch (err) {
        console.warn(`Impossible de supprimer l'événement ${ev.id}:`, err);
      }
    }

    // Mise à jour du tableau local
    evenements.value = evenements.value.filter(ev => ev.recurrentId !== recurrentId);

    showMessage(`Série d'événements (${seriesToDelete.length}) supprimée avec succès !`, 'success');
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la série:', error);
    showMessage('Erreur lors de la suppression de la série.', 'error');
  } finally {
    closeDeleteModal();
  }
};
// Watchers reactifs
watch(() => form.value.recurrentRule, (newRule) => {
  if (!newRule) {
    form.value.recurrentCount = 1
  }
})
// Watcher pour toute la journée
watch(() => form.value.allDay, (isAllDay) => {
  if (isAllDay) {
    form.value.heureDebut = null
    form.value.heureFin = null
  }
})

// Lifecycle

onMounted( () => {
  loadEvents()
})


</script>

<style scoped>
/* Classes utilitaires */
.form-group {
  @apply space-y-1;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white;
}

.form-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y dark:bg-gray-600 dark:border-gray-500 dark:text-white;
}

.btn {
  @apply px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
}

.btn-primary {
  @apply bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500;
}

.btn-secondary {
  @apply bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500;
}

.btn-info {
  @apply bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500;
}

.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100;
}

.action-btn {
  @apply p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styles pour les événements annulés dans le calendrier */
:deep(.event-cancelled) {
  opacity: 0.6;
  text-decoration: line-through;
}

/* Amélioration de l'affichage du calendrier */
:deep(.fc-event) {
  cursor: pointer;
  transition: transform 0.2s;
}

:deep(.fc-event:hover) {
  transform: scale(1.05);
  z-index: 10;
}

:deep(.fc-daygrid-event) {
  font-size: 0.875rem;
  padding: 2px 4px;
}

:deep(.fc-time-grid-event) {
  font-size: 0.875rem;
}
</style>