import { defineEventHandler, readBody, createError, H3Error } from 'h3';
// 👈 Importez uniquement la fonction et l'interface nécessaires
import { updateRecurrentGroup, Evenement } from '../../db/initEvenementsDb'; 

export default defineEventHandler(async (event) => {
  const groupId = event.context.params?.groupId;
  
  if (!groupId) {
    throw createError({ statusCode: 400, statusMessage: 'Group ID manquant.' });
  }

  let body: Evenement;
  try {
    // Lire le corps de la requête
    body = await readBody<Evenement>(event); 
  } catch (error) {
    throw createError({ statusCode: 400, statusMessage: 'Format de données invalide.' });
  }

  try {
    // 🚀 Appel de la fonction centralisée !
    const changes = updateRecurrentGroup(groupId, body);

    return { 
      success: true, 
      message: `Groupe ${groupId} mis à jour (${changes} événements modifiés).` 
    };
  } catch (err) {
    // Gestion des erreurs DB
    if (err instanceof H3Error) throw err;
    
    console.error('Erreur DB lors de la mise à jour du groupe:', err);
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la mise à jour du groupe.' });
  }
  // NOTE : Plus de db.close() ou d'import de 'better-sqlite3' ici !
});