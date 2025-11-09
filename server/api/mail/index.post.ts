// server/api/contact/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { insertMessage } from '../../utils/contact'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { nom, email, telephone, sujet, message } = body

    // Validation minimale
    if (!nom || !email || !message) {
      throw createError({ statusCode: 400, statusMessage: "Nom, email et message sont requis" })
    }

    // Déterminer priorité
    let priority = 'normal'
    const urgentKeywords = ['urgent', 'asap', 'immédiat', 'important']
    if (urgentKeywords.some(k => message.toLowerCase().includes(k))) priority = 'high'

    // Construire message complet
    const fullMessage = [
      sujet ? `Sujet: ${sujet}` : '',
      message,
      telephone ? `\nTéléphone: ${telephone}` : ''
    ].filter(Boolean).join('\n')

    // 💾 Insérer dans la DB
    const newMessage = await insertMessage({
      sender_name: nom,
      sender_email: email,
      message: fullMessage,
      category: sujet || 'general',
      priority,
      status: 'new'
    })

    console.log('✅ Message inséré avec ID:', newMessage.id)

    // ============================================
    // Nodemailer pour DEV
    // ============================================
    // ⚠️ Supprimer/commenter cette section en production
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail", // ou "Outlook"
        auth: {
          user: process.env.DEV_MAIL_USER,    // ton compte Gmail/Outlook pour test
          pass: process.env.DEV_MAIL_PASS     // mot de passe ou token d'app
        }
      })

      await transporter.sendMail({
        from: `"Formulaire Contact" <${process.env.DEV_MAIL_USER}>`,
        to: process.env.DEV_MAIL_RECEIVER,   // où tu veux recevoir les mails en test
        subject: `📬 Nouveau message: ${sujet || 'Sans sujet'}`,
        text: fullMessage,
        replyTo: email // permet de répondre directement au visiteur/testeur
      })

      console.log('📧 Mail envoyé via Nodemailer (dev)')
    } catch (mailError) {
      console.error('⚠️ Erreur envoi mail dev:', mailError)
    }

    return {
      success: true,
      message: 'Message reçu et enregistré',
      id: newMessage.id
    }

  } catch (error: any) {
    console.error('💥 Erreur endpoint contact:', error)
    throw createError({ statusCode: error.statusCode || 500, statusMessage: error.message || "Erreur serveur" })
  }
})
