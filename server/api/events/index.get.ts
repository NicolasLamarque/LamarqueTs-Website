// server/api/evenements/index.get.ts
import { defineEventHandler, createError } from 'h3';
// Importez UNIQUEMENT la fonction et l'interface nécessaires
import { getAllEvenements, Evenement } from '../../db/initEvenementsDb'; 


export default defineEventHandler(async () => {
  try {
    // Appel direct à la fonction centralisée. 
    // Elle gère l'ouverture, l'exécution, et la fermeture de la DB.
    const evenements: Evenement[] = getAllEvenements(); 

    return evenements;
  } catch (err) {
    console.error('Erreur DB lors de la récupération des événements:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne lors de la récupération des événements.',
    });
  } 
  // NOTE : Le bloc finally est maintenant dans getAllEvenements
});