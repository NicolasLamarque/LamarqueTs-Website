
// server/api/users/index.get.ts
import { defineEventHandler, createError } from 'h3'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server/db/auth.db');

export default defineEventHandler(async () => {
  const db = new Database(dbPath)
  try {
    // La requête SQL a été mise à jour pour sélectionner tous les champs
    const stmt = db.prepare('SELECT id, username, mail, role, is_active, profile_picture, bio, two_factor_enabled, preferences FROM users')
    const users = stmt.all()
    
    return users
  } catch (err) {
    console.error(err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des utilisateurs.'
    })
  } finally {
    db.close()
  }
})