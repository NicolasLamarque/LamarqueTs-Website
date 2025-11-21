// server/api/auth/verify.get.ts
import { defineEventHandler, getCookie } from 'h3'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET non défini')
}

export default defineEventHandler(async (event) => {
  // Récupérer le cookie
  const token = getCookie(event, 'auth_token')

  // Pas de cookie = pas connecté
  if (!token) {
    return { authenticated: false }
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, jwtSecret) as {
      id: number
      username: string
      role: string
    }
    
    // Token valide = connecté
    return {
      authenticated: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      }
    }
    
  } catch (err) {
    // Token invalide = pas connecté
    return { authenticated: false }
  }
})