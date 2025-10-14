// server/api/services/[id].patch.ts (Recommandé)


import { defineEventHandler, createError, H3Error, readBody } from 'h3';
// Importez l'interface complète 'Service'
import { updateService, getServiceById, Service } from '../../db/initServicesDb'; 


export default defineEventHandler(async (event) => { 
  // --- 1. VALIDATION DE L'ID ---
  const idParam = event.context.params?.id;
  if (!idParam) throw createError({ statusCode: 400, message: 'ID du service manquant.' });
  
  const serviceId = parseInt(idParam);
  if (isNaN(serviceId)) throw createError({ statusCode: 400, message: 'ID invalide.' });

  // --- 2. LECTURE DES DONNÉES (PARTIELLES) ---
  // On utilise Partial<Service> car on ne reçoit que les champs à modifier
  let updatedData: Partial<Service>; 
  try {
    updatedData = await readBody<Partial<Service>>(event); 
  } catch (error) {
    throw createError({ statusCode: 400, message: 'Corps de requête invalide.' });
  }
  
  // Si l'objet est vide (pas de données à modifier)
  if (Object.keys(updatedData).length === 0) {
    throw createError({ statusCode: 400, message: 'Aucune donnée fournie pour la mise à jour.' });
  }

  try {
    // --- 3. EXÉCUTION DB ---
    // Appel de la fonction de mise à jour partielle
    const changes = updateService(serviceId, updatedData); 

    // 4. Gestion 404 (0 changements = service non trouvé)
    if (changes === 0) {
      throw createError({ statusCode: 404, message: 'Service non trouvé.' });
    }

    const serviceMiseAJour = getServiceById(serviceId);

if (!serviceMiseAJour) {
    // Gérer l'erreur critique (voir ci-dessus)
    throw createError({ statusCode: 500, message: 'Erreur de lecture après mise à jour.' });
}

const titreService = serviceMiseAJour.title;
    
return { 
    success: true, 
    service: serviceMiseAJour, 
    message: `Service "${titreService}" mis à jour.` 
};

  } catch (err) {
    // --- 6. GESTION DES ERREURS TECHNIQUES ---
    if (err instanceof H3Error) {
      throw err; 
    }
    console.error("Erreur DB lors de la mise à jour:", err);
    throw createError({ statusCode: 500, message: "Erreur interne lors de la mise à jour du service." });
  }
});