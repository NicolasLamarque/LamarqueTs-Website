// server/api/auth/logout.post.ts
import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  // Supprimer le cookie d'authentification
  deleteCookie(event, 'auth_token', {
    path: '/'
  })

  return {
    success: true,
    message: 'Déconnexion réussie'
  }
})