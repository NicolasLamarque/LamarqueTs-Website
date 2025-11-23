// ============================================
// 📁 server/api/mail/[id].delete.ts
// ✅ CORRIGÉ POUR PROD
// ============================================
import { defineEventHandler, getQuery, createError } from 'h3'
import { softDeleteMessage, hardDeleteMessage } from '../../utils/contact'

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

  const query = getQuery(event)
  const hardDelete = query.hard === 'true'

  console.log(`🗑️ Suppression message ID: ${id} (hard: ${hardDelete})`)
  
  try {
    let success: boolean
    
    if (hardDelete) {
      success = await hardDeleteMessage(id)
      console.log('✅ Message supprimé définitivement')
    } else {
      success = await softDeleteMessage(id, 'admin')
      console.log('✅ Message marqué comme supprimé (soft delete)')
    }

    if (!success) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: "Message non trouvé" 
      })
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
