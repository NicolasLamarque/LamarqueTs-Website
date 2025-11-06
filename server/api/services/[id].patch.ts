// server/api/services/[id].patch.ts

import { defineEventHandler, readBody, createError } from 'h3';
import { updateService } from '../../utils/services';

export default defineEventHandler(async (event) => {
    // La variable 'id' est une chaîne de caractères provenant des paramètres de l'URL
    const { id } = event.context.params as { id: string };

    // Validation et conversion au début du bloc try
    const serviceId = parseInt(id);
    if (isNaN(serviceId)) {
        throw createError({ statusCode: 400, statusMessage: 'ID de service non valide.' });
    }

    try {
        const body = await readBody(event); // Lire le corps de la requête

        // 💡 CORRECTION : Utiliser serviceId (le nombre validé) pour la fonction
        const updatedService = await updateService(serviceId, body); 
        
        // Gérer le cas où le service n'est pas trouvé
        if (!updatedService) {
            throw createError({ statusCode: 404, statusMessage: `Service avec l'ID ${serviceId} non trouvé.` });
        }

        return { service: updatedService };
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du service avec l'ID ${id}:`, error);
        
        // Si l'erreur a déjà un statusCode (comme le 404 ci-dessus), on la lance directement
        if ((error as { statusCode?: number }).statusCode) throw error; 

        throw createError({
            statusCode: 500,
            statusMessage: "Échec de la mise à jour du service.",
        });
    }
});