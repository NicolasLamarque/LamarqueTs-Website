// ============================================
// 📁 server/api/mail/[id].get.ts
// ✅ CORRIGÉ POUR PROD
// ============================================
import { defineEventHandler, createError } from 'h3'
import { getMessageById } from '../../utils/contact'

export default defineEventHandler(async (event) => {
  // ✅ CORRECTION : Utiliser event.context.params
  const id = event.context.params?.id
  
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID manquant' })
  }

  console.log(`📬 Récupération message #${id}...`)
  
  try {
    const message = await getMessageById(parseInt(id))
    
    if (!message) {
      throw createError({ statusCode: 404, statusMessage: 'Message introuvable' })
    }

    console.log(`✅ Message #${id} récupéré et déchiffré`)
    return message
    
  } catch (error: any) {
    console.error(`❌ Erreur récupération message #${id}:`, error)
    
    if (error.message.includes('déchiffrer')) {
      throw createError({ 
        statusCode: 500, 
        statusMessage: 'Erreur de déchiffrement. Vérifiez votre clé ENCRYPTION_KEY.' 
      })
    }
    
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || `Erreur: ${error.message}` 
    })
  }
})