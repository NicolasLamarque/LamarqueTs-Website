// server/api/users/[id].delete.ts
import { defineEventHandler, createError } from 'h3'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server/db/auth.db');

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID d\'utilisateur manquant.'
    })
  }
  
  const db = new Database(dbPath)
  try {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?')
    const result = stmt.run(userId)

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur non trouvé.'
      })
    }

    return { success: true, message: `Utilisateur avec l'ID ${userId} supprimé.` }
  } catch (err) {
    console.error(err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la suppression de l\'utilisateur.'
    })
  } finally {
    db.close()
  }
})