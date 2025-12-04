// server/api/mail/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { insertMessage } from '../../utils/contact'
import { resend } from '../../utils/resend'

/**
 * 🧠 Système intelligent de personnalisation des emails
 */
function getSmartEmailContent(nom: string, sujet: string, message: string) {
  const msgLower = message.toLowerCase()
  
  const urgentKeywords = ['urgent', 'asap', 'immédiat', 'rapidement', 'vite', 'pressant', 'critique']
  const isUrgent = urgentKeywords.some(k => msgLower.includes(k))
  
  const crisisKeywords = ['détresse', 'angoisse', 'panique', 'désespoir', 'suicide', 'mourir', 'danger']
  const isCrisis = crisisKeywords.some(k => msgLower.includes(k))
  
  const subjectConfig: Record<string, any> = {
    'accompagnement': {
      emoji: '🤝',
      title: 'Demande d\'accompagnement individuel',
      intro: 'Je comprends votre besoin d\'accompagnement personnalisé.',
      timeframe: 'dans un délai de 48 heures',
      additionalInfo: 'L\'accompagnement individuel permet un suivi personnalisé adapté à votre situation unique. Nous pourrons discuter ensemble de vos besoins et établir un plan d\'intervention qui vous convient.',
      callToAction: 'Préparez-vous à discuter de vos objectifs et de ce que vous aimeriez accomplir grâce à cet accompagnement.'
    },
    'mandat': {
      emoji: '📋',
      title: 'Homologation de mandat',
      intro: 'Votre demande concernant l\'homologation de mandat est bien notée.',
      timeframe: 'dans un délai de 48 heures',
      additionalInfo: 'L\'homologation d\'un mandat de protection est une démarche importante qui nécessite une évaluation psychosociale complète. Je vous accompagnerai dans toutes les étapes de ce processus.',
      callToAction: 'Rassemblez les documents pertinents concernant la situation (documents médicaux, mandat notarié, etc.).'
    },
    'groupe': {
      emoji: '👥',
      title: 'Groupes thérapeutiques',
      intro: 'Les groupes thérapeutiques sont une excellente approche pour le soutien mutuel.',
      timeframe: 'dans un délai de 48 heures',
      additionalInfo: 'Nos groupes thérapeutiques offrent un espace sécuritaire pour partager, apprendre et grandir avec d\'autres personnes vivant des situations similaires. Je vous informerai des prochaines sessions disponibles.',
      callToAction: 'Réfléchissez aux thématiques qui vous intéressent particulièrement pour notre prochaine discussion.'
    },
    'information': {
      emoji: 'ℹ️',
      title: 'Demande d\'information',
      intro: 'Je serai heureux de répondre à vos questions.',
      timeframe: 'dans un délai de 48 heures',
      additionalInfo: 'N\'hésitez pas à poser toutes vos questions. Mon rôle est de vous fournir des informations claires sur les services disponibles et de vous orienter vers les ressources appropriées.',
      callToAction: 'Si vous avez d\'autres questions d\'ici là, n\'hésitez pas à m\'écrire à nouveau.'
    },
    'autre': {
      emoji: '💬',
      title: 'Votre demande',
      intro: 'J\'ai bien pris connaissance de votre message.',
      timeframe: 'dans un délai de 48 heures',
      additionalInfo: 'Chaque situation est unique et mérite une attention particulière. Je prendrai le temps nécessaire pour bien comprendre votre demande et y répondre de manière appropriée.',
      callToAction: 'Je reviendrai vers vous rapidement pour discuter de la meilleure façon de vous aider.'
    }
  }

  const config = subjectConfig[sujet] || subjectConfig['autre']

  if (isUrgent) {
    config.timeframe = 'dans un délai de 48 heures'
    config.intro = '⚡ ' + config.intro + ' Je comprends l\'urgence de votre situation.'
  }

  const crisisBlock = isCrisis ? `
    <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
      <div style="display: flex; align-items: start;">
        <span style="font-size: 28px; margin-right: 12px;">🆘</span>
        <div>
          <strong style="color: #991b1b; font-size: 16px; display: block; margin-bottom: 8px;">Besoin d'aide immédiate ?</strong>
          <p style="margin: 0 0 12px 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
            Si vous êtes en détresse ou en situation de crise, contactez immédiatement :
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 13px; line-height: 1.8;">
            <li><strong>Services d'urgence:</strong> 911</li>
            <li><strong>Prévention suicide:</strong> 1-866-APPELLE (1-866-277-3553)</li>
            <li><strong>Info-Social:</strong> 811</li>
            <li><strong>Jeunesse J'écoute:</strong> 1-800-668-6868</li>
          </ul>
        </div>
      </div>
    </div>
  ` : ''

  const urgentBadge = isUrgent ? `
    <div style="background: #fef2f2; border-left: 4px solid #fb7185; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center;">
        <span style="font-size: 24px; margin-right: 12px;">⚡</span>
        <div>
          <strong style="color: #be123c; font-size: 15px;">Message prioritaire</strong>
          <p style="margin: 4px 0 0 0; color: #be123c; font-size: 13px;">
            Votre demande sera traitée en priorité. Je reviendrai vers vous ${config.timeframe}.
          </p>
        </div>
      </div>
    </div>
  ` : ''

  return { config, crisisBlock, urgentBadge, isUrgent, isCrisis }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { nom, email, telephone, sujet, message } = body

    if (!nom || !email || !message) {
      throw createError({ statusCode: 400, statusMessage: "Nom, email et message sont requis" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({ statusCode: 400, statusMessage: "Format d'email invalide" })
    }

    let priority = 'normal'
    const urgentKeywords = ['urgent', 'asap', 'immédiat', 'important', 'rapidement']
    const messageText = message.toLowerCase()
    
    if (urgentKeywords.some(k => messageText.includes(k)) || sujet === 'Urgence') {
      priority = 'high'
    }

    const fullMessage = [
      sujet ? `📋 Sujet: ${sujet}` : '',
      `\n💬 Message:\n${message}`,
      telephone ? `\n📞 Téléphone: ${telephone}` : ''
    ].filter(Boolean).join('\n')

    console.log('🔐 Chiffrement et enregistrement en DB...')
    
    const newMessage = await insertMessage({
      sender_name: nom,
      sender_email: email,
      message: fullMessage,
      category: sujet || 'general',
      priority,
      status: 'new'
    })

    console.log(`✅ Message #${newMessage.id} enregistré`)

    if (process.env.RESEND_API_KEY) {
      try {
        // ========================================
        // 1️⃣ EMAIL DE NOTIFICATION À L'ADMIN
        // ========================================
        console.log('📧 Envoi notification admin...')
        
        await resend.emails.send({
          from: `LamarqueTs Contact <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
          to: process.env.ADMIN_EMAIL || 'lamarquets@outlook.com',
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
                
                <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                  <div style="background: rgba(255,255,255,0.15); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 40px;">📬</span>
                  </div>
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Nouveau Message</h1>
                  <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 14px;">Message chiffré en base de données</p>
                </div>
                
                <div style="padding: 40px 30px;">
                  
                  ${priority === 'high' ? `
                  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
                    <span style="font-size: 24px;">🔥</span>
                    <strong style="color: #dc2626; font-size: 16px; display: block; margin-top: 8px;">MESSAGE PRIORITAIRE</strong>
                  </div>
                  ` : ''}
                  
                  <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px;">
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
                  
                  <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                    <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px;">
                      <span style="margin-right: 10px;">💬</span>
                      Message
                    </h2>
                    <p style="white-space: pre-wrap; line-height: 1.8; color: #374151; margin: 0; font-size: 15px;">${message}</p>
                  </div>

                  <div style="background: #dcfce7; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <div style="display: flex; align-items: start;">
                      <span style="font-size: 24px; margin-right: 12px;">🔒</span>
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
                  
                  <div style="text-align: center; margin-top: 32px;">
                    <a href="mailto:${email}" style="display: inline-block; background: #0ea5e9; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 0 8px;">
                      📧 Répondre par email
                    </a>
                    <a href="https://lamarquets.com/dashboard/messages" style="display: inline-block; background: #f3f4f6; color: #1f2937; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 0 8px;">
                      🎛️ Voir dans le Dashboard
                    </a>
                  </div>
                  
                </div>
                
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

        console.log('✅ Email admin envoyé')

        // ========================================
        // 2️⃣ EMAIL INTELLIGENT AU CLIENT
        // ========================================
        console.log('📧 Envoi confirmation intelligente au client...')
        const smartContent = getSmartEmailContent(nom, sujet, message)
        
        await resend.emails.send({
          from: `LamarqueTs <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
          to: email,
          subject: `${smartContent.isUrgent ? '⚡ ' : ''}Message bien reçu - LamarqueTs Services Psychosociaux`,
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <div style="background: linear-gradient(135deg, ${smartContent.isUrgent ? '#fce7f3 0%, #fbcfe8' : '#e0f2fe 0%, #bae6fd'} 100%); padding: 40px 30px; text-align: center;">
                  <img src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" alt="LamarqueTs" style="width: 80px; height: auto; border-radius: 12px; margin-bottom: 16px; border: 3px solid rgba(255,255,255,0.3);">
                  <h1 style="color: ${smartContent.isUrgent ? '#9f1239' : '#0369a1'}; margin: 0; font-size: 26px; font-weight: 700;">
                    ${smartContent.config.emoji} ${smartContent.isUrgent ? 'Message urgent reçu' : 'Message bien reçu'} !
                  </h1>
                  <p style="color: ${smartContent.isUrgent ? '#be123c' : '#0284c7'}; margin: 8px 0 0 0; font-size: 14px;">
                    ${smartContent.config.title}
                  </p>
                </div>
                
                <div style="padding: 40px 30px;">
                  <p style="color: #1f2937; font-size: 16px; line-height: 1.8; margin: 0 0 24px 0;">
                    Bonjour <strong style="color: #0284c7;">${nom}</strong>,
                  </p>
                  
                  <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                    ${smartContent.config.intro}
                  </p>

                  ${smartContent.crisisBlock}
                  ${smartContent.urgentBadge}
                  
                  <div style="background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
                    <div style="display: flex; align-items: start;">
                      <span style="font-size: 28px; margin-right: 12px;">✅</span>
                      <div>
                        <strong style="color: #065f46; font-size: 15px; display: block; margin-bottom: 6px;">Message enregistré</strong>
                        <p style="margin: 0; color: #047857; font-size: 13px; line-height: 1.6;">
                          Je reviendrai vers vous <strong>${smartContent.config.timeframe}</strong> pour discuter de votre demande.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin-bottom: 28px; border: 1px solid #bae6fd;">
                    <p style="color: #0c4a6e; font-size: 14px; margin: 0 0 12px 0;">
                      <strong>${smartContent.config.emoji} À propos de votre demande :</strong>
                    </p>
                    <p style="color: #0369a1; font-size: 13px; line-height: 1.7; margin: 0;">
                      ${smartContent.config.additionalInfo}
                    </p>
                  </div>

                  <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 28px; border: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 13px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                      Votre message
                    </p>
                    <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">
                      "${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"
                    </p>
                  </div>

                  <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 8px; padding: 20px; margin-bottom: 28px;">
                    <p style="color: #0c4a6e; font-size: 14px; margin: 0;">
                      <strong>💡 En attendant notre échange :</strong><br>
                      ${smartContent.config.callToAction}
                    </p>
                  </div>

                  ${!smartContent.isCrisis ? `
                  <div style="background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 8px; padding: 16px; margin-bottom: 28px;">
                    <div style="display: flex; align-items: start;">
                      <span style="font-size: 20px; margin-right: 10px;">📞</span>
                      <p style="margin: 0; color: #0c4a6e; font-size: 13px; line-height: 1.6;">
                        <strong>Besoin de me joindre rapidement ?</strong><br>
                        N'hésitez pas à m'appeler directement au <strong>(418) 931-6786</strong>
                      </p>
                    </div>
                  </div>
                  ` : ''}
                  
                  <p style="color: #374151; font-size: 15px; margin: 0 0 8px 0;">Au plaisir d'échanger avec vous,</p>
                  <p style="color: #0284c7; font-size: 16px; font-weight: 600; margin: 0;">Nicolas Lamarque - Travailleur social</p>
                </div>
                
                <div style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <img src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" alt="LamarqueTs" style="width: 50px; height: auto; border-radius: 8px; margin-bottom: 12px; opacity: 0.8;">
                  <p style="color: #0284c7; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">LamarqueTs - Services Psychosociaux</p>
                  <p style="color: #6b7280; font-size: 12px; margin: 0 0 12px 0;">Suivi individuel • Évaluation psychosociale • Groupes de soutien</p>
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">📧 infos@lamarquets.com | 📞 (418) 931-6786</p>
                  <p style="color: #9ca3af; font-size: 11px; margin: 8px 0 0 0;">
                    <a href="https://lamarquets.com" style="color: #0284c7; text-decoration: none;">lamarquets.com</a> • Shawinigan, Mauricie, Québec
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        })
        
        console.log('✅ Emails envoyés avec succès')
        
      } catch (mailError: any) {
        console.error('⚠️ Erreur email:', mailError.message)
      }
    }

    return {
      success: true,
      message: 'Message reçu et sécurisé avec succès',
      id: newMessage.id,
      encrypted: true,
      encryption_algo: 'aes-256-gcm'
    }

  } catch (error: any) {
    console.error('💥 Erreur:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: error.message || "Erreur serveur" })
  }
})