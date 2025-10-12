// server/api/articles/index.get.ts
import { defineEventHandler, createError } from 'h3';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server/db/articles.db');

export default defineEventHandler(async () => {
  const db = new Database(dbPath);
  try {
    const stmt = db.prepare('SELECT * FROM articles');
    const articles = stmt.all();

    return articles;
  } catch (err) {
    console.error('Erreur lors de la récupération des articles:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des articles.',
    });
  } finally {
    db.close();
  }
});

