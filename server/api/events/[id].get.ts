// -----------------------------------------------------------
// server/api/events/[id].get.ts
import { defineEventHandler, getRouterParam, createError } from 'h3';
import { getEvenementById } from '~/server/utils/evenements';

export default defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id');
    
    if (!idParam) {
      throw createError({ statusCode: 400, message: 'ID missing' });
    }
    
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      throw createError({ statusCode: 400, message: 'Invalid ID' });
    }
    
    const evenement = await getEvenementById(id);
    
    if (!evenement) {
      throw createError({ statusCode: 404, message: 'Event not found' });
    }
    
    return evenement;
  } catch (error) {
    console.error('Error in [id].get:', error);
    if ((error as any).statusCode) throw error;
    throw createError({ statusCode: 500, message: 'Failed to fetch event' });
  }
});
