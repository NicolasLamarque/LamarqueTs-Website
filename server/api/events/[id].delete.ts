import { defineEventHandler, createError } from 'h3';
// 👈 Importez votre fonction de gestion de DB
import { deleteEvenement } from '../../db/initEvenementsDb'; 

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' });
  const evenementId = parseInt(id as string);
  if (isNaN(evenementId)) throw createError({ statusCode: 400, statusMessage: 'ID invalide.' });

  try {
    const changes = deleteEvenement(evenementId);
    
    if (changes === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Aucun événement trouvé.' });
    }

    return { success: true, message: `Événement ${evenementId} supprimé.` };
  } catch (err) {
    // On vérifie si c'est déjà une erreur H3 pour la relancer, 
    // sinon on lance une erreur 500 générique.
    if ((err as any).statusCode) {
      throw err;
    }
    console.error(err);
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la suppression.' });
  }
});