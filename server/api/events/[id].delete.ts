// ============================================
// server/api/events/[id].delete.ts
// Supprimer un événement
// ============================================

import { defineEventHandler, getRouterParam, createError } from 'h3';
import { db } from '~/server/utils/db';
import { evenements } from '~/server/utils/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id');
    if (!idParam) {
      throw createError({ statusCode: 400, message: 'ID missing' });
    }
    
    const id = parseInt(idParam);
    
    const [deleted] = await db.delete(evenements)
      .where(eq(evenements.id, id))
      .returning();
    
    if (!deleted) {
      throw createError({ statusCode: 404, message: 'Event not found' });
    }
    
    return { message: 'Event deleted', id };
    
  } catch (error) {
    console.error('Error deleting event:', error);
    if ((error as any).statusCode) throw error;
    throw createError({ statusCode: 500, message: 'Failed to delete event' });
  }
});