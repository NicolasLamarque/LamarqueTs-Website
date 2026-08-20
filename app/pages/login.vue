<template>
<div class="p-6 bg-slate-100 dark:bg-gray-900 min-h-screen transition-colors duration-500">
  <LoginForm/>

    
</div>


  
</template>

<script lang="ts" setup>
import LoginForm from '../components/auth/LoginForm.vue';

// Page d'administration : ne doit jamais apparaitre dans un moteur de
// recherche. robots.txt empeche l'exploration, cette balise empeche
// l'indexation - les deux ne font pas la meme chose.
useHead({
  title: 'Connexion',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})


</script>


<style>

</style>