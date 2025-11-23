// ============================================
// 📁 server/api/mail/index.get.ts
// Récupérer TOUS les messages (déchiffrés automatiquement)
// ============================================
import { defineEventHandler, createError } from 'h3'
import { getAllMessages } from '../../utils/contact'

export default defineEventHandler(async (event) => {
  console.log('📬 Récupération de tous les messages...')
   // 🧪 DIAGNOSTIC
  console.log('🔑 ENCRYPTION_KEY existe:', !!process.env.ENCRYPTION_KEY)
  console.log('🔑 Valeur:', process.env.ENCRYPTION_KEY?.substring(0, 10))
  
  try {
    // ✅ getAllMessages() déchiffre TOUT automatiquement :
    // - sender_name
    // - sender_email  
    // - message
    // - category
    const messages = await getAllMessages()
    
    console.log(`✅ ${messages.length} messages récupérés et déchiffrés`)
    
    return messages
    
  } catch (error: any) {
    console.error('❌ Erreur récupération messages:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur: ${error.message}` 
    })
  }
})
