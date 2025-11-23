// ============================================
// 📁 server/api/mail/[id]/reply.post.ts
// ✅ CORRIGÉ POUR PROD
// ============================================
import { defineEventHandler, readBody, createError } from 'h3'
import { getMessageById } from '../../../utils/contact'
import { db } from '../../../utils/db'
import { contacts_messages } from '../../../utils/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // ✅ CORRECTION : Utiliser event.context.params
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

  console.log(`📧 Réponse au message ID: ${id}`)

  try {
    // Récupérer le message (DÉCHIFFRÉ AUTOMATIQUEMENT)
    const message = await getMessageById(id)

    if (!message) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: "Message non trouvé" 
      })
    }

    console.log(`📬 Message de: ${message.sender_name} <${message.sender_email}>`)

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

    console.log('✅ Réponse enregistrée dans l\'historique')

    // Envoi email (si configuré)
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
          to: message.sender_email,
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

        console.log(`✅ Email envoyé à : ${message.sender_email}`)
      } catch (emailError: any) {
        console.error('⚠️ Erreur envoi email:', emailError.message)
      }
    }

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