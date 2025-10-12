// server/api/articles/[id].get.ts
import { defineEventHandler, createError } from 'h3';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server/db/articles.db');

export default defineEventHandler(async (event) => {
  const articleId = event.context.params?.id;

  if (!articleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de l\'article manquant.',
    });
  }

  const db = new Database(dbPath);
  
  try {
    const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
    const article = stmt.get(articleId);

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article non trouvé.',
      });
    }

    return article;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'article:', err);
    
    // Si c'est déjà une erreur createError, la relancer
    if (err.statusCode) {
      throw err;
    }
    
    // Sinon erreur serveur générique
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération de l\'article.',
    });
  } finally {
    db.close();
  }
});