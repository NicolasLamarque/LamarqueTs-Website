// server/api/articles/index.get.ts
import { defineEventHandler, createError } from 'h3';
import { getAllArticles, Article } from '~~/server/db/initArticlesDb';

export default defineEventHandler(async () => {
  // NOTE : getAllArticles gère déjà les erreurs et le bloc finally

  try {

  const Articles : Article[] = getAllArticles();
    return Articles;
  } catch (err) {
    console.error('Erreur lors de la récupération des articles:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des articles.',
    });
  } // NOTE : Le bloc finally est maintenant dans getAllArticles
});

