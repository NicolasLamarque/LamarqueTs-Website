<template>
  <transition name="modal-fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-50 flex justify-center items-center p-4"
      @click.self="close"
    >
      <div
        class="relative w-full max-w-3xl mx-auto shadow-2xl rounded-2xl bg-white dark:bg-gray-800 transform transition-all duration-300 overflow-hidden"
        :class="themeClass"
      >
        <!-- =============================== -->
        <!-- EN-TÊTE IMAGE + AVATAR + ICÔNE -->
        <!-- =============================== -->
        <div class="relative h-64 overflow-hidden">
          <!-- Image principale -->
          <img 
            v-if="event?.ImageEvenement"
            :src="event.ImageEvenement"
            :alt="event.titleEvenement"
            class="w-full h-full object-cover opacity-90"
          />

          <!-- Couleur ou dégradé par défaut -->
          <div
            v-else
            class="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center"
          >
            <i
              class="text-white/40 text-7xl"
              :class="event?.iconEvenement ? ['fas', event.iconEvenement] : ['fas', 'fa-calendar']"
            ></i>
          </div>

          <!-- Avatar animateur -->
          <div
            v-if="event?.avatarAnimateur"
            class="absolute -bottom-8 left-6 w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden"
          >
          <UAvatar
              :src="event.avatarAnimateur"
              :alt="event.nomAnimateur || event.AuthorEvenement"
              class="w-full h-full object-cover"
            />

          <!-- Icône principale en haut à gauche -->
          <div class="absolute top-4 left-4 w-14 h-14 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center">
            <i
              :class="['fas', event?.iconEvenement || 'fa-calendar']"
              class="text-sky-500 text-2xl"
            ></i>
          </div>

          <!-- Bouton fermer -->
          <button
            @click="close"
            class="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <font-awesome-icon icon="xmark" class="text-gray-600 dark:text-gray-300" />
          </button>

          <!-- Catégorie -->
          <div v-if="event?.CategoryEvenement" class="absolute bottom-4 left-4">
            <span class="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-sky-600 dark:text-sky-400 text-xs font-semibold rounded-full shadow-md">
              {{ event.CategoryEvenement }}
            </span>
          </div>

          <!-- Statut -->
          <div v-if="event?.status" class="absolute bottom-4 right-4">
            <span 
              class="px-3 py-1 text-xs font-semibold rounded-full shadow-md backdrop-blur-sm"
              :class="getStatusClass(event.status)"
            >
              {{ getStatusLabel(event.status) }}
            </span>
          </div>
        </div>

        <!-- =============================== -->
        <!-- CONTENU -->
        <!-- =============================== -->
        <div class="p-8 pt-12">
          <!-- Titre et récurrence -->
          <div class="flex items-start justify-between mb-6">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ event?.titleEvenement || 'Événement sans titre' }}
            </h2>
            <div v-if="event?.isRecurrent" class="ml-4">
              <span class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow">
                <i class="fas fa-repeat mr-2"></i>RÉCURRENT
              </span>
            </div>
          </div>

          <!-- Animateur avec avatar -->
          <div v-if="event?.nomAnimateur || event?.AuthorEvenement" class="flex items-center mb-6">
            <div v-if="event?.avatarAnimateur" class="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-sky-400">
              <img
                :src="event.avatarAnimateur"
                :alt="event.nomAnimateur || event.AuthorEvenement"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">Animateur</p>
              <p class="text-lg font-medium text-gray-900 dark:text-white">
                {{ event?.nomAnimateur || event?.AuthorEvenement }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div class="prose dark:prose-invert max-w-none mb-6">
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ event?.TextEvenement || 'Aucune description fournie.' }}
            </p>
          </div>

          <!-- Infos pratiques -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- Date -->
            <InfoCard
              icon="fa-calendar"
              color="blue"
              label="Date"
              :value="formatDateDisplay"
            />
            <!-- Heure -->
            <InfoCard
              icon="fa-clock"
              color="purple"
              label="Horaire"
              :value="formatTimeRange"
            />
            <!-- Lieu -->
            <InfoCard
              v-if="event?.location"
              icon="fa-map-marker-alt"
              color="green"
              label="Lieu"
              :value="event.location"
            />
          </div>

          <!-- Tags -->
          <div v-if="event?.TagsEvenement" class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in parseTags(event.TagsEvenement)"
              :key="tag"
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Lien externe -->
          <div v-if="event?.Link" class="mt-6">
            <a
              :href="event.Link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <i class="fas fa-external-link-alt mr-2"></i> En savoir plus
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, computed } from "vue";
import type { Evenement } from "~/server/utils/schema";
import UAvatar from "../components/UAvatar.vue";

// ===============================
// Sous composant simple pour les cartes infos
// ===============================
const InfoCard = defineComponent({
  props: {
    icon: String,
    color: String,
    label: String,
    value: { type: [String, Number], default: "" }
  },
  template: `
    <div class="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div :class="'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-' + color + '-100 dark:bg-' + color + '-900/30'">
        <i :class="'fas ' + icon + ' text-' + color + '-600 dark:text-' + color + '-400'"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ label }}</p>
        <p class="text-sm font-medium text-gray-900 dark:text-white mt-1 truncate">{{ value || '--' }}</p>
      </div>
    </div>
  `
});

// ===============================
// Props + watch
// ===============================
const props = defineProps<{ event?: Evenement | null; show: boolean }>();
const emit = defineEmits(["close"]);
const isVisible = ref(props.show);

watch(() => props.show, (val) => (isVisible.value = val));
const close = () => emit("close");

// ===============================
// Safe guards pour bug "value cannot be null"
// ===============================
const safeValue = (val: any, def = "--") => (val === null || val === undefined ? def : val);

// ===============================
// Thème dynamique
// ===============================
const themeClass = computed(() => {
  const theme = props.event?.themeVisuel?.toLowerCase() || "";
  if (theme.includes("teal")) return "border-t-8 border-teal-500";
  if (theme.includes("sky")) return "border-t-8 border-sky-500";
  if (theme.includes("nature")) return "border-t-8 border-green-500";
  if (theme.includes("zen")) return "border-t-8 border-blue-400";
  return "border-t-8 border-gray-200 dark:border-gray-700";
});

// ===============================
// Formatage dates & heures
// ===============================
const formatDateDisplay = computed(() => {
  if (!props.event?.dateDebut) return "--";
  const dateObj = typeof props.event.dateDebut === "string"
    ? new Date(props.event.dateDebut)
    : props.event.dateDebut;
  return dateObj.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
});

const formatTimeRange = computed(() => {
  if (props.event?.allDay) return "Toute la journée";
  return `${safeValue(props.event?.heureDebut)} → ${safeValue(props.event?.heureFin)}`;
});

// ===============================
// Utilitaires
// ===============================
const parseTags = (tags: string) => tags?.split(",").map(t => t.trim()).filter(Boolean) || [];
const getStatusClass = (status: string) => ({
  confirmed: "bg-green-500/90 text-white",
  tentative: "bg-yellow-500/90 text-white",
  cancelled: "bg-red-500/90 text-white",
}[status?.toLowerCase()] || "bg-gray-500/90 text-white");

const getStatusLabel = (status: string) => ({
  confirmed: "Confirmé",
  tentative: "Provisoire",
  cancelled: "Annulé",
}[status?.toLowerCase()] || status);
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>