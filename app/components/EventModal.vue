<template>
  <transition name="modal-fade">
    <div
      v-if="props.show"
      class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4"
      @click.self="close"
    >
      <div
        class="relative w-full max-w-4xl mx-auto shadow-2xl rounded-3xl bg-white dark:bg-gray-900 transform transition-all duration-300 overflow-hidden max-h-[90vh] flex flex-col"
        :class="themeClass"
      >
        <div class="relative h-72 flex-shrink-0 overflow-hidden">
          <div class="absolute inset-0">
            <img 
              v-if="event?.ImageEvenement"
              :src="event.ImageEvenement"
              :alt="event.titleEvenement"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center"
            >
              <font-awesome-icon
                :icon="event?.iconEvenement || 'calendar'"
                class="text-white/30 text-8xl"
              />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>

          <button
            @click="close"
            class="absolute top-6 right-6 w-11 h-11 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg flex items-center justify-center hover:bg-white/20 transition-all duration-200 group"
          >
            <font-awesome-icon icon="xmark" class="text-white text-lg group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div class="absolute top-6 left-6 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg flex items-center justify-center">
            <font-awesome-icon
              :icon="event?.iconEvenement || 'calendar'"
              class="text-white text-3xl"
            />
          </div>

          <div class="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div v-if="event?.CategoryEvenement" class="flex gap-2 flex-wrap">
              <span class="px-4 py-2 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 text-sky-600 dark:text-sky-400 text-sm font-bold rounded-xl shadow-lg border border-white/20">
                {{ event.CategoryEvenement }}
              </span>
              <span v-if="isRecurrentEvent" class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-xl shadow-lg flex items-center gap-2">
                <i class="fas fa-repeat"></i>{{ getEventTypeLabel() }}
              </span>
            </div>

            <span 
              v-if="event?.status"
              class="px-4 py-2 text-sm font-bold rounded-xl shadow-lg backdrop-blur-sm border border-white/20"
              :class="getStatusClass(event.status)"
            >
              {{ getStatusLabel(event.status) }}
            </span>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div class="p-8">
            <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {{ event?.titleEvenement || 'Événement sans titre' }}
            </h2>

            <div v-if="isRecurrentEvent" class="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-info-circle text-white text-xl"></i>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {{ sessionTitle }}
                  </h3>
                  <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {{ getRecurrenceDescription() }}
                  </p>
                  <div>
    <div v-if="pending">Chargement...</div>
    <div v-else-if="error">Erreur : {{ error.message }}</div>

    <div v-else>
      <div
        v-for="event in evenements"
        :key="event.id"
        class="border p-3 mb-2 rounded shadow-sm"
      >
        
        <p class="text-gray-600">{{ describeEvenement(event) }}</p>
      </div>
    </div>
  </div>
                </div>
              </div>
            </div>

            <div v-if="event?.nomAnimateur || event?.AuthorEvenement" class="flex items-center gap-4 mb-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div class="relative">
                <div class="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-sky-400/20">
                  <UAvatar
                    v-if="event?.avatarAnimateur"
                    :src="event.avatarAnimateur"
                    :alt="event.nomAnimateur || event.AuthorEvenement"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
                    <i class="fas fa-user text-white text-2xl"></i>
                  </div>
                </div>
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Animateur</p>
                <p class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ event?.nomAnimateur || event?.AuthorEvenement }}
                </p>
              </div>
            </div>

            <div class="mb-8">
              <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Description</h3>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {{ event?.TextEvenement || 'Aucune description fournie.' }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div class="group relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div class="absolute bottom-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <font-awesome-icon icon="calendar" class="text-blue-500 text-7xl" />
                </div>
                <div class="relative flex items-start gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <font-awesome-icon icon="calendar-day" class="text-white text-xl" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <font-awesome-icon icon="circle" class="text-blue-500 text-[6px]" />
                      <p class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {{ isRecurrentEvent ? 'Cette séance' : 'Date' }}
                      </p>
                    </div>
                    <p class="text-lg font-bold text-gray-900 dark:text-white leading-tight">{{ formatDateDisplay }}</p>
                  </div>
                </div>
              </div>

              <div class="group relative overflow-hidden p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div class="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"></div>
                <div class="absolute bottom-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <font-awesome-icon icon="clock" class="text-purple-500 text-7xl" />
                </div>
                <div class="relative flex items-start gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <font-awesome-icon icon="clock" class="text-white text-xl group-hover:animate-pulse" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <font-awesome-icon icon="circle" class="text-purple-500 text-[6px]" />
                      <p class="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Horaire</p>
                    </div>
                    <p class="text-lg font-bold text-gray-900 dark:text-white leading-tight">{{ eventTimeDisplay }}</p>
                  </div>
                </div>
              </div>

              <div v-if="event?.location" class="group relative overflow-hidden p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-2xl border-2 border-green-200 dark:border-green-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 md:col-span-2">
                <div class="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
                <div class="absolute bottom-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <font-awesome-icon icon="map-marked-alt" class="text-green-500 text-7xl" />
                </div>
                <div class="relative flex items-start gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <font-awesome-icon icon="map-marker-alt" class="text-white text-xl group-hover:animate-bounce" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <font-awesome-icon icon="circle" class="text-green-500 text-[6px]" />
                      <p class="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Lieu</p>
                    </div>
                    <p class="text-lg font-bold text-gray-900 dark:text-white leading-tight">{{ event.location }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="event?.TagsEvenement" class="mb-8">
              <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in parseTags(event.TagsEvenement)"
                  :key="tag"
                  class="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-sm"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <div v-if="event?.Link" class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                :href="event.Link"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <i class="fas fa-external-link-alt text-lg relative z-10"></i>
                <span class="relative z-10">En savoir plus</span>
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
import { time } from "drizzle-orm/mysql-core";
import { describeEvenement } from "~/server/utils/rruleHelpers";

const { data: evenements, pending, error } = await useFetch("../api/events");



const props = defineProps<{ 
  event?: Evenement | null; 
  show: boolean;
  clickedDate?: string | Date;
}>();

const emit = defineEmits(["close"]);
const isVisible = ref(props.show);

watch(() => props.show, (val) => (isVisible.value = val));
const close = () => emit("close");

// ===============================
// Utilitaires de base
// ===============================
const safeValue = (val: any, def = "--") => (val === null || val === undefined ? def : val);

const themeClass = computed(() => {
  const theme = props.event?.themeVisuel?.toLowerCase() || "";
  if (theme.includes("teal")) return "ring-2 ring-teal-500/50";
  if (theme.includes("sky")) return "ring-2 ring-sky-500/50";
  if (theme.includes("nature")) return "ring-2 ring-green-500/50";
  if (theme.includes("zen")) return "ring-2 ring-blue-400/50";
  return "ring-2 ring-gray-200/50 dark:ring-gray-700/50";
});

// ===============================
// Parser RRule AMÉLIORÉ
// ===============================
// Définir le type de retour pour une meilleure sécurité des types
type RRuleParams = {
  freq?: string;
  interval: number; // Défini à 1 par défaut
  dtstart?: string;
  count?: number;
  until?: string;
  byweekday?: string[];
};

/**
 * Analyse la chaîne RRule pour en extraire les paramètres clés.
 */
function parseRRule(rrule: string | null): RRuleParams {
  if (!rrule) return { interval: 1 };
  
  // Filtrer les parties vides
  const parts = rrule.split(';').filter(p => p.trim() !== '');
  
  const result: RRuleParams = { interval: 1 };
  
  parts.forEach(part => {
    const [key = '', rawValue = ''] = part.split(/[:=]/);
    
    const trimmedKey = key.trim();
    const value = rawValue.trim();
    
    if (!trimmedKey) return;

    switch (trimmedKey) {
      case 'FREQ':
        result.freq = value.toLowerCase();
        break;

      case 'INTERVAL':
      case 'COUNT':
        const numValue = Number(value); 
        if (!isNaN(numValue) && numValue >= 0) {
            if (trimmedKey === 'INTERVAL') {
                result.interval = numValue > 0 ? numValue : 1;
            } else if (trimmedKey === 'COUNT') {
                result.count = numValue;
            }
        }
        break;
        
      case 'DTSTART':
      case 'UNTIL':
        // Assumer le format YYYYMMDDTHHMMSS
        if (value.length >= 15) {
          const year = value.substring(0, 4);
          const month = value.substring(4, 6);
          const day = value.substring(6, 8);
          const hour = value.substring(9, 11);
          const minute = value.substring(11, 13);
          
          // Format ISO 8601 pour le constructeur Date (YYYY-MM-DDTHH:MM:00)
          const formattedDate = `${year}-${month}-${day}T${hour}:${minute}:00`;

          if (trimmedKey === 'DTSTART') {
              result.dtstart = formattedDate;
          } else {
              result.until = formattedDate;
          }
        }
        break;

      case 'BYDAY':
        result.byweekday = value.toLowerCase().split(',').map(d => d.trim()).filter(Boolean);
        break;
    }
  });
  
  return result;
}

// ===============================
// Détection événement récurrent
// ===============================
const isRecurrentEvent = computed(() => {
  // Un événement est "récurrent" s'il a plus d'une occurrence
  const parsed = parseRRule(props.event?.rrule || null);
  return (parsed.freq && (parsed.count ? parsed.count > 1 : !!parsed.until)) 
      || calculateOccurrences().length > 1; // Fallback sur le calcul si la règle est simple
});





// ===============================
// Calcul des occurrences CORRIGÉ ET ROBUSTIFIÉ
// ⚠️ Avertissement: Cette logique est une version simplifiée et ne supporte pas
// les règles complexes (ex: le 3e mardi du mois, exclusions, etc.).
// Elle est principalement utilisée ici pour estimer le nombre total.
// ===============================
function calculateOccurrences(): Date[] {
  if (!props.event?.rrule) return [];
  
  const parsed = parseRRule(props.event.rrule);
  if (!parsed.dtstart || !parsed.freq) return [];
  
  const occurrences: Date[] = [];
  const start = new Date(parsed.dtstart);
  const interval = parsed.interval; // interval est garanti d'être >= 1 par parseRRule
  const originalDayOfMonth = start.getDate(); // Sauvegarde du jour du mois pour les récurrences mensuelles
  
  // Fonction interne pour générer la date suivante
  const generateNextDate = (baseDate: Date, interval: number, freq: string): Date => {
      const nextDate = new Date(baseDate); // Cloner pour ne pas modifier la base
      
      switch (freq) {
          case 'daily':
              nextDate.setDate(baseDate.getDate() + interval);
              break;
          case 'weekly':
              nextDate.setDate(baseDate.getDate() + (7 * interval));
              break;
          case 'monthly':
              // Logique corrigée pour éviter le 'drift' des dates (ex: 31 janv -> 3 mars)
              const newMonth = baseDate.getMonth() + interval;
              nextDate.setMonth(newMonth);
              // Si le setMonth a sauté un mois (car jour > jour max du mois cible),
              // on revient au dernier jour du mois cible.
              if (nextDate.getMonth() !== newMonth % 12) {
                  // Mettre le jour à 0 revient au dernier jour du mois précédent (le mois cible)
                  nextDate.setDate(0); 
              }
              break;
          case 'yearly':
              nextDate.setFullYear(baseDate.getFullYear() + interval);
              break;
          default:
              return baseDate;
      }
      return nextDate;
  };

  // 1. CAS COUNT
  if (parsed.count && parsed.count > 0) {
      let current = new Date(start);
      for (let i = 0; i < parsed.count; i++) {
          occurrences.push(new Date(current)); // Ajout de l'occurrence
          // Calcul de la date suivante pour la prochaine itération
          current = generateNextDate(current, interval, parsed.freq); 
      }
      return occurrences;
  } 
  
  // 2. CAS UNTIL
  if (parsed.until) {
      const end = new Date(parsed.until);
      let current = new Date(start);
      
      while (current <= end) {
          occurrences.push(new Date(current));
          
          // Calcul de la date suivante
          current = generateNextDate(current, interval, parsed.freq);

          // Ajout d'une limite de sécurité contre les boucles infinies ou trop longues
          if (occurrences.length > 1000) { 
              console.warn("Limite de 1000 occurrences atteinte pour le calcul. Vérifiez votre règle UNTIL.");
              break;
          }
      }
  } 
  
  // 3. CAS SIMPLE (une seule occurrence si pas de count/until)
  if (occurrences.length === 0) {
      occurrences.push(start);
  }
  
  return occurrences;
}

// ===============================
// Numéro de la séance CORRIGÉ
// ===============================
const sessionNumber = computed(() => {
  if (!props.clickedDate) return 1;

  const clickedDate = typeof props.clickedDate === 'string' 
    ? new Date(props.clickedDate) 
    : new Date(props.clickedDate);

  const occurrences = calculateOccurrences();

  // Helper pour obtenir la date au format YYYY-MM-DD (indépendant du fuseau horaire local)
  const getDateKey = (date: Date) => date.toISOString().substring(0, 10);

  // Clé de la date cliquée
  const clickedDateKey = getDateKey(clickedDate);

  const index = occurrences.findIndex(occ => {
    const occDate = occ instanceof Date ? occ : new Date(occ); 
    
    // Comparaison uniquement sur la date (YYYY-MM-DD)
    return getDateKey(occDate) === clickedDateKey;
  });

  // Si on trouve l'index, le numéro de séance est index + 1, sinon 1.
  // Note: Un événement simple (non récurrent) aura toujours occurrences.length <= 1 et affichera '1ʳᵉ séance'.
  return index !== -1 ? index + 1 : 1;
});

// ===============================
// Labels intelligents
// ===============================
function getEventTypeLabel(): string {
  const tags = props.event?.TagsEvenement?.toLowerCase() || '';
  
  if (tags.includes('groupe fermé') || tags.includes('fermé')) return 'GROUPE FERMÉ';
  if (tags.includes('groupe ouvert') || tags.includes('ouvert')) return 'GROUPE OUVERT';
  if (tags.includes('libre')) return 'ACCÈS LIBRE';
  
  return 'RÉCURRENT';
}


// Titre de la séance avec numéro si applicable
const sessionTitle = computed(() => {
  const occurrences = calculateOccurrences();
  const totalSessions = occurrences.length;
  const num = sessionNumber.value;
  const name = props.event?.titleEvenement || 'Activité';
  
  // Si une seule occurrence : pas de numéro de séance
  if (totalSessions <= 1) {
    return name;
  }
  
  // Sinon : afficher le numéro de séance
  const ordinal = num === 1 ? '1ʳᵉ' : `${num}ᵉ`;
  return `${ordinal} séance : ${name}`;
});

function getFrequencyLabel(freq: string, interval: number = 1): string {
  const labels: Record<string, string> = {
    daily: interval > 1 ? `tous les ${interval} jours` : 'tous les jours',
    weekly: interval > 1 ? `toutes les ${interval} semaines` : 'toutes les semaines',
    monthly: interval > 1 ? `tous les ${interval} mois` : 'tous les mois',
    yearly: interval > 1 ? `tous les ${interval} ans` : 'tous les ans',
  };
  return labels[freq.toLowerCase()] || freq;
}

/**
 * Calcule l'heure de début et de fin basée sur la RRule et la durée.
 * @param {string} rruleStr - La chaîne RRule contenant DTSTART.
 * @param {string | undefined} durationStr - La chaîne de durée (HH:MM).
 * @param {boolean} isAllDay - Vrai si l'événement est de type toute la journée.
 * @returns {string} Le format HH:MM ou HH:MM → HH:MM, ou 'Toute la journée'.
 */
function formatTimeRange(rruleStr: string, durationStr: string | undefined, isAllDay: boolean): string {
  // 🚨 CORRECTION MAJEURE: Si c'est un événement de type 'Toute la journée', on court-circuite.
  if (isAllDay) {
      return 'Toute la journée';
  }
  
  // Capture l'heure (HHMMSS) depuis DTSTART
  const timeMatch = rruleStr.match(/DTSTART:(\d{8}T\d{6})/);

  const timeStr = timeMatch?.[1];
  
  if (timeStr) {
    const startHour = parseInt(timeStr.substring(9, 11), 10);
    const startMinute = parseInt(timeStr.substring(11, 13), 10);
    
    // Si la durée est disponible, calculer l'heure de fin
    if (durationStr) {
      const [rawDurHours = '0', rawDurMinutes = '0'] = durationStr.split(':');
      
      const durHours = parseInt(rawDurHours, 10);
      const durMinutes = parseInt(rawDurMinutes, 10);
      
      if (isNaN(durHours) || isNaN(durMinutes)) {
        return `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')} (Durée Invalide)`;
      }

      const totalMinutes = startMinute + durMinutes;
      const carryHours = Math.floor(totalMinutes / 60);
      const finalMinute = totalMinutes % 60;
      
      const finalHour = startHour + durHours + carryHours;
      
      // Formatage de l'heure de début
      const startHourStr = startHour.toString().padStart(2, '0');
      const startMinuteStr = startMinute.toString().padStart(2, '0');
      
      // Formatage de l'heure de fin
      const finalHourStr = finalHour.toString().padStart(2, '0');
      const finalMinuteStr = finalMinute.toString().padStart(2, '0');
      
      return `${startHourStr}:${startMinuteStr} → ${finalHourStr}:${finalMinuteStr}`;
    }
    
    // Si pas de durée
    return `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
  }

  // Si DTSTART n'a pas été trouvé dans la RRule
  return 'Toute la journée';
}

/**
 * Génère la description textuelle complète de la récurrence.
 */
function getRecurrenceDescription(): string {
  if (!props.event?.rrule) return '';
  
  const parsed = parseRRule(props.event.rrule);
  const occurrences = calculateOccurrences(); // Type: Date[]
  const total = occurrences.length; 
  
  // Récupération de l'heure formatée (CORRECTION CRITIQUE)
  const EventtimeRange = formatTimeRange(
      props.event.rrule, 
      props.event.duration ?? undefined
  );
  
  // Si une seule occurrence
  if (total <= 1) { 
    return `Événement unique. Horaire : ${EventtimeRange}`; 
  }
  
  // --- Événement récurrent (total > 1) ---
  const freq = parsed.freq ? getFrequencyLabel(parsed.freq, parsed.interval) : '';
  
  // Dates de début et de fin sont garanties d'exister
  const startDate = occurrences[0].toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const lastIndex = occurrences.length - 1;
  const endDate = occurrences[lastIndex].toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  // Logique d'affichage des jours de la semaine (BYDAY)
  let dayInfo = '';
  if (parsed.byweekday && parsed.byweekday.length > 0) {
      const dayMap: Record<string, string> = {
          'mo': 'lundi', 'tu': 'mardi', 'we': 'mercredi', 'th': 'jeudi',
          'fr': 'vendredi', 'sa': 'samedi', 'su': 'dimanche'
      };
      const days = parsed.byweekday.map(d => dayMap[d] || d);
      // Affichage stylisé: Les lundis, mercredis et vendredis
      const lastDay = days.pop();
      const dayList = days.length > 0 ? days.join(', ') + ' et ' + lastDay : lastDay;
      dayInfo = ` Les ${dayList}.`;
  }
  
  // Logique des tags/type d'événement
  const tags = props.event?.TagsEvenement?.toLowerCase() || '';
  let typeInfo = '';
  
  if (tags.includes('groupe fermé') || tags.includes('fermé')) {
    typeInfo = ' (inscription requise, places limitées)';
  } else if (tags.includes('groupe ouvert') || tags.includes('ouvert')) {
    typeInfo = ' (rejoignez-nous à tout moment)';
  } else if (tags.includes('libre')) {
    typeInfo = ' (accès libre sans inscription)';
  }
  
  // Construction finale de la description
  return `Activité ${freq} pendant ${total} séance${total > 1 ? 's' : ''}${typeInfo}. Du ${startDate} au ${endDate}.${dayInfo} Horaire : ${EventtimeRange}`;
}
// ===============================
// Formatage dates
// ===============================
const formatDateDisplay = computed(() => {
  // Utilise la date cliquée en priorité
  const targetDate = props.clickedDate || props.event?.dateDebut;
  
  if (targetDate) {
    const date = typeof targetDate === 'string' 
      ? new Date(targetDate) 
      : targetDate;
    
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  // Fallback sur DTSTART de la RRule
  if (props.event?.rrule) {
    const parsed = parseRRule(props.event.rrule);
    if (parsed.dtstart) {
      const date = new Date(parsed.dtstart);
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }
  
  return '--';
});

// Affiche l'heure de début et de fin ou "Toute la journée"
const eventTimeDisplay = computed(() => { 
    if (props.event?.allDay) return "Toute la journée";

    if (props.event?.rrule) {
        // Utilise la fonction robuste de formatage basée sur RRule et la durée
        return formatTimeRange(
            props.event.rrule, 
            props.event.duration ?? undefined
        );
    }

    // Fallback pour les événements simples (sans RRule)
    return `${safeValue(props.event?.heureDebut)} → ${safeValue(props.event?.heureFin)}`;
});

// ===============================
// Fonctions utilitaires
// ===============================
const parseTags = (tags: string) => tags?.split(",").map(t => t.trim()).filter(Boolean) || [];

const getStatusClass = (status: string) => ({
  confirmed: "bg-green-500/90 text-white",
  tentative: "bg-yellow-500/90 text-gray-900",
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}
</style>