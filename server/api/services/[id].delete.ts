// server/api/services/[id].delete.ts

import { defineEventHandler, createError, getRouterParam } from 'h3'
import { hardDeleteService } from '../../utils/services' 


export default defineEventHandler(async (event) => {
    // 1. Récupération et validation de l'ID depuis l'URL
    const idParam = getRouterParam(event, 'id');
    
    // Vérifie si l'ID est présent ET s'il peut être converti en un nombre valide
    if (!idParam || isNaN(Number(idParam))) {
        throw createError({ statusCode: 400, statusMessage: 'ID service non valide.' });
    }
    
    const id = Number(idParam); // L'ID est maintenant un nombre (number)
 
    try {
        // 2. Appel à la fonction de suppression définitive
        const deletedService = await hardDeleteService(id);
 
        if (!deletedService) {
            // Drizzle retourne souvent un tableau vide ou null si aucune ligne n'est affectée
            throw createError({ statusCode: 404, statusMessage: 'Service non trouvé pour la suppression.' });
        }
        
        // 3. Retourner le message de succès (avec la bonne entité)
        return { message: `Service ${deletedService.id} supprimé définitivement avec succès.` };
    } catch (err) {
        // Gestion des erreurs H3 existantes (comme le 404 ci-dessus) ou erreurs 500 génériques
        if ((err as any).statusCode) {
            throw err;
        }
        console.error('Erreur lors de la suppression du service:', err);
        throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la suppression du service.' });
    }
});