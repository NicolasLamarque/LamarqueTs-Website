export default defineNuxtPlugin(() => {
  const { initTheme } = useDarkMode()
  
  // Initialiser le thème au montage de l'application
  onMounted(() => {
    initTheme()
  })
})