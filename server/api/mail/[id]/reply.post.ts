// server/api/mail/[id]/reply.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { getMessageById } from '../../../utils/contact'
import { db } from '../../../utils/db'
import { contacts_messages } from '../../../utils/schema'
import { eq } from 'drizzle-orm'
import { resend } from '../../../utils/resend'

export default defineEventHandler(async (event) => {
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

  const { reply } = await readBody(event)

  if (!reply) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: "Réponse requise" 
    })
  }

  //console.log(`📧 Réponse au message ID: ${id}`)

  try {
    // Récupérer le message (DÉCHIFFRÉ AUTOMATIQUEMENT)
    const message = await getMessageById(id)

    if (!message) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: "Message non trouvé" 
      })
    }

    if (message.deleted) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: "Impossible de répondre à un message supprimé" 
      })
    }

    //console.log(`📬 Message de: ${message.sender_name} <${message.sender_email}>`)

    // Préparer l'historique de réponse
    const replyEntry = {
      date: new Date().toISOString(),
      author: 'Admin',
      content: reply
    }

    const updatedHistory = [
      ...(message.reply_history || []),
      replyEntry
    ]

    // Mettre à jour le message
    await db
      .update(contacts_messages)
      .set({
        reply_history: updatedHistory,
        status: 'replied',
        updated_at: new Date()
      })
      .where(eq(contacts_messages.id, id))

    //console.log('✅ Réponse enregistrée dans l\'historique')

    // ============================================
    // 📧 ENVOI EMAIL via RESEND
    // ============================================
    let emailSent = false
    
    if (process.env.RESEND_API_KEY) {
      try {
        //console.log(`📧 Envoi de la réponse à ${message.sender_email}...`)
        
        const emailResult = await resend.emails.send({
          from: `LamarqueTs <${process.env.RESEND_FROM_EMAIL || 'infos@lamarquets.com'}>`,
          to: message.sender_email,
          replyTo: process.env.ADMIN_EMAIL || 'lamarquets@outlook.com',
          subject: `Réponse à votre message - ${message.category}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f0f9ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="max-width: 650px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(7, 89, 133, 0.15);">
                
                <!-- Header avec logo -->
                <div style="background: linear-gradient(135deg, #0369a1 0%, #075985 100%); padding: 50px 40px; text-align: center; position: relative;">
                  <img src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" alt="LamarqueTs" style="width: 120px; height: auto; border-radius: 12px; margin-bottom: 24px; border: 4px solid rgba(255,255,255,0.2); box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                  <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Réponse à votre message</h1>
                  <div style="width: 60px; height: 4px; background: #14b8a6; margin: 16px auto 0; border-radius: 2px;"></div>
                </div>
                
                <!-- Contenu -->
                <div style="padding: 45px 40px;">
                  
                  <!-- Salutation -->
                  <p style="color: #1e293b; font-size: 18px; line-height: 1.6; margin: 0 0 32px 0; font-weight: 500;">
                    Bonjour <strong style="color: #0369a1;">${message.sender_name}</strong>,
                  </p>
                  
                  <!-- Réponse -->
                  <div style="background: white; border: 2px solid #14b8a6; border-left: 5px solid #14b8a6; border-radius: 16px; padding: 28px; margin-bottom: 28px; box-shadow: 0 2px 8px rgba(20, 184, 166, 0.12);">
                    <h2 style="color: #115e59; margin: 0 0 20px 0; font-size: 20px; font-weight: 700; display: flex; align-items: center;">
                      <span style="margin-right: 12px; font-size: 24px;">📝</span>
                      Ma réponse
                    </h2>
                    <p style="white-space: pre-wrap; line-height: 1.8; color: #1e293b; margin: 0; font-size: 16px;">${reply}</p>
                  </div>

                  <!-- Message original -->
                  <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 16px; padding: 24px; margin-bottom: 28px; border: 1px solid #bae6fd;">
                    <h3 style="color: #0c4a6e; margin: 0 0 16px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700;">
                      📋 Votre message original
                    </h3>
                    <p style="color: #075985; font-size: 15px; margin: 0 0 10px 0; font-weight: 600;">
                      <strong>Sujet:</strong> ${message.category}
                    </p>
                    <p style="color: #0c4a6e; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message.message.substring(0, 200)}${message.message.length > 200 ? '...' : ''}</p>
                  </div>
                  
                  <!-- CTA -->
                  <div style="background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%); border-radius: 16px; padding: 28px; text-align: center; border: 2px solid #5eead4;">
                    <p style="color: #115e59; font-size: 16px; margin: 0 0 20px 0; font-weight: 600;">
                      💡 <strong>Besoin d'informations supplémentaires ?</strong>
                    </p>
                    <a href="mailto:${process.env.ADMIN_EMAIL || 'lamarquets@outlook.com'}" style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #075985 100%); color: white; padding: 16px 36px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(3, 105, 161, 0.3);">
                      📧 Répondre à cet email
                    </a>
                  </div>
                  
                </div>
                
                <!-- Footer -->
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 32px 40px; border-top: 3px solid #14b8a6; text-align: center;">
                  <img src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" alt="LamarqueTs" style="width: 80px; height: auto; border-radius: 8px; margin-bottom: 16px; opacity: 0.9;">
                  <p style="color: #0c4a6e; font-size: 14px; margin: 0 0 10px 0; font-weight: 500;">
                    Vous recevez cet email en réponse à votre message du ${new Date(message.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p style="color: #0369a1; font-size: 13px; margin: 0 0 8px 0; font-weight: 600;">
                    LamarqueTs
                  </p>
                  <p style="color: #0c4a6e; font-size: 12px; margin: 0;">
                    ${process.env.SITE_URL || 'https://lamarquets.com'}
                  </p>
                </div>
                
              </div>
            </body>
            </html>
          `
        })

        console.log(`✅ Email envoyé via Resend: ${emailResult.data?.id}`)
        emailSent = true
        
      } catch (emailError: any) {
        console.error('⚠️ Erreur envoi email:', emailError.message)
        console.error('Détails:', emailError)
        
        // Si l'erreur concerne le domaine non vérifié
        if (emailError.message?.includes('domain') || emailError.message?.includes('verified')) {
          throw createError({
            statusCode: 500,
            statusMessage: "Domaine email non vérifié sur Resend. Veuillez configurer vos DNS."
          })
        }
      }
    } else {
      console.log('⚠️ RESEND_API_KEY non configurée')
    }

    return { 
      success: true, 
      message: emailSent 
        ? "Réponse envoyée avec succès par email" 
        : "Réponse enregistrée (email non configuré)",
      email_sent: emailSent,
      recipient: message.sender_email
    }

  } catch (error: any) {
    console.error('❌ Erreur envoi réponse:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur: ${error.message}` 
    })
  }
})