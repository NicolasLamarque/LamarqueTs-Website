// server/api/events/index.get.ts
import { defineEventHandler, createError } from 'h3';
import { getAllArticles } from '~/server/utils/articles';



export default defineEventHandler(async () => {
  try {
      // 1. Appel simple à la fonction de service (ne lit pas le body)
      const ToutLesArticles = await getAllArticles(); // 2. Retourner la liste des services
      return ToutLesArticles;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de tous les services:",
        error
      ); // Retourner une erreur standard au client
      throw createError({
        statusCode: 500,
        statusMessage: "Échec de la récupération de la liste des services.",
      });
    }
});