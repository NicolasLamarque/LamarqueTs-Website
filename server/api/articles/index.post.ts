// server/api/articles/index.post.ts

import { defineEventHandler, createError, H3Error, readBody } from 'h3';
import { insertArticle, Article } from '../../db/initArticlesDb'


export default defineEventHandler(async (event) => { // 👈 On passe l'objet 'event'
    let nouvelArticle: Article;
    
    // 1. Lire et valider les données envoyées par le client
    try {
        // Lire le corps de la requête de manière ASYNCHRONE
        nouvelArticle = await readBody<Article>(event); 
        
        // ⚠️ Ajoutez ici une validation essentielle (ex: le titre doit exister)
        if (!nouvelArticle || !nouvelArticle.titleArticle) {
             throw createError({ statusCode: 400, message: 'Le titre de l\'événement est requis.' });
        }

    } catch (err) {
        // Attrape les erreurs de validation ou de lecture du corps (JSON mal formé)
        if (err instanceof H3Error) throw err;
        throw createError({ statusCode: 400, message: 'Format de données invalide.' });
    }

    try {
        // 2. Appeler la fonction centralisée d'insertion
        //    Passer l'objet 'nouvelEvenement' en argument
        const result = insertArticle(nouvelArticle); 

        // 3. Retourner l'ID ou un message de succès (Code HTTP 201 Created est implicite ici)
        //    (La fonction insertEvenement doit être mise à jour pour retourner l'ID)
        return { 
            success: true, 
            id: result.lastInsertRowid, // Si on met à jour la fonction pour retourner le résultat
            message: "Article créé avec succès." 
        };

    } catch (err) {
        // 4. Gestion des erreurs DB non-prévues (Erreur 500)
        console.error('Erreur DB lors de l\'insertion de l\'article:', err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne lors de la création de l\'article.',
        });
    } 
});