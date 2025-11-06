// ============================================
// server/api/events/index.post.ts - CORRIGÉ
// Créer un événement (simple OU récurrent)
// ============================================

import { defineEventHandler, readBody, createError } from 'h3';
import { db } from '~/server/utils/db';
import { evenements } from '~/server/utils/schema';
import { 
  buildRRule, 
  calculateDuration, 
  validateRRule 
} from '~/server/utils/rruleHelpers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validation de base
    if (!body.titleEvenement || !body.TextEvenement || !body.dateDebut || !body.CategoryEvenement) {
      throw createError({ 
        statusCode: 400, 
        message: 'Champs obligatoires manquants (Titre, Texte, Date Début, Catégorie)' 
      });
    }
    
    // DÉTECTION DE RÉCURRENCE : basée sur la présence de 'frequency'
    const isRecurrent = !!body.frequency;
    
    // Données communes
    const commonData = {
      titleEvenement: body.titleEvenement,
      TextEvenement: body.TextEvenement,
      AuthorEvenement: body.AuthorEvenement || null,
      CategoryEvenement: body.CategoryEvenement || null,
      ImageEvenement: body.ImageEvenement || null,
      TagsEvenement: body.TagsEvenement || null,
      link: body.link || null,
      icon: body.icon || null,
      color: body.color || '#3b82f6',
      location: body.location || null,
      status: body.status || 'confirmed',
      allDay: body.allDay || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    let newEvent: any;
    
    if (isRecurrent) {
      // ========================================
      // ÉVÉNEMENT RÉCURRENT
      // ========================================
      
      // Validation récurrence
      if (!body.count && !body.endDate) {
        throw createError({ 
          statusCode: 400, 
          message: 'Pour un événement récurrent, COUNT ou ENDDATE est requis' 
        });
      }
      
      // Construction de la RRule
      const rrule = buildRRule({
        dateDebut: body.dateDebut,
        heureDebut: body.heureDebut,
        frequency: body.frequency,
        interval: body.interval || 1,
        count: body.count,
        endDate: body.endDate,
        byweekday: body.byweekday,
        allDay: body.allDay,
      });
      
      // Validation de la RRule générée
      const validation = validateRRule(rrule);
      if (!validation.valid) {
        throw createError({ 
          statusCode: 400, 
          message: `RRule invalide: ${validation.errors.join(', ')}` 
        });
      }
      
      // Calcul de la durée
      const duration = calculateDuration(
        body.heureDebut, 
        body.heureFin, 
        body.allDay
      );
      
      newEvent = {
        ...commonData,
        isRecurrent: true,
        rrule: rrule,
        duration: duration,
        exdate: null,
        // Pour récurrent, ces champs sont NULL
        dateDebut: null,
        heureDebut: null,
        heureFin: null,
      };
      
      console.log('✅ Événement récurrent créé avec RRule:', rrule);
      
    } else {
      // ========================================
      // ÉVÉNEMENT SIMPLE
      // ========================================
      
      // Parse et valide la date
      const dateDebut = new Date(body.dateDebut);
      if (isNaN(dateDebut.getTime())) {
        throw createError({ 
          statusCode: 400, 
          message: 'Date de début invalide' 
        });
      }
      
      newEvent = {
        ...commonData,
        isRecurrent: false,
        dateDebut: dateDebut,
        heureDebut: body.heureDebut || null,
        heureFin: body.heureFin || null,
        // Pour simple, ces champs sont NULL
        rrule: null,
        duration: null,
        exdate: null,
      };
      
      console.log('✅ Événement simple créé pour le', dateDebut.toISOString());
    }
    
    // Insertion dans la DB
    const [created] = await db.insert(evenements)
      .values(newEvent)
      .returning();
    
    return { 
      success: true, 
      event: created,
      type: isRecurrent ? 'recurrent' : 'simple',
      message: isRecurrent 
        ? `Série récurrente créée avec ${body.count || 'plusieurs'} occurrences`
        : 'Événement simple créé',
    };
    
  } catch (error: any) {
    console.error('❌ Erreur création événement:', error);
    
    // Si erreur avec statusCode, la propager
    if (error.statusCode) throw error;
    
    // Sinon, erreur générique
    throw createError({ 
      statusCode: 500, 
      message: error.message || 'Échec de création de l\'événement' 
    });
  }
});