<template>
  <transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="$emit('cancel')">
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm" role="dialog" aria-modal="true"
        aria-labelledby="modalTitle" aria-describedby="modalDescription">
        
        <div class="flex justify-between items-center mb-4 border-b pb-2">
          <h3 id="modalTitle" class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Confirmer la suppression
          </h3>
          <button @click="$emit('cancel')"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Fermer la modale">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <p id="modalDescription" class="mb-6 text-gray-700 dark:text-gray-300">
          {{ message }}
        </p>

        <div class="flex flex-col space-y-2">
          <button @click="$emit('cancel')"
            class="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-200">
            Annuler
          </button>
          
          <button @click="$emit('single')"
            class="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200">
            Supprimer cet événement
          </button>
          
          <button v-if="isSeries" @click="$emit('group')"
            class="w-full px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors duration-200">
            Supprimer toute la série
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  show: boolean;
  message: string;
  isSeries: boolean;
}>();

const emit = defineEmits<{
  (eventforCancel: 'cancel'): void;
  (eventForIsSingle: 'single'): void;
  (eventForIsGrouped: 'group'): void;
}>();

// Optionnel: Vous pouvez ajouter de la logique ici si nécessaire, par exemple pour la gestion du focus.
</script>

<style scoped>
/* Styles de transition pour la modale */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 1.0s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
