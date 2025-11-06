// ============================================
// server/api/contact.post.ts
// Version corrigée avec gestion d'erreurs détaillée
// ============================================
import { defineEventHandler, readBody, createError } from 'h3'
import { insertMessage } from '../../utils/contact'

export default defineEventHandler(async (event) => {
  console.log('📨 Réception d\'un message de contact...')
  
  try {
    const body = await readBody(event)
    console.log('📦 Body reçu:', { ...body, message: body.message?.substring(0, 50) + '...' })
    
    const { nom, email, telephone, sujet, message } = body

    // Validation
    if (!nom || !email || !message) {
      console.error('❌ Champs manquants:', { nom: !!nom, email: !!email, message: !!message })
      throw createError({ 
        statusCode: 400, 
        statusMessage: "Nom, email et message sont requis" 
      })
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('❌ Email invalide:', email)
      throw createError({ 
        statusCode: 400, 
        statusMessage: "Format d'email invalide" 
      })
    }

    // Déterminer la priorité automatiquement
    let priority = 'normal'
    const urgentKeywords = ['urgent', 'asap', 'rapidement', 'immédiat', 'important']
    if (urgentKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      priority = 'high'
      console.log('⚡ Message marqué comme prioritaire')
    }

    // Construire le message complet
    const fullMessage = [
      sujet ? `Sujet: ${sujet}` : '',
      message,
      telephone ? `\n\nTéléphone: ${telephone}` : ''
    ].filter(Boolean).join('\n')

    console.log('💾 Insertion dans la base de données...')
    
    // Insérer le message (crypté automatiquement)
    const newMessage = await insertMessage({
      sender_name: nom,
      sender_email: email,
      message: fullMessage,
      category: sujet || 'general',
      priority,
      status: 'new'
    })

    console.log('✅ Message inséré avec ID:', newMessage.id)

    // OPTIONNEL: Envoi d'email avec Resend
    // Décommentez si Resend est configuré
    /*
    try {
      const { resend } = await import('../utils/resend')
      const { getAdminNotificationEmail } = await import('../utils/emailTemplates')
      
      const adminEmail = getAdminNotificationEmail({
        nom,
        email,
        telephone,
        sujet,
        priority,
        messageId: newMessage.id
      })

      await resend.emails.send({
        from: 'LamarqueTs <noreply@lamarquets.com>',
        to: process.env.ADMIN_EMAIL || 'info@LamarqueTs.com',
        subject: adminEmail.subject,
        html: adminEmail.html
      })
      
      console.log('📧 Email de notification envoyé')
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email (non bloquant):', emailError)
      // On ne bloque pas si l'email échoue
    }
    */

    return { 
      success: true,
      statusCode: 200, 
      message: "Message reçu et sécurisé avec succès",
      id: newMessage.id
    }

  } catch (error: any) {
    console.error('💥 Erreur complète:', error)
    
    // Si c'est déjà une erreur H3, on la relance
    if (error.statusCode) {
      throw error
    }
    
    // Erreur de base de données
    if (error.code) {
      console.error('🗄️ Erreur DB:', error.code, error.message)
      throw createError({ 
        statusCode: 500, 
        statusMessage: `Erreur base de données: ${error.message}` 
      })
    }
    
    // Erreur générique
    throw createError({ 
      statusCode: 500, 
      statusMessage: error.message || "Erreur lors du traitement du message" 
    })
  }
})
