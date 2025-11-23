// ============================================
// 📁 server/api/mail/[id].patch.ts
// ✅ CORRIGÉ POUR PROD
// ============================================
import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '../../utils/db'
import { contacts_messages } from '../../utils/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // ✅ CORRECTION : Utiliser event.context.params
  const idParam = event.context.params?.id
  
  if (!idParam) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: "ID manquant" 
    })
  }

  const id = parseInt(idParam)
  
  if (isNaN(id)) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: "ID invalide" 
    })
  }

  const body = await readBody(event)

  console.log(`📝 Mise à jour message ID: ${id}`, body)
  
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

    // Construire l'objet de mise à jour
    const updateData: any = {
      updated_at: new Date()
    }

    if (body.status) updateData.status = body.status
    if (body.assigned_to !== undefined) updateData.assigned_to = body.assigned_to
    if (body.priority) updateData.priority = body.priority

    // Mettre à jour
    const [updated] = await db
      .update(contacts_messages)
      .set(updateData)
      .where(eq(contacts_messages.id, id))
      .returning()

    console.log('✅ Message mis à jour:', updated.status)

    return { 
      success: true, 
      message: "Message mis à jour avec succès",
      data: updated
    }
    
  } catch (error: any) {
    console.error('❌ Erreur mise à jour:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur: ${error.message}` 
    })
  }
})
