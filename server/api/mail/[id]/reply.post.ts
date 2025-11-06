// ============================================
// server/api/contact/messages/[id]/reply.post.ts
// Répondre avec Resend
// ============================================
import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { db } from '../../../utils/db'
import { contacts_messages } from '../../../utils/schema'
import { eq } from 'drizzle-orm'
import { resend } from '../../../utils/resend'
import { getReplyEmail } from '../../../utils/emailsTemplates'
import { decrypt } from '../../../utils/crypto'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0')
  const { reply } = await readBody(event)

  if (!id || !reply) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: "ID et réponse requis" 
    })
  }

  try {
    // Récupérer le message original
    const [message] = await db
      .select()
      .from(contacts_messages)
      .where(eq(contacts_messages.id, id))
      .limit(1)

    if (!message) {
      throw createError({ statusCode: 404, statusMessage: "Message non trouvé" })
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

    // Envoyer la réponse via Resend
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

    return { 
      success: true, 
      message: "Réponse envoyée avec succès",
      emailId: emailResult.data?.id
    }
  } catch (error: any) {
    console.error('Erreur envoi réponse:', error)
    
    if (error.name === 'ResendError') {
      throw createError({ 
        statusCode: 500, 
        statusMessage: `Erreur Resend: ${error.message}` 
      })
    }
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: "Erreur lors de l'envoi de la réponse" 
    })
  }
})