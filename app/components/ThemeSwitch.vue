<template>
  <button
    @click="toggleDark"
    class="theme-switch"
    :aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'"
  >
    <!-- Icône soleil/lune -->
    <transition name="spin-fade" mode="out-in">
      <svg
        v-if="isDark"
        key="moon"
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M21.752 15.002A9 9 0 1112 3a7.5 7.5 0 009.752 12.002z"
        />
      </svg>
      <svg
        v-else
        key="sun"
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        fill="bg-yellow-400"
        viewBox="0 0 24 24"
      >
        <path
          fill-rule="evenodd"
          d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM18.364 5.636a.75.75 0 011.06 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061zM21.75 12a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM18.364 18.364a.75.75 0 10-1.061 1.061l1.061 1.06a.75.75 0 101.06-1.06l-1.06-1.061zM12 18.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM5.636 18.364a.75.75 0 00-1.06 1.061l1.06 1.06a.75.75 0 101.061-1.06l-1.061-1.061zM2.25 12a.75.75 0 00.75.75h1.5a.75.75 0 000-1.5H3a.75.75 0 00-.75.75zM5.636 5.636a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 101.06 1.061l1.061-1.061zM12 6.75a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z"
          clip-rule="evenodd"
        />
      </svg>
    </transition>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggleDark } = useDarkMode()
</script>

<style scoped>
.theme-switch {
  @apply flex items-center justify-center w-10 h-10 rounded-full;
  @apply bg-gray-100 hover:bg-gray-200;
  @apply dark:bg-gray-700 dark:hover:bg-gray-600;
  @apply text-gray-800 dark:text-sky-200;
  @apply transition-all duration-300 shadow-sm;
}

/* Anim spin + fade */
.spin-fade-enter-active,
.spin-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* rebond */
}

.spin-fade-enter-from {
  opacity: 0;
  transform: rotate(-180deg) scale(0.6);
}

.spin-fade-leave-to {
  opacity: 0;
  transform: rotate(180deg) scale(0.6);
}
</style>
