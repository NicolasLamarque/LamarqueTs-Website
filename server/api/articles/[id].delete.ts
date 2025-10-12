// server/api/articles/[id].delete.ts
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
    const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
    const result = stmt.run(articleId);

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article non trouvé.',
      });
    }

    return { success: true, message: `Article avec l'ID ${articleId} supprimé.` };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la suppression de l\'article.',
    });
  } finally {
    db.close();
  }
});