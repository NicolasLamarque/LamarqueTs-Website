// server/api/articles/[id].put.ts

import { defineEventHandler, createError, H3Error, readBody } from 'h3';
import { updateArticle, ArticleInsert} from '../../utils/articles';

// Le type pour les données de mise à jour : tout est optionnel
type ArticleUpdatePayload = Partial<ArticleInsert>;

export default defineEventHandler(async (event) => { 
    // 1. Validation de l'ID
    const idParam = event.context.params?.id;
    if (!idParam) throw createError({ statusCode: 400, statusMessage: 'ID de l\'article manquant.' });
    
    const articleId = parseInt(idParam);
    if (isNaN(articleId)) throw createError({ statusCode: 400, statusMessage: 'ID invalide.' });

    let updatedData: ArticleUpdatePayload;
    try {
        // 2. Lecture et typage correct des données du corps
        updatedData = await readBody<ArticleUpdatePayload>(event); 
    } catch (error) {
        throw createError({ statusCode: 400, statusMessage: 'Corps de requête invalide.' });
    }

    // 🎯 CORRECTION: Conversion des chaînes de date en objets Date JS
    // Cette étape est cruciale car JSON envoie les dates comme des chaînes.
    if (updatedData.DatePost && typeof updatedData.DatePost === 'string') {
        updatedData.DatePost = new Date(updatedData.DatePost);
    }
    
    // Bien que créé_at soit rarement mis à jour, on le convertit s'il est envoyé
    if (updatedData.created_at && typeof updatedData.created_at === 'string') {
        updatedData.created_at = new Date(updatedData.created_at);
    }

    // NOTE: updated_at n'a pas besoin d'être converti ici, car il est 
    // défini sur `new Date()` directement dans la fonction updateArticle.
    
    // NOTE: Validation des données (Ex: s'assurer qu'au moins un champ est présent)
    if (Object.keys(updatedData).length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'Aucune donnée fournie pour la mise à jour.' });
    }

    try {
        // 3. Appel de la fonction Drizzle
        const updatedArticle: ArticleSelect | undefined = await updateArticle(articleId, updatedData);

        // 4. Gestion de la réponse HTTP
        if (!updatedArticle) {
            throw createError({ statusCode: 404, statusMessage: 'Article non trouvé pour la mise à jour.' });
        }

        // 5. Retour de l'article mis à jour
        return { 
            success: true, 
            message: `Article ${articleId} mis à jour avec succès.`,
            article: updatedArticle
        };

    } catch (err) {
        // 6. Gestion des erreurs
        if (err instanceof H3Error) {
            throw err; 
        }

        // ⚠️ La ligne ci-dessous a révélé l'erreur clé !
        console.error("Erreur DB lors de la mise à jour de l'article:", err);
        throw createError({ statusCode: 500, statusMessage: "Erreur interne lors de la mise à jour de l'article." });
    }
});