// server/api/services/index.get.ts
import { defineEventHandler, createError } from 'h3'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server/db/services.db')

export default defineEventHandler(() => {
  const db = new Database(dbPath)
  try {
    const stmt = db.prepare('SELECT * FROM services WHERE deleted = 0 ORDER BY created_at DESC')
    const services = stmt.all()
    return services
  } catch (err) {
    console.error('Erreur lors de la récupération des services:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des services.'
    })
  } finally {
    db.close()
  }
})