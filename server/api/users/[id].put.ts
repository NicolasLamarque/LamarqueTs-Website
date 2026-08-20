// server/api/users/[id].put.ts

// 💡 Assurez-vous d'importer 'getRouterParam' depuis 'h3'
import { readBody, createError, defineEventHandler, getRouterParam } from 'h3'; 
import { updateUser, getUserById, User } from '../../utils/users';
import { deleteBlobIfUnused } from '../../utils/blob';

export default defineEventHandler(async (event) => {
    // 1. EXTRAIRE L'ID DE L'URL (C'est la ligne manquante)
    const idParam = getRouterParam(event, 'id'); 
    const body = await readBody(event); 

    // 2. VALIDATION DE L'ID
    if (!idParam || isNaN(Number(idParam))) {
        throw createError({ statusCode: 400, statusMessage: "ID utilisateur non valide ou manquant." });
    }
    
    // Conversion en nombre, car les fonctions de service (updateUser) attendent un 'number'.
    const id = Number(idParam); 
    
    // 3. Validation de base du corps de la requête (optionnel, mais recommandé)
    if (Object.keys(body).length === 0) {
         throw createError({ statusCode: 400, statusMessage: "Aucune donnée de mise à jour fournie." });
    }


    try {
        // Photo actuelle mémorisée AVANT l'écriture : après la mise à jour,
        // l'ancienne URL n'existe plus en base et on ne saurait plus quel
        // fichier est devenu inutile.
        const utilisateurAvant = await getUserById(id);
        const ancienom = utilisateurAvant?.profile_picture ?? null;

        // 4. Appel à la fonction de mise à jour
        const updatedUser = await updateUser(id, body as Partial<User>);
        
        if (!updatedUser) {
            // L'utilisateur n'a pas été trouvé (updateUser a retourné 'undefined')
            throw createError({ statusCode: 404, statusMessage: "Utilisateur non trouvé pour la mise à jour." });
        }

        // Photo de profil changée => l'ancienne n'est plus affichée nulle part.
        // Si elle est identique, on ne touche à rien (cas d'une simple
        // modification du nom ou du rôle, par exemple).
        if (ancienom && ancienom !== updatedUser.profile_picture) {
            await deleteBlobIfUnused(ancienom, `ancienne photo de l'utilisateur ${id}`);
        }

        // 5. Sécurité: Retire le mot de passe hashé de la réponse
        const { password, ...safeUser } = updatedUser; 
        
        return { user: safeUser };

    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        // Gérer les erreurs spécifiques à la DB si possible, sinon 500
        throw createError({ statusCode: 500, statusMessage: "Échec de la mise à jour de l'utilisateur." });
    }
});