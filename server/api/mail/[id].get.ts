// ============================================
// server/api/contact/messages/[id].get.ts
// Récupérer un message par ID (décrypté)
// ============================================
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getMessageById } from '../../utils/contact'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')
  
  if (!id || isNaN(id)) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: "ID invalide" 
    })
  }

  console.log(`📬 Récupération message ID: ${id}`)
  
  try {
    const message = await getMessageById(id)
    
    if (!message) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: "Message non trouvé" 
      })
    }
    
    console.log('✅ Message récupéré et décrypté')
    
    // Le message est déjà décrypté par getMessageById()
    return message
    
  } catch (error: any) {
    console.error('❌ Erreur récupération message:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur: ${error.message}` 
    })
  }
})