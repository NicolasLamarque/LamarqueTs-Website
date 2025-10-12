// server/middleware/auth.ts
import { defineEventHandler, createError, getCookie } from 'h3'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'fallback_secret'

export default defineEventHandler((event) => {
  const protectedRoutes = ['/dashboard']
  
  // Si la route n'est pas protégée, on laisse passer
  if (!protectedRoutes.some(route => event.path.startsWith(route))) {
    return // ✅ C'est OK maintenant, on ne fait rien
  }
  
  // Route protégée : vérification du token
  const token = getCookie(event, 'auth_token')
  
  if (!token) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Token manquant' 
    })
  }
  
  try {
    jwt.verify(token, jwtSecret)
    // ✅ Token valide, on laisse passer
  } catch (err) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Accès non autorisé : Token invalide ou expiré' 
    })
  }
})