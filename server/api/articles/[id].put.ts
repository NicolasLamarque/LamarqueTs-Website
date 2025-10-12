// server/api/articles/[id].put.ts
import { defineEventHandler, readBody, createError } from 'h3';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server/db/articles.db');

export default defineEventHandler(async (event) => {
  const articleId = event.context.params?.id;
  const body = await readBody(event);
  const { titleArticle, TextArticle, DatePost, AuthorArticle, CategoryArticle, ImageArticle, TagsArticle } = body;

  if (!articleId || !titleArticle || !TextArticle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de l\'article, titre et contenu sont requis.',
    });
  }

  const db = new Database(dbPath);
  try {
    const stmt = db.prepare('UPDATE articles SET titleArticle = ?, TextArticle = ?, DatePost = ?, AuthorArticle = ?, CategoryArticle = ?, ImageArticle = ?, TagsArticle = ? WHERE id = ?');
    const result = stmt.run(titleArticle, TextArticle, DatePost, AuthorArticle, CategoryArticle, ImageArticle, TagsArticle, articleId);

    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article non trouvé.',
      });
    }

    return { success: true, message: `Article avec l'ID ${articleId} mis à jour.` };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la mise à jour de l\'article.',
    });
  } finally {
    db.close();
  }
});