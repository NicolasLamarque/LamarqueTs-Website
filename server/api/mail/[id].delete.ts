// ============================================
// 📁 server/api/mail/[id].delete.ts
// Supprimer un message (soft ou hard delete)
// ============================================
import { defineEventHandler, getRouterParam, getQuery, createError } from 'h3'
import { softDeleteMessage, hardDeleteMessage } from '../../utils/contact'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const query = getQuery(event)
  const hardDelete = query.hard === 'true'
  
  if (!id || isNaN(id)) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: "ID invalide" 
    })
  }

  console.log(`🗑️ Suppression message ID: ${id} (hard: ${hardDelete})`)
  
  try {
    let success: boolean
    
    if (hardDelete) {
      // Suppression définitive (⚠️ DANGEREUX - les données chiffrées seront perdues)
      success = await hardDeleteMessage(id)
      console.log('✅ Message supprimé définitivement')
    } else {
      // Soft delete (recommandé - garde les données chiffrées)
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