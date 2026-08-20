// server/api/users/[id].delete.ts
import { defineEventHandler, createError } from 'h3'
import {deleteUser} from '../../utils/users';
import { deleteBlobIfUnused } from '../../utils/blob';


export default defineEventHandler(async (event) => {
 // 💡 Utilisez getRouterParam et vérifiez la non-nullité et le format en une seule étape
    const idParam = getRouterParam(event, 'id');
    
    if (!idParam || isNaN(Number(idParam))) {
        throw createError({ statusCode: 400, statusMessage: 'ID utilisateur non valide.' });
    }
    
    const id = Number(idParam);

  try {
    const deletedUser = await deleteUser(id);

if (!deletedUser) {
    // Si la fonction retourne 'undefined', cela signifie 0 changement
    throw createError({ statusCode: 404, statusMessage: 'Utilisateur non trouvé pour la suppression.' });
}
    // Le compte n'existe plus : sa photo de profil devient un orphelin
    // dans le Blob. On la retire (sauf si un autre compte utilise la même).
    await deleteBlobIfUnused(deletedUser.profile_picture, `utilisateur ${deletedUser.id} supprimé`);

    return { message: `Utilisateur ${deletedUser.id} supprimé avec succès.` };
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