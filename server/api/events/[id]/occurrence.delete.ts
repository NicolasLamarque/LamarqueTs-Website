// ============================================
// server/api/events/[id]/occurrence.delete.ts
// Annuler UNE occurrence d'un événement récurrent
// ============================================

import { defineEventHandler, getRouterParam, getQuery, createError } from 'h3';
import { db } from '../../../../server/utils/db';
import { evenements } from '../../../../server/utils/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id');
    const { date } = getQuery(event);
    
    if (!idParam || !date) {
      throw createError({ statusCode: 400, message: 'ID and date required' });
    }
    
    const id = parseInt(idParam);
    
    const [evenement] = await db.select()
      .from(evenements)
      .where(eq(evenements.id, id))
      .limit(1);
    
    if (!evenement || !evenement.isRecurrent) {
      throw createError({ statusCode: 404, message: 'Recurrent event not found' });
    }
    
    // Ajouter la date à exdate
    const exdates = evenement.exdate ? evenement.exdate.split(',') : [];
    if (!exdates.includes(date as string)) {
      exdates.push(date as string);
    }
    
    await db.update(evenements)
      .set({ 
        exdate: exdates.join(','),
        updatedAt: new Date()
      })
      .where(eq(evenements.id, id));
    
    return { 
      success: true, 
      message: `Occurrence on ${date} cancelled` 
    };
    
  } catch (error) {
    console.error('Error cancelling occurrence:', error);
    if ((error as any).statusCode) throw error;
    throw createError({ statusCode: 500, message: 'Failed to cancel occurrence' });
  }
});