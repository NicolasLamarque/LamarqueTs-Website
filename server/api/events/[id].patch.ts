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
    if (!idParam) throw createError({ statusCode: 400, message: 'ID missing' });
    
    const id = parseInt(idParam);
    const body = await readBody(event);
    
    // Récupérer l'événement actuel
    const [currentEvent] = await db.select()
      .from(evenements)
      .where(eq(evenements.id, id))
      .limit(1);
    
    if (!currentEvent) throw createError({ statusCode: 404, message: 'Event not found' });

    const updates: any = { updatedAt: new Date() };

    // Champs communs
    if (body.titleEvenement !== undefined) updates.titleEvenement = body.titleEvenement;
    if (body.TextEvenement !== undefined) updates.TextEvenement = body.TextEvenement;
    if (body.color !== undefined) updates.color = body.color;
    if (body.location !== undefined) updates.location = body.location;
    if (body.status !== undefined) updates.status = body.status;
    if (body.allDay !== undefined) updates.allDay = body.allDay;

    if (currentEvent.isRecurrent) {
      // 🔥 Événement récurrent

      // Calculer la durée si heures modifiées
      if (body.heureDebut !== undefined || body.heureFin !== undefined) {
        const startTime = body.heureDebut || extractTimeFromRRule(currentEvent.rrule, 'start');
        const endTime = body.heureFin || currentEvent.heureFin || '23:59';
        const isAllDay = body.allDay !== undefined ? body.allDay : currentEvent.allDay;
        
        updates.duration = calculateDuration(startTime, endTime, isAllDay);
        updates.heureDebut = startTime;
        updates.heureFin = endTime;
      }

      // Reconstruire la RRule
      const currentRRule = parseRRuleToObject(currentEvent.rrule);
      const freq = body.frequency || currentRRule.freq || 'weekly';
      const interval = body.interval || currentRRule.interval || 1;
      const startDate = body.dateDebut || currentRRule.dtstart?.split('T')[0] || new Date().toISOString().split('T')[0];
      const startTime = body.heureDebut || extractTimeFromRRule(currentEvent.rrule, 'start') || '00:00';

      const newRRuleParts = [
        `FREQ=${freq.toUpperCase()}`,
        `INTERVAL=${interval}`,
        `DTSTART=${startDate.replace(/-/g,'')}T${startTime.replace(':','')}00Z`
      ];

      if (body.count && body.count > 0) {
        newRRuleParts.push(`COUNT=${body.count}`);
      } else if (currentRRule.count) {
        newRRuleParts.push(`COUNT=${currentRRule.count}`);
      }

      updates.rrule = newRRuleParts.join(';');

      // Mettre à jour dateDebut si changé
      if (body.dateDebut) {
        const parsed = new Date(startDate);
        if (!isNaN(parsed.getTime())) updates.dateDebut = parsed;
      }

    } else {
      // 🔥 Événement simple
      if (body.dateDebut !== undefined) {
        const parsed = new Date(body.dateDebut);
        if (!isNaN(parsed.getTime())) updates.dateDebut = parsed;
      }
      if (body.heureDebut !== undefined) updates.heureDebut = body.heureDebut;
      if (body.heureFin !== undefined) updates.heureFin = body.heureFin;

      if (body.heureDebut !== undefined || body.heureFin !== undefined || body.allDay !== undefined) {
        const startTime = body.heureDebut || currentEvent.heureDebut || '00:00';
        const endTime = body.heureFin || currentEvent.heureFin || '23:59';
        const isAllDay = body.allDay !== undefined ? body.allDay : currentEvent.allDay;
        updates.duration = calculateDuration(startTime, endTime, isAllDay);
      }
    }

    console.log('Updates to apply:', updates);

    const [updated] = await db.update(evenements)
      .set(updates)
      .where(eq(evenements.id, id))
      .returning();

    console.log('Updated event:', updated);
    return { evenement: updated };

  } catch (error) {
    console.error('Error updating event:', error);
    if ((error as any).statusCode) throw error;
    throw createError({ statusCode: 500, message: 'Failed to update event' });
  }
});

// ============================================
// Fonctions utilitaires
// ============================================

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
  const match = rrule.match(/DTSTART=\d{8}T(\d{4})00Z/);
  return match ? `${match[1].slice(0,2)}:${match[1].slice(2,4)}` : '00:00';
}

function calculateDuration(startTime: string, endTime: string | null, isAllDay: boolean): number {
  if (isAllDay) return 1440; // 24 heures
  if (!endTime) return 60; // 1 heure par défaut

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  let duration = (endH*60 + endM) - (startH*60 + startM);
  if (duration < 0) duration += 1440; // passe minuit
  return duration;
}
