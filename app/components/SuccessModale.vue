<template>
  <Transition name="modal">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 transition-opacity duration-300"
      @click.self="$emit('update:modelValue', false)"
    >
      <div
        class="bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 transform transition-all duration-300 border border-teal-600"
      >
        <div class="text-center mb-4">
          <svg
            class="w-12 h-12 text-teal-400 mx-auto animate-bounce-slow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 class="font-bold text-xl text-teal-300 mt-3">Message Envoyé!</h3>
        </div>

        <p class="text-sm text-gray-300 text-center mb-6">
          Merci de m'avoir contacté. Je vous répondrai dans les plus brefs
          délais.
        </p>

        <div class="modal-action">
          <button
            @click="$emit('update:modelValue', false)"
            class="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all duration-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// Utilisation de defineProps et defineEmits pour le contrôle V-Model
const props = defineProps<{
  modelValue: boolean; // État de la visibilité de la modale
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void; // Événement pour fermer (v-model)
}>();
</script>

<style scoped>
/* Les styles de transition correspondent à votre bloc <style scoped> original */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9) translateY(-20px);
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>