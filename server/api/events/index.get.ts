// ============================================
// server/api/events/index.get.ts
// Récupérer TOUS les événements
// ============================================

import { defineEventHandler, createError } from 'h3';
import { db } from '~/server/utils/db';
import { evenements } from '~/server/utils/schema';
import { asc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    // La route principale (index) ne doit pas utiliser getRouterParam('id')
    
    const allEvenements = await db.select().from(evenements)
      // Il est souvent bon d'ordonner les événements, par exemple par date de début
      .orderBy(asc(evenements.dateDebut)); 
    
    return allEvenements;
  } catch (error) {
    console.error('Error fetching all events for dashboard:', error);
    // Notez le message d'erreur différent pour vous aider au débogage
    throw createError({ statusCode: 500, message: 'Failed to fetch events list' });
  }
});