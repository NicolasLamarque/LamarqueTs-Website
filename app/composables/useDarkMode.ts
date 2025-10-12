
export const useDarkMode = () => {
  // État réactif du thème
  const isDark = ref(false)
  
  // Fonction pour basculer le thème
  const toggleDark = () => {
    isDark.value = !isDark.value
    updateTheme()
  }
  
  // Fonction pour définir un thème spécifique
  const setDark = (value: boolean) => {
    isDark.value = value
    updateTheme()
  }
  
  // Mise à jour du DOM et du localStorage
  const updateTheme = () => {
    if (process.client) {
      const html = document.documentElement
      
      if (isDark.value) {
        html.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        html.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }
  
  // Initialisation du thème
  const initTheme = () => {
    if (process.client) {
      // Vérifier la préférence sauvegardée
      const saved = localStorage.getItem('theme')
      
      if (saved) {
        isDark.value = saved === 'dark'
      } else {
        // Utiliser la préférence système
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      
      updateTheme()
      
      // Écouter les changements de préférence système
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          isDark.value = e.matches
          updateTheme()
        }
      })
    }
  }
  
  return {
    isDark: readonly(isDark),
    toggleDark,
    setDark,
    initTheme
  }
}