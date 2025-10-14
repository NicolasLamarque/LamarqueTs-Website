// server/api/services/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'server/db/services.db')

export default defineEventHandler(async (event) => {
  const db = new Database(dbPath)
  try {
    const body = await readBody(event)
    const { title, description, icon, image, link, color, tags, contenu } = body

    if (!title || !description || !icon) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le titre, la description et l\'icône sont requis.'
      })
    }
    
    const now = new Date().toISOString()
    const stmt = db.prepare(`
      INSERT INTO services (
        title, description, icon, image, link, color, tags, contenu,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const info = stmt.run(
      title,
      description,
      icon,
      image || null,
      link || null,
      color || null,
      tags || null,
      contenu || null,
      now,
      now
    )

    return { 
      success: true,
      id: info.lastInsertRowid,
      message: 'Service créé avec succès.'
    }
  } catch (err) {
    console.error('Erreur lors de l\'ajout du service:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'ajout du service.'
    })
  } finally {
    db.close()
  }
})