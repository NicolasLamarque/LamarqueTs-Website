// server/api/evenements/[id].put.ts

import { defineEventHandler, createError, H3Error, readBody } from 'h3';
import { updateEvenement, Evenement } from '../../db/initEvenementsDb'; // Importez la fonction et l'interface

export default defineEventHandler(async (event) => { 
  // 1. Validation de l'ID
  const idParam = event.context.params?.id;
  if (!idParam) throw createError({ statusCode: 400, message: 'ID de l\'événement manquant.' });
  
  const evenementId = parseInt(idParam);
  if (isNaN(evenementId)) throw createError({ statusCode: 400, message: 'ID invalide.' });

  let updatedData: Evenement;
  try {
    // ⚠️ readBody DOIT être awaité car c'est une opération asynchrone
    updatedData = await readBody<Evenement>(event); 
  } catch (error) {
    throw createError({ statusCode: 400, message: 'Corps de requête invalide.' });
  }

  // NOTE: Ajouter ici plus de validation des champs requis de 'updatedData' si nécessaire.
  // Par exemple: if (!updatedData.titleEvenement) throw...

  try {
    // 3. Appel de la fonction centralisée de mise à jour
   // 🚀 'changes' est maintenant un nombre (0 ou 1)
    const changes = updateEvenement(evenementId, updatedData);

    // 4. Gestion de la réponse HTTP
    if (changes === 0) {
      throw createError({ statusCode: 404, message: 'Événement non trouvé pour la mise à jour.' });
    }

    return { success: true, id: evenementId, message: `Événement ${evenementId} mis à jour.` };

  } catch (err) {
    // 5. Gestion des erreurs (DB ou 404)
    if (err instanceof H3Error) {
      throw err; // Relance le 404 ou autre erreur H3
    }

    console.error("Erreur DB lors de la mise à jour:", err);
    throw createError({ statusCode: 500, message: "Erreur interne lors de la mise à jour de l'événement." });
  }
});