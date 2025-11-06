// server/api/auth/login.post.ts

import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getUserByUsernameWithPassword } from '../../utils/users'

interface LoginBody {
  username?: string
  password?: string
}

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement.')
}

export default defineEventHandler(async (event) => {
  // 1️⃣ Lecture et validation du corps
  const body = await readBody(event) as LoginBody
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Veuillez fournir un nom d’utilisateur et un mot de passe',
    })
  }

  // 2️⃣ Recherche de l’utilisateur dans la BD
  const user = await getUserByUsernameWithPassword(username)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Utilisateur inconnu',
    })
  }

  // 3️⃣ Vérification du mot de passe
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Mot de passe incorrect',
    })
  }

  // 4️⃣ Génération du token JWT
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: '1h' }
  )

  console.log('✅ Token généré :', token)
  return { token }
})
