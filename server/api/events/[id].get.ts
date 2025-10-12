// server/api/evenements/[id].get.ts
// server/api/evenements/[id].get.ts
import { defineEventHandler, createError, H3Error  } from 'h3';
// 👈 On importe UNIQUEMENT la fonction dont on a besoin
import { getEvenementById } from '../../db/initEvenementsDb'; 
import { Evenement } from '../../db/initEvenementsDb'; // (Assurez-vous d'exporter l'interface)

// 👇 On définit la route GET pour /api/evenements/:id
export default defineEventHandler((event) => {

  // 🔹 Récupération et validation de l'ID
  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, message: "L'ID de l'événement est requis." });
  }

  // Conversion en nombre entier pour l'utiliser dans la fonction
  const evenementId = parseInt(id as string);
  if (isNaN(evenementId)) {
    throw createError({ statusCode: 400, message: "L'ID doit être un nombre valide." });
  }

  try { 
    // 🔹 🚀 Utilisation de la fonction centralisée !
    const evenement = getEvenementById(evenementId);

    // 🔹 Gestion de la réponse 404
    if (!evenement) {
      throw createError({
        statusCode: 404,
        message: "Événement non trouvé.",
      });
    }

    // 🔹 Tout est OK → on renvoie l'événement
    return evenement as Evenement; 

  } catch (err) {
    // 🔹 Gestion des erreurs (incluant 404 si lancée ci-dessus)
    
    // Si c'est déjà une erreur HTTP (comme le 404), on la relance telle quelle
    if (err instanceof H3Error) {
        throw err;
    }
    
    console.error("Erreur DB lors de la récupération de l'événement:", err);

    // On renvoie une erreur 500 pour les autres problèmes techniques
    throw createError({
      statusCode: 500,
      message: "Erreur interne lors de la récupération de l'événement.",
    });
  }
  
  // NOTE : Plus besoin du bloc 'finally' ici, car il est géré 
  //        par la fonction `getEvenementById` elle-même.
});