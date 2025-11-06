// server/api/articles/[id].get.ts
import { defineEventHandler, createError, H3Error } from 'h3';
import {getArticleById } from '../../utils/articles';



export default defineEventHandler(async (event) => {
 const id = event.context.params?.id;

 if (!id) throw createError ({ statusCode: 400, statusMessage: 'ID manquant.' });
 
 // 💡 AJOUT : Vérification que la conversion en nombre n'est pas NaN
    const articleId = Number(id);
    if (isNaN(articleId)) {
        throw createError({ statusCode: 400, statusMessage: 'ID de l\'article invalide.' });
    };
    try {    // Utilisation de l'ID numérique validé
            const article = await getArticleById(articleId); 
            if (!article) createError({statusCode: 404, statusMessage:"Aucun articles récupéré"});

              return article;
                  }  catch (err){
                  // La gestion des erreurs est propre
                  if ((err as H3Error).statusCode) {
                     throw err;
                                };

        console.error(`Erreur lors de la recherche de l'événement avec l'ID ${id}:`, err);
        throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la recherche de l\'article' });

                  }

});