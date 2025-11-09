// ============================================
// server/api/contact/messages/[id].delete.ts
// Supprimer un message (soft delete ou hard delete)
// ============================================
import { defineEventHandler, getRouterParam, getQuery, createError } from 'h3'
import { db } from '../../utils/db'
import { contacts_messages } from '../../utils/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const query = getQuery(event)
  const hardDelete = query.hard === 'true' // ?hard=true pour suppression définitive
  
  if (!id || isNaN(id)) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: "ID invalide" 
    })
  }

  console.log(`🗑️ Suppression message ID: ${id} (hard: ${hardDelete})`)
  
  try {
    // Vérifier que le message existe
    const [existingMessage] = await db
      .select()
      .from(contacts_messages)
      .where(eq(contacts_messages.id, id))
      .limit(1)

    if (!existingMessage) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: "Message non trouvé" 
      })
    }

    if (hardDelete) {
      // Suppression définitive
      await db
        .delete(contacts_messages)
        .where(eq(contacts_messages.id, id))
      
      console.log('✅ Message supprimé définitivement')
    } else {
      // Soft delete
      await db
        .update(contacts_messages)
        .set({
          deleted: true,
          deleted_at: new Date(),
          deleted_by: 'admin', // À remplacer par l'utilisateur connecté
          updated_at: new Date()
        })
        .where(eq(contacts_messages.id, id))
      
      console.log('✅ Message marqué comme supprimé (soft delete)')
    }

    return { 
      success: true, 
      message: hardDelete 
        ? "Message supprimé définitivement" 
        : "Message archivé (soft delete)"
    }
    
  } catch (error: any) {
    console.error('❌ Erreur suppression:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur: ${error.message}` 
    })
  }
})