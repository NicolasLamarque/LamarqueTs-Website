// Exemple : server/api/evenements/group/[groupId].delete.ts

import { defineEventHandler, createError } from 'h3';
import { deleteByRecurrentId } from '../../db/initEvenementsDb';

export default defineEventHandler(async (event) => {
    const groupIdParam = event.context.params?.groupId;

    if (!groupIdParam) {
        throw createError({ statusCode: 400, message: 'Group ID manquant.' });
    }
    const recurrentId = parseInt(groupIdParam);

    try {
        const changes = deleteByRecurrentId(recurrentId);

        if (changes === 0) {
            throw createError({ statusCode: 404, message: 'Aucun événement récurrent trouvé pour la suppression.' });
        }

        return { success: true, message: `${changes} événements récurrents (ID: ${recurrentId}) supprimés.` };
    } catch (err) {
        // ... (Gestion des erreurs H3 et 500)
        throw createError({ statusCode: 500, message: 'Erreur lors de la suppression du groupe récurrent.' });
    }
});