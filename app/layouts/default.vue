<template>
  <div class="flex flex-col h-screen"> 
    
    <MainHeader class="flex-shrink-0" />
    
    <main class="flex-1 overflow-y-auto pt-0">
      <slot /> 

      <MainFooter class="flex-shrink-0 mt-0" />
      
    </main>
    
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

/* Force la suppression de tout espace entre main et footer */
main {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

main > * {
  margin-bottom: 0 !important;
}
</style>