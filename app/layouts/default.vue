<script setup lang="ts">
import MainFooter from '../components/MainFooter.vue';
import MainHeader from '../components/MainHeader.vue';

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <MainHeader />
    <main class="flex-1 p-0">
      <slot />
    </main>
    <MainFooter />
    </div>
</template>
<style scoped>
main {
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>