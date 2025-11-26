// server/api/mail/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { insertMessage } from '../../utils/contact'
import { resend } from '../../utils/resend'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { nom, email, telephone, sujet, message } = body

    //console.log('📥 Nouveau message reçu:', { nom, email, sujet })

    // ============================================
    // VALIDATION
    // ============================================
    if (!nom || !email || !message) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: "Nom, email et message sont requis" 
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: "Format d'email invalide" 
      })
    }

    // ============================================
    // DÉTERMINER PRIORITÉ
    // ============================================
    let priority = 'normal'
    const urgentKeywords = ['urgent', 'asap', 'immédiat', 'important', 'rapidement']
    const messageText = message.toLowerCase()
    
    if (urgentKeywords.some(k => messageText.includes(k)) || sujet === 'Urgence') {
      priority = 'high'
    }

    // ============================================
    // CONSTRUIRE LE MESSAGE COMPLET
    // ============================================
    const fullMessage = [
      sujet ? `📋 Sujet: ${sujet}` : '',
      `\n💬 Message:\n${message}`,
      telephone ? `\n📞 Téléphone: ${telephone}` : ''
    ].filter(Boolean).join('\n')

    // ============================================
    // 🔐 INSÉRER EN DB (TOUT SERA CHIFFRÉ)
    // ============================================
    console.log('🔐 Chiffrement et enregistrement en DB...')
    
    const newMessage = await insertMessage({
      sender_name: nom,
      sender_email: email,
      message: fullMessage,
      category: sujet || 'general',
      priority,
      status: 'new'
    })

    console.log(`✅ Message #${newMessage.id} enregistré (TOUT chiffré en DB)`)

    // ============================================
    // 📧 NOTIFICATION EMAIL via RESEND
    // ============================================
    if (process.env.RESEND_API_KEY) {
      try {
        console.log('📧 Envoi notification via Resend...')
        
        const emailResult = await resend.emails.send({
          // ✅ Utilise ton domaine vérifié
          from: `LamarqueTs Contact <${process.env.RESEND_FROM_EMAIL || 'infos@lamarquets.com'}>`,
          
          // Email de destination (ton Outlook)
          to: process.env.ADMIN_EMAIL || 'lamarquets@outlook.com',
          
          // Le client pourra répondre directement
          replyTo: email,
          
          subject: `📢 Nouveau message: ${sujet || 'Sans sujet'} - ${nom}`,
          
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                  <div style="background: rgba(255,255,255,0.15); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 40px;">📬</span>
                  </div>
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Nouveau Message</h1>
                  <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 14px;">Message chiffré en base de données</p>
                </div>
                
                <!-- Contenu -->
                <div style="padding: 40px 30px;">
                  
                  <!-- Badge Priorité -->
                  ${priority === 'high' ? `
                  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
                    <span style="font-size: 24px;">🔥</span>
                    <strong style="color: #dc2626; font-size: 16px; display: block; margin-top: 8px;">MESSAGE PRIORITAIRE</strong>
                  </div>
                  ` : ''}
                  
                  <!-- Infos Expéditeur -->
                  <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center;">
                      <span style="margin-right: 10px;">👤</span>
                      Informations du contact
                    </h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">
                          <strong>Nom:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${nom}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Email:</strong>
                        </td>
                        <td style="padding: 8px 0;">
                          <a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none; font-size: 14px;">${email}</a>
                        </td>
                      </tr>
                      ${telephone ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Téléphone:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${telephone}
                        </td>
                      </tr>
                      ` : ''}
                      ${sujet ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          <strong>Sujet:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                          ${sujet}
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>
                  
                  <!-- Message -->
                  <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                    <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; display: flex; align-items: center;">
                      <span style="margin-right: 10px;">💬</span>
                      Message
                    </h2>
                    <p style="white-space: pre-wrap; line-height: 1.8; color: #374151; margin: 0; font-size: 15px;">${message}</p>
                  </div>

                  <!-- Sécurité -->
                  <div style="background: #dcfce7; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <div style="display: flex; align-items: start;">
                      <span style="font-size: 24px; margin-right: 12px;">🔐</span>
                      <div>
                        <strong style="color: #15803d; font-size: 15px; display: block; margin-bottom: 6px;">Sécurité maximale</strong>
                        <p style="margin: 0; color: #166534; font-size: 13px; line-height: 1.6;">
                          Ce message est chiffré (AES-256-GCM) en base de données.<br>
                          Seul le serveur peut le déchiffrer avec la clé privée.<br>
                          <strong>ID: #${newMessage.id}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Boutons d'action -->
                  <div style="text-align: center; margin-top: 32px;">
                    <a href="mailto:${email}" style="display: inline-block; background: #0ea5e9; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 0 8px;">
                      📧 Répondre par email
                    </a>
                    <a href="${process.env.SITE_URL || 'https://lamarquets.com'}/dashboard/messages" style="display: inline-block; background: #f3f4f6; color: #1f2937; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 0 8px;">
                      🎛️ Voir dans le Dashboard
                    </a>
                  </div>
                  
                </div>
                
                <!-- Footer -->
                <div style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
                    Message reçu le ${new Date().toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    LamarqueTs - Système de contact sécurisé
                  </p>
                </div>
                
              </div>
            </body>
            </html>
          `
        })

        console.log('✅ Email envoyé via Resend:', emailResult.data?.id)
        
      } catch (mailError: any) {
        console.error('⚠️ Erreur envoi mail Resend:', mailError.message)
        console.error('Détails:', mailError)
        // On ne bloque pas l'enregistrement si l'email échoue
      }
    } else {
      console.log('⚠️ RESEND_API_KEY non configurée, email non envoyé')
    }

    // ============================================
    // RETOUR CLIENT
    // ============================================
    return {
      success: true,
      message: 'Message reçu et sécurisé avec succès',
      id: newMessage.id,
      encrypted: true,
      encryption_algo: 'aes-256-gcm',
      note: 'Toutes vos données sont chiffrées en base de données'
    }

  } catch (error: any) {
    console.error('💥 Erreur endpoint mail:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: error.message || "Erreur serveur interne" 
    })
  }
})