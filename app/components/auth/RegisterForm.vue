<template>
  <div>
    <button @click="$emit('back')" class="mb-4 text-blue-500 hover:underline">
      Register
    </button>
    <form @submit.prevent="$emit('register', { email, password })" class="max-w-md mx-auto p-4 border rounded">
      <div class="mb-4">
        <h2 class="text-2xl font-bold mb-4 text-center dark:text-gray-100 animate-fade-in">Inscription</h2>
        <label for="name" class="block mb-1 font-medium">Identifiant</label>
        <input
          id="name"
          type="text"
          v-model="name"
          required
          class="w-full px-3 py-2 border rounded"
          placeholder="Votre nom"
        />
      </div>
      <div class="mb-4">
        <label for="email" class="block mb-1 font-medium">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          class="w-full px-3 py-2 border rounded"
          placeholder="Votre email"
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block mb-1 font-medium">Mot de passe</label>
        <input
          id="password"
          type="password"
          v-model="password"
          required
          class="w-full px-3 py-2 border rounded"
          placeholder="Votre mot de passe"
        />
      </div>
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        S'inscrire
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');


</script>

<style>

</style>