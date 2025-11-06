<script setup lang="ts">
import MainFooter from '../components/MainFooter.vue';
import MainHeader from '../components/MainHeader.vue';

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <MainHeader />
    <main class="flex-1 p-6">
      <slot />
    </main>
    <MainFooter />
    </div>
</template>
