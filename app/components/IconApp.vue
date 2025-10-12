<template>
  <div
    class="flex items-center justify-center rounded-full shadow-md"
    :class="[bgClass, sizeClass]"
  >
    <slot>
      <!-- Si tu passes pas de slot, affiche un SVG par défaut -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </slot>
  </div>
</template>

<script setup>
const props = defineProps({
  bgClass: {
    type: String,
    default: "bg-teal-500 text-white",
  },
  size: {
    type: String,
    default: "md", // sm, md, lg
  },
});

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-8 h-8 p-1";
    case "lg":
      return "w-16 h-16 p-4";
    default:
      return "w-12 h-12 p-3"; // md
  }
});
</script>
