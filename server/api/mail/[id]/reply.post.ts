// server/api/mail/[id]/reply.post.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { db } from '../../../utils/db'  // ✅ Bon chemin (3 niveaux)
import { contacts_messages } from '../../../utils/schema'  // ✅ Bon chemin
import { eq } from 'drizzle-orm'
import { decrypt } from '../../../utils/crypto'  // ✅ Bon chemin

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
    // Récupérer le message original
    const [message] = await db
      .select()
      .from(contacts_messages)
      .where(eq(contacts_messages.id, id))
      .limit(1)

    if (!message) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: "Message non trouvé" 
      })
    }

    // Décrypter le message original si nécessaire
    const originalMessage = message.encrypted 
      ? decrypt(message.message) 
      : message.message

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

    // Mettre à jour le message
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
        const replyEmailContent = getReplyEmail({
          senderName: message.sender_name,
          replyContent: reply,
          originalMessage
        })

        const emailResult = await resend.emails.send({
          from: 'LamarqueTs <noreply@lamarquets.com>',
          to: message.sender_email,
          subject: replyEmailContent.subject,
          html: replyEmailContent.html,
          replyTo: process.env.ADMIN_EMAIL || 'info@LamarqueTs.com'
        })

        // Logger l'envoi
        const mailLogEntry = {
          date: new Date().toISOString(),
          to: message.sender_email,
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

        console.log('✅ Email envoyé via Resend')
      } catch (emailError: any) {
        console.error('⚠️ Erreur envoi email:', emailError)
        // On ne bloque pas la réponse même si l'email échoue
      }
    }
    */

    // ============================================
    // OPTION 2: Retourner simplement la confirmation
    // ============================================
    return { 
      success: true, 
      message: "Réponse enregistrée avec succès",
      note: "L'email sera envoyé manuellement ou via un service tiers"
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