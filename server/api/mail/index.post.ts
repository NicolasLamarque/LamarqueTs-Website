// server/api/mail/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { insertMessage } from '../../utils/contact'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { nom, email, telephone, sujet, message } = body

    console.log('📥 Nouveau message reçu:', { nom, email, sujet })

    // Validation
    if (!nom || !email || !message) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: "Nom, email et message sont requis" 
      })
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: "Format d'email invalide" 
      })
    }

    // Déterminer priorité automatiquement
    let priority = 'normal'
    const urgentKeywords = ['urgent', 'asap', 'immédiat', 'important', 'rapidement']
    const messageText = message.toLowerCase()
    
    if (urgentKeywords.some(k => messageText.includes(k)) || sujet === 'Urgence') {
      priority = 'high'
    }

    // Construire le message complet
    const fullMessage = [
      sujet ? `📋 Sujet: ${sujet}` : '',
      `\n💬 Message:\n${message}`,
      telephone ? `\n📞 Téléphone: ${telephone}` : ''
    ].filter(Boolean).join('\n')

    // 💾 Insérer dans la DB (chiffré automatiquement par insertMessage)
    console.log('💾 Enregistrement dans la base de données...')
    const newMessage = await insertMessage({
      sender_name: nom,
      sender_email: email,
      message: fullMessage,
      category: sujet || 'general',
      priority,
      status: 'new'
    })

    console.log('✅ Message enregistré avec ID:', newMessage.id)

    // ============================================
    // Nodemailer pour DEV uniquement (optionnel)
    // ============================================
    if (process.env.NODE_ENV !== 'production' && process.env.DEV_MAIL_USER) {
      try {
        console.log('📧 Envoi notification email dev...')
        
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.DEV_MAIL_USER,
            pass: process.env.DEV_MAIL_PASS
          }
        })

        await transporter.sendMail({
          from: `"Site Web Contact" <${process.env.DEV_MAIL_USER}>`,
          to: process.env.DEV_MAIL_RECEIVER || process.env.DEV_MAIL_USER,
          subject: `🔔 Nouveau message: ${sujet || 'Sans sujet'} - ${nom}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">📬 Nouveau Message</h1>
              </div>
              
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #0ea5e9;">
                  <h2 style="color: #1f2937; margin-top: 0;">📋 Informations</h2>
                  <p><strong>Nom:</strong> ${nom}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  ${telephone ? `<p><strong>Téléphone:</strong> ${telephone}</p>` : ''}
                  ${sujet ? `<p><strong>Sujet:</strong> ${sujet}</p>` : ''}
                  <p><strong>Priorité:</strong> <span style="background: ${priority === 'high' ? '#ef4444' : '#3b82f6'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${priority === 'high' ? '🔥 HAUTE' : '📌 NORMALE'}</span></p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #10b981;">
                  <h2 style="color: #1f2937; margin-top: 0;">💬 Message</h2>
                  <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                  <a href="mailto:${email}" style="background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    📧 Répondre par email
                  </a>
                </div>
                
                <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
                  Message reçu le ${new Date().toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          `,
          replyTo: email
        })

        console.log('✅ Email de notification envoyé')
      } catch (mailError: any) {
        console.error('⚠️ Erreur envoi mail dev:', mailError.message)
        // On ne bloque pas l'enregistrement si l'email échoue
      }
    }

    return {
      success: true,
      message: 'Message reçu et enregistré avec succès',
      id: newMessage.id,
      encrypted: true
    }

  } catch (error: any) {
    console.error('💥 Erreur endpoint mail:', error)
    
    // Si c'est une erreur déjà formatée, on la relance
    if (error.statusCode) {
      throw error
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: error.message || "Erreur serveur interne" 
    })
  }
})