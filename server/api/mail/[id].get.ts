// ============================================
// 📁 server/api/mail/[id].get.ts
// Récupérer UN message par ID (déchiffré automatiquement)
// ============================================
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { getMessageById } from '../../utils/contact'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID manquant' })
  }

  console.log(`📬 Récupération message #${id}...`)
  
  try {
    // ✅ getMessageById() déchiffre TOUT automatiquement :
    // - sender_name
    // - sender_email
    // - message  
    // - category
    const message = await getMessageById(parseInt(id))
    
    if (!message) {
      throw createError({ statusCode: 404, statusMessage: 'Message introuvable' })
    }

    console.log(`✅ Message #${id} récupéré et déchiffré`)
    return message
    
  } catch (error: any) {
    console.error(`❌ Erreur récupération message #${id}:`, error)
    
    // Si c'est une erreur de déchiffrement
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