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

    // On s'assure que history est un tableau, même vide
const currentHistory = Array.isArray(message.reply_history) 
  ? message.reply_history 
  : []

const updatedHistory = [
  ...currentHistory,
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
            <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                
                <!-- En-tête élégant -->
                <div style="background: linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%); padding: 48px 32px; text-align: center;">
                  <img src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" alt="LamarqueTs" style="width: 100px; height: auto; border-radius: 12px; margin-bottom: 20px; border: 3px solid rgba(255,255,255,0.3); box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">LamarqueTs</h1>
                  <p style="color: #bae6fd; margin: 8px 0 0 0; font-size: 15px;">Services Psychosociaux</p>
                </div>
                
                <!-- Corps du message -->
                <div style="padding: 40px 32px;">
                  
                  <!-- Salutation chaleureuse -->
                  <p style="color: #1e293b; font-size: 17px; line-height: 1.6; margin: 0 0 24px 0;">
                    Bonjour <strong style="color: #0369a1;">${message.sender_name}</strong>,
                  </p>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 32px 0;">
                    Je vous remercie d'avoir pris le temps de me contacter. Voici ma réponse à votre message concernant <strong>${message.category}</strong>.
                  </p>
                  
                  <!-- Réponse personnalisée -->
                  <div style="background: #f0f9ff; border-left: 4px solid #0369a1; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                    <p style="color: #0c4a6e; font-size: 16px; line-height: 1.8; margin: 0; white-space: pre-wrap;">${reply}</p>
                  </div>

                  <!-- Rappel du message original (discret) -->
                  <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 32px; border: 1px solid #e2e8f0;">
                    <p style="color: #64748b; font-size: 13px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                      Votre message du ${new Date(message.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">"${message.message.substring(0, 150)}${message.message.length > 150 ? '...' : ''}"</p>
                  </div>
                  
                  <!-- Section engagement -->
                  <div style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
                    <p style="color: #0e7490; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
                      <strong>Des questions supplémentaires ?</strong><br>
                      N'hésitez pas à me répondre directement, il me fera plaisir de poursuivre la conversation avec vous.
                    </p>
                    <a href="mailto:${process.env.ADMIN_EMAIL || 'lamarquets@outlook.com'}" style="display: inline-block; background: linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 8px rgba(3, 105, 161, 0.3); transition: all 0.3s ease;">
                      Répondre à ce message
                    </a>
                  </div>

                  <!-- Message de clôture chaleureux -->
                  <p style="color: #475569; font-size: 15px; line-height: 1.7; margin: 0;">
                    Au plaisir d'échanger avec vous,
                  </p>
                  <p style="color: #0369a1; font-size: 16px; font-weight: 600; margin: 8px 0 0 0;">
                    Travailleur social
                  </p>
                  
                </div>
                
                <!-- Pied de page professionnel -->
                <div style="background: #f8fafc; padding: 32px; border-top: 1px solid #e2e8f0;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                    <tr>
                      <td style="text-align: center;">
                        <img src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" alt="LamarqueTs" style="width: 60px; height: auto; border-radius: 8px; margin-bottom: 12px; opacity: 0.8;">
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #0369a1; font-size: 15px; font-weight: 600; text-align: center; margin: 0 0 8px 0;">
                    LamarqueTs - Services Psychosociaux
                  </p>
                  
                  <p style="color: #64748b; font-size: 13px; text-align: center; margin: 0 0 16px 0; line-height: 1.6;">
                    Suivi individuel • Évaluation psychosociale • Groupes de soutien
                  </p>
                  
                  <p style="color: #0369a1; font-size: 13px; text-align: center; margin: 0 0 4px 0;">
                    <a href="${process.env.SITE_URL || 'https://lamarquets.com'}" style="color: #0369a1; text-decoration: none; font-weight: 500;">
                      ${process.env.SITE_URL || 'lamarquets.com'}
                    </a>
                  </p>
                  
                  <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 16px 0 0 0; font-style: italic;">
                    Des services simples pour vous aider
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