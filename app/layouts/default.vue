<template>
  <div class="flex flex-col min-h-screen"> 
    
    <!-- Header fixe en haut -->
    <MainHeader class="flex-shrink-0" />
    
    <!-- Contenu principal qui prend tout l'espace disponible -->
    <main class="flex-1 pt-16">
      <slot /> 
    </main>
    
    <!-- Footer toujours en bas -->
    <MainFooter class="flex-shrink-0" />
    
  </div>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#__nuxt {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>