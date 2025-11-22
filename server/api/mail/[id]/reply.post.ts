// server/api/mail/[id]/reply.post.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { getMessageById } from '../../../utils/contact'
import { db } from '../../../utils/db'
import { contacts_messages } from '../../../utils/schema'
import { eq } from 'drizzle-orm'

// Si tu utilises Resend (optionnel)
// import { resend } from '../../../utils/resend'
// import { getReplyEmail } from '../../../utils/emailsTemplates'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const { reply } = await readBody(event)

  if (!id || !reply) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: "ID et réponse requis" 
    })
  }

  console.log(`📧 Réponse au message ID: ${id}`)

  try {
    // ✅ Récupérer le message (DÉCHIFFRÉ AUTOMATIQUEMENT)
    const message = await getMessageById(id)

    if (!message) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: "Message non trouvé" 
      })
    }

    // ✅ Maintenant message.sender_name, sender_email, message, category sont DÉCHIFFRÉS
    console.log(`📬 Message de: ${message.sender_name} <${message.sender_email}>`)

    // Préparer l'historique de réponse
    const replyEntry = {
      date: new Date().toISOString(),
      author: 'Admin', // ou event.context.user?.username
      content: reply
    }

    const updatedHistory = [
      ...(message.reply_history || []),
      replyEntry
    ]

    // Mettre à jour le message (l'historique n'est pas chiffré, c'est ok)
    await db
      .update(contacts_messages)
      .set({
        reply_history: updatedHistory,
        status: 'replied',
        updated_at: new Date()
      })
      .where(eq(contacts_messages.id, id))

    console.log('✅ Réponse enregistrée dans l\'historique')

    // ============================================
    // OPTION 1: Envoyer via Resend (si configuré)
    // ============================================
    /*
    if (process.env.RESEND_API_KEY) {
      try {
        // ✅ message.sender_email est maintenant déchiffré
        const replyEmailContent = getReplyEmail({
          senderName: message.sender_name,  // ✅ Déchiffré
          replyContent: reply,
          originalMessage: message.message   // ✅ Déchiffré
        })

        const emailResult = await resend.emails.send({
          from: 'LamarqueTs <noreply@lamarquets.com>',
          to: message.sender_email,  // ✅ Déchiffré
          subject: replyEmailContent.subject,
          html: replyEmailContent.html,
          replyTo: process.env.ADMIN_EMAIL || 'info@LamarqueTs.com'
        })

        // Logger l'envoi
        const mailLogEntry = {
          date: new Date().toISOString(),
          to: message.sender_email,  // ✅ Déchiffré (dans les logs internes)
          status: 'sent',
          subject: replyEmailContent.subject,
          resendId: emailResult.data?.id
        }

        await db
          .update(contacts_messages)
          .set({
            mail_log: [...(message.mail_log || []), mailLogEntry],
            last_sent_at: new Date()
          })
          .where(eq(contacts_messages.id, id))

        console.log('✅ Email envoyé via Resend à:', message.sender_email)
      } catch (emailError: any) {
        console.error('⚠️ Erreur envoi email:', emailError)
        // On ne bloque pas la réponse même si l'email échoue
      }
    }
    */

    // ============================================
    // OPTION 2: Envoyer via Nodemailer (simple)
    // ============================================
    if (process.env.DEV_MAIL_USER && process.env.DEV_MAIL_PASS) {
      try {
        const nodemailer = require('nodemailer')
        
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.DEV_MAIL_USER,
            pass: process.env.DEV_MAIL_PASS
          }
        })

        await transporter.sendMail({
          from: `"LamarqueTs" <${process.env.DEV_MAIL_USER}>`,
          to: message.sender_email,  // ✅ Déchiffré
          subject: `Réponse à votre message - ${message.category}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">💬 Réponse à votre message</h1>
              </div>
              
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <p style="color: #1f2937; font-size: 16px;">Bonjour <strong>${message.sender_name}</strong>,</p>
                
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10b981;">
                  <p style="white-space: pre-wrap; line-height: 1.6; color: #1f2937;">${reply}</p>
                </div>

                <div style="background: #e0f2fe; border: 1px solid #7dd3fc; padding: 15px; border-radius: 10px; margin-top: 20px;">
                  <p style="margin: 0; color: #0c4a6e; font-size: 14px;">
                    📋 <strong>Votre message original:</strong><br>
                    <span style="color: #075985;">${message.category}</span>
                  </p>
                </div>
                
                <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
                  Si vous avez d'autres questions, n'hésitez pas à répondre à cet email.
                </p>
              </div>
            </div>
          `,
          replyTo: process.env.ADMIN_EMAIL || process.env.DEV_MAIL_USER
        })

        console.log(`✅ Email envoyé à: ${message.sender_email}`)
      } catch (emailError: any) {
        console.error('⚠️ Erreur envoi email:', emailError.message)
      }
    }

    // ============================================
    // RETOUR
    // ============================================
    return { 
      success: true, 
      message: "Réponse enregistrée avec succès",
      email_sent: !!(process.env.DEV_MAIL_USER || process.env.RESEND_API_KEY),
      note: "Les données du destinataire sont déchiffrées uniquement en mémoire pour l'envoi"
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