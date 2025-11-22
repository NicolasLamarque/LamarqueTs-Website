// middleware/auth.ts IL N'EST PAS DANS LE SERVEUR OK
export default defineNuxtRouteMiddleware(async (to) => {
  // Routes publiques (pas besoin de connexion)
  const publicRoutes = ['/', '/login', '/register']
  
  // Si on va vers une page publique, laisser passer
  if (publicRoutes.includes(to.path)) {
    return
  }
  // Pour toutes les autres pages, vérifier si connecté
  try {
    const response = await $fetch('/api/auth/verify', {
      credentials: 'include'
    })
    
    // Si pas connecté, rediriger vers login
    if (!response.authenticated) {
      return navigateTo('/login')
    }
    
  } catch (error) {
    // En cas d'erreur, rediriger vers login
    return navigateTo('/login')
  }
})