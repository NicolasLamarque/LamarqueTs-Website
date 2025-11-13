// ============================================
// server/api/contact/messages.get.ts
// Récupérer tous les messages (décryptés côté serveur)
// ============================================
// server/api/mail/index.get.ts
import { defineEventHandler, createError } from 'h3'
import { getAllMessages } from '../../utils/contact'

export default defineEventHandler(async (event) => {
  console.log('📬 Récupération de tous les messages...')
  
  try {
    const messages = await getAllMessages()
    
    console.log(`✅ ${messages.length} messages récupérés`)
    
    // Les messages sont déjà décryptés par getAllMessages()
    return messages
    
  } catch (error: any) {
    console.error('❌ Erreur récupération messages:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur: ${error.message}` 
    })
  }
})