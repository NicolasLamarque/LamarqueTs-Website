// server/middleware/auth.ts
// Middleware d'authentification pour protéger les routes sensibles IL EST DANS LE SERVEUR OK

import { defineEventHandler, getCookie, createError } from 'h3'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET non défini')
}

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''

  console.log('🔍 Server middleware - URL demandée:', url)

  // 🔓 Routes publiques (pas besoin de vérification)
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/verify',
    '/_nuxt/',
    '/__nuxt_',
    '/favicon.ico',
    '/login'
  ]

  // Si c'est une route publique, on laisse passer
  // IMPORTANT : Ne pas mettre '/' seul car ça match tout !
  if (url === '/' || publicRoutes.some(route => url.startsWith(route))) {
    console.log('✅ Route publique, passage autorisé')
    return
  }

  // 🔒 Routes protégées (dashboard, admin, etc.)
  const protectedRoutes = [
    '/dashboard',
    '/admin'
  ]

  // Si c'est une route protégée
  const isProtected = protectedRoutes.some(route => url.startsWith(route))

  if (isProtected) {
    console.log('🔒 Route protégée détectée:', url)
    
    // Récupérer le token du cookie
    const token = getCookie(event, 'auth_token')

    // Pas de token = accès refusé
    if (!token) {
      console.log('❌ Pas de token, accès refusé')
      throw createError({
        statusCode: 401,
        statusMessage: 'Non authentifié - Token manquant'
      })
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, jwtSecret) as {
        id: number
        username: string
        role: string
      }

      // ✅ Token valide, on attache l'utilisateur à l'event
      event.context.auth = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      }

      console.log(`✅ Accès autorisé à ${url} pour ${decoded.username}`)
      
    } catch (err) {
      // Token invalide = accès refusé
      console.log('❌ Token invalide ou expiré')
      throw createError({
        statusCode: 401,
        statusMessage: 'Non authentifié - Token invalide ou expiré'
      })
    }
  }
})