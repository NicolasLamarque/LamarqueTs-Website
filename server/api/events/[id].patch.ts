// ============================================
// server/api/events/[id].patch.ts
// Modifier un événement
// ============================================

import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
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
    const body = await readBody(event);
    
    // Récupérer l'événement actuel
    const [currentEvent] = await db.select()
      .from(evenements)
      .where(eq(evenements.id, id))
      .limit(1);
    
    if (!currentEvent) {
      throw createError({ statusCode: 404, message: 'Event not found' });
    }
    
    const updates: any = { updatedAt: new Date() };
    
    // Champs communs
    if (body.titleEvenement !== undefined) updates.titleEvenement = body.titleEvenement;
    if (body.TextEvenement !== undefined) updates.TextEvenement = body.TextEvenement;
    if (body.color !== undefined) updates.color = body.color;
    if (body.location !== undefined) updates.location = body.location;
    if (body.status !== undefined) updates.status = body.status;
    if (body.allDay !== undefined) updates.allDay = body.allDay;
    
    if (currentEvent.isRecurrent) {
      // 🔥 Modification d'un événement récurrent
      if (body.heureDebut || body.heureFin) {
        updates.duration = calculateDuration(
          body.heureDebut || extractTimeFromRRule(currentEvent.rrule, 'start'),
          body.heureFin,
          body.allDay ?? currentEvent.allDay
        );
      }
      
      // Reconstruction de la RRule si nécessaire
      if (body.frequency || body.interval || body.count || body.endDate) {
        const currentRRule = parseRRuleToObject(currentEvent.rrule);
        const newRRuleParts = [
          `FREQ=${(body.frequency || currentRRule.freq || 'daily').toUpperCase()}`,
          `INTERVAL=${body.interval || currentRRule.interval || 1}`,
          `DTSTART=${body.dateDebut || currentRRule.dtstart}T${body.heureDebut || '00:00'}:00`
        ];
        
        if (body.endDate) {
          newRRuleParts.push(`UNTIL=${body.endDate}T23:59:59`);
        } else if (body.count) {
          newRRuleParts.push(`COUNT=${body.count}`);
        } else if (currentRRule.until) {
          newRRuleParts.push(`UNTIL=${currentRRule.until}`);
        } else if (currentRRule.count) {
          newRRuleParts.push(`COUNT=${currentRRule.count}`);
        }
        
        updates.rrule = newRRuleParts.join(';');
      }
      
    } else {
      // 🔥 Modification d'un événement simple
      if (body.dateDebut) {
        const parsed = new Date(body.dateDebut);
        if (!isNaN(parsed.getTime())) {
          updates.dateDebut = parsed;
        }
      }
      if (body.heureDebut !== undefined) updates.heureDebut = body.heureDebut;
      if (body.heureFin !== undefined) updates.heureFin = body.heureFin;
    }
    
    const [updated] = await db.update(evenements)
      .set(updates)
      .where(eq(evenements.id, id))
      .returning();
    
    return { evenement: updated };
    
  } catch (error) {
    console.error('Error updating event:', error);
    if ((error as any).statusCode) throw error;
    throw createError({ statusCode: 500, message: 'Failed to update event' });
  }
});

function parseRRuleToObject(rrule: string | null) {
  if (!rrule) return {};
  const parts = rrule.split(';');
  const obj: any = {};
  
  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key === 'FREQ') obj.freq = value.toLowerCase();
    if (key === 'INTERVAL') obj.interval = parseInt(value);
    if (key === 'DTSTART') obj.dtstart = value;
    if (key === 'UNTIL') obj.until = value;
    if (key === 'COUNT') obj.count = parseInt(value);
  });
  
  return obj;
}

function extractTimeFromRRule(rrule: string | null, type: 'start' | 'end'): string {
  if (!rrule) return '00:00';
  const match = rrule.match(/DTSTART=\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/);
  return match ? match[1] : '00:00';
}