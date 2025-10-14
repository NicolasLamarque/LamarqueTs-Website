// server/api/services/[id].delete.ts
import { defineEventHandler, createError } from 'h3';
// 👈 Importez votre fonction de gestion de DB
import { deleteService } from '../../db/initServicesDb'; 


export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant.' });
  //
  const serviceId = parseInt(id as string);
  if (isNaN(serviceId)) throw createError({ statusCode: 400, statusMessage: 'ID invalide.' });

 try {
     const changes = deleteService(serviceId);
     
     if (changes === 0) {
       throw createError({ statusCode: 404, statusMessage: 'Aucun service trouvé.' });
     }
 
     return { success: true, message: `Service ${serviceId} supprimé.` };
   } catch (err) {
     // On vérifie si c'est deja une erreur H3 pour la relancer, 
     // sinon on lance une erreur 500 générique.
     if ((err as any).statusCode) {
       throw err;
     }
     console.error(err);
     throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la suppression.' });
   }
});