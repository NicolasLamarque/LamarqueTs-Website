// -----------------------------------------------------------
// server/api/events/getduree.ts
import { defineEventHandler, getQuery, createError } from 'h3';
import { getEvenementDureeData } from '~/server/utils/evenements';

export default defineEventHandler(async (event) => {
  try {
    const { id } = getQuery(event);
    
    if (!id) {
      throw createError({ statusCode: 400, message: 'ID required' });
    }
    
    const eventId = parseInt(id as string);
    
    if (isNaN(eventId)) {
      throw createError({ statusCode: 400, message: 'Invalid ID' });
    }
    
    const eventData = await getEvenementDureeData(eventId);
    
    // Si pas de données ou dates manquantes
    if (!eventData?.dateDebut || !eventData?.heureDebut || !eventData?.dateFin || !eventData?.heureFin) {
      return { duree: 0 };
    }
    
    // Construire les dates complètes
    const dateDebut = eventData.dateDebut instanceof Date 
      ? eventData.dateDebut.toISOString().split('T')[0] 
      : String(eventData.dateDebut);
    const dateFin = eventData.dateFin instanceof Date 
      ? eventData.dateFin.toISOString().split('T')[0] 
      : String(eventData.dateFin);
    
    const debut = new Date(`${dateDebut}T${eventData.heureDebut}`);
    const fin = new Date(`${dateFin}T${eventData.heureFin}`);
    
    const dureeMs = fin.getTime() - debut.getTime();
    
    // Durée en minutes (ou 0 si négatif)
    return { duree: dureeMs > 0 ? dureeMs / (1000 * 60) : 0 };
  } catch (error) {
    console.error('Error in getduree:', error);
    if ((error as any).statusCode) throw error;
    throw createError({ statusCode: 500, message: 'Failed to calculate duration' });
  }
});