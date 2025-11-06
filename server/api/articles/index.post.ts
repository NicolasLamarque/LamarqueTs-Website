// server/api/articles/index.post.ts

import { defineEventHandler, createError, H3Error, readBody } from 'h3';
// 🎯 Importez la fonction de service et le type d'insertion
import { insertArticle, ArticleInsert} from '../../utils/articles';


export default defineEventHandler(async (event) => {
    let nouvelArticleData: ArticleInsert; // Renommé pour éviter la confusion avec le résultat
    
    // 1. Lire et valider les données envoyées par le client
    try {
        // Lire le corps de la requête de manière ASYNCHRONE
        nouvelArticleData = await readBody<ArticleInsert>(event); 
        
        // Validation essentielle (le titre et le texte sont requis par votre schéma)
        if (!nouvelArticleData || !nouvelArticleData.titleArticle || !nouvelArticleData.TextArticle) {
            throw createError({ statusCode: 400, statusMessage: 'Le titre et le texte de l\'article sont requis.' });
        }
        // NOTE: Votre schéma Drizzle force titleArticle et TextArticle à être notNull.
        // Si ces champs ne sont pas fournis, Drizzle lancera une erreur.

    } catch (err) {
        // Attrape les erreurs de validation (400) ou de lecture du corps
        if (err instanceof H3Error) throw err;
        throw createError({ statusCode: 400, statusMessage: 'Format de données invalide.' });
    }

    try {
      // 🔹 Conversion des champs Date envoyés par le front
if (nouvelArticleData.DatePost && typeof nouvelArticleData.DatePost === 'string') {
  nouvelArticleData.DatePost = new Date(nouvelArticleData.DatePost);
}

if (nouvelArticleData.created_at && typeof nouvelArticleData.created_at === 'string') {
  nouvelArticleData.created_at = new Date(nouvelArticleData.created_at);
}

if (nouvelArticleData.updated_at && typeof nouvelArticleData.updated_at === 'string') {
  nouvelArticleData.updated_at = new Date(nouvelArticleData.updated_at);
}


        const article: ArticleSelect = await insertArticle(nouvelArticleData); 

        // 3. Retourner l'objet créé par Drizzle (qui contient l'ID généré)
        return { 
            success: true, 
            id: article.id, // L'ID se trouve sur l'objet retourné par Drizzle
            message: "Article créé avec succès.",
            article: article // Optionnel : retourne l'article complet
        };

    } catch (err) {
        // 4. Gestion des erreurs DB (Erreur 500)
        console.error('Erreur DB lors de l\'insertion de l\'article:', err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne lors de la création de l\'article.',
        });
    } 
});