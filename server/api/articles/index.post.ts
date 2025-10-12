// server/api/articles/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server/db/articles.db');

export default defineEventHandler(async (event) => {
  const db = new Database(dbPath);
  try {
    const body = await readBody(event);
    const { titleArticle, TextArticle, DatePost, AuthorArticle, CategoryArticle, ImageArticle, TagsArticle } = body;

    if (!titleArticle || !TextArticle) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le titre et le contenu de l\'article sont requis.',
      });
    }

    const stmt = db.prepare('INSERT INTO articles (titleArticle, TextArticle, DatePost, AuthorArticle, CategoryArticle, ImageArticle, TagsArticle) VALUES (@titleArticle, @TextArticle, @DatePost, @AuthorArticle, @CategoryArticle, @ImageArticle, @TagsArticle)');
    const info = stmt.run(titleArticle, TextArticle, DatePost, AuthorArticle, CategoryArticle, ImageArticle, TagsArticle);

    return { id: info.lastInsertRowid, ...body };
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'article:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'ajout de l\'article.',
    });
  } finally {
    db.close();
  }
});