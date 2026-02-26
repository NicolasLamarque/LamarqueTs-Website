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
  
  const crisisKeywords = [
  // Détresse émotionnelle
  'détresse', 'angoisse', 'panique', 'désespoir', 'désespéré', 'désespérée',
  'effondrée', 'effondré', 'bout du rouleau', 'plus capable', 'plus la force',
  'épuisé', 'épuisée', 'à bout', 'craquer', 'craque',

  // Idéations suicidaires
  'suicide', 'suicidaire', 'me suicider', 'en finir', 'mettre fin',
  'mourir', 'veux mourir', 'envie de mourir', 'plus vouloir vivre',
  'plus de raison de vivre', 'plus envie de vivre', 'pas envie de vivre',
  'pensées noires', 'idées noires',

  // Violence et danger
  'danger', 'violence', 'violenté', 'violentée', 'frappé', 'frappée',
  'menacé', 'menacée', 'peur pour ma vie', 'peur pour ma sécurité',
  'en sécurité', 'pas en sécurité', 'conjoint violent', 'conjointe violente',

  // Crise immédiate
  'urgence', 'urgent', 'maintenant', 'ce soir', 'cette nuit', 'tout de suite',
  'crise', 'aide immédiate', 'besoin d aide', 'sos',

  // Santé mentale aiguë
  'hallucination', 'voix dans ma tête',
  'automutilation', 'me blesser', 'me faire du mal', 'me couper',
]
  const isCrisis = crisisKeywords.some(k => msgLower.includes(k))
  
  const subjectConfig: Record<string, any> = {
    'accompagnement': {
      emoji: '🤝',
      title: 'Demande d\'accompagnement individuel',
      intro: 'Je comprends votre besoin d\'accompagnement personnalisé.',
      timeframe: 'dans un délai raisonable',
      additionalInfo: 'L\'accompagnement individuel permet un suivi personnalisé adapté à votre situation unique. Nous pourrons discuter ensemble de vos besoins et établir un plan d\'intervention qui vous convient.',
      callToAction: 'Préparez-vous à discuter de vos objectifs et de ce que vous aimeriez accomplir grâce à cet accompagnement.'
    },
    'mandat': {
      emoji: '📋',
      title: 'Homologation de mandat',
      intro: 'Votre demande concernant l\'homologation de mandat est bien notée.',
      timeframe: 'dans un délai raisonnable',
      additionalInfo: 'L\'homologation d\'un mandat de protection est une démarche importante qui nécessite une évaluation psychosociale complète. Je vous accompagnerai dans toutes les étapes de ce processus.',
      callToAction: 'Rassemblez les documents pertinents concernant la situation (documents médicaux, mandat notarié, etc.).'
    },
    'groupe': {
      emoji: '👥',
      title: 'Groupes thérapeutiques',
      intro: 'Les groupes thérapeutiques sont une excellente approche pour le soutien mutuel.',
      timeframe: 'dans un délai raisonnable',
      additionalInfo: 'Nos groupes thérapeutiques offrent un espace sécuritaire pour partager, apprendre et grandir avec d\'autres personnes vivant des situations similaires. Je vous informerai des prochaines sessions disponibles.',
      callToAction: 'Réfléchissez aux thématiques qui vous intéressent particulièrement pour notre prochaine discussion.'
    },
    'information': {
      emoji: 'ℹ️',
      title: 'Demande d\'information',
      intro: 'Je serai heureux de répondre à vos questions.',
      timeframe: 'dans un délai raisonnable',
      additionalInfo: 'N\'hésitez pas à poser toutes vos questions. Mon rôle est de vous fournir des informations claires sur les services disponibles et de vous orienter vers les ressources appropriées.',
      callToAction: 'Si vous avez d\'autres questions d\'ici là, n\'hésitez pas à m\'écrire à nouveau.'
    },
    'autre': {
      emoji: '💬',
      title: 'Votre demande',
      intro: 'J\'ai bien pris connaissance de votre message.',
      timeframe: 'dans un délai raisonnable',
      additionalInfo: 'Chaque situation est unique et mérite une attention particulière. Je prendrai le temps nécessaire pour bien comprendre votre demande et y répondre de manière appropriée.',
      callToAction: 'Je reviendrai vers vous rapidement pour discuter de la meilleure façon de vous aider.'
    }
  }

  const config = subjectConfig[sujet] || subjectConfig['autre']

  if (isUrgent) {
    config.timeframe = 'dans un délai rasonable'
    config.intro = '⚡ ' + config.intro + ' Je comprends l\'urgence de votre situation.'
  }

  const crisisBlock = isCrisis ? `
    <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
      <div style="display: flex; align-items: start;">
        <span style="font-size: 28px; margin-right: 12px;">🆘</span>
        <div>
          <strong style="color: #991b1b; font-size: 16px; display: block; margin-bottom: 8px;">Besoin d'aide immédiate ?</strong>
          <p style="margin: 0 0 12px 0; color: #7f1d1d; font-size: 14px; line-height: 1.6;">
            Si vous ou un de vos proche êtes en détresse ou en situation de crise, contactez immédiatement :
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
            <html lang="fr">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                @media (prefers-color-scheme: dark) {
                  .email-body { background-color: #0f172a !important; }
                  .email-card { background-color: #1e293b !important; border-color: #334155 !important; }
                  .section-card { background-color: #0f172a !important; border-color: #334155 !important; }
                  .message-card { background-color: #0f172a !important; border-color: #334155 !important; }
                  .label-text { color: #94a3b8 !important; }
                  .value-text { color: #e2e8f0 !important; }
                  .message-text { color: #cbd5e1 !important; }
                  .footer-bg { background-color: #0f172a !important; border-color: #334155 !important; }
                  .footer-text { color: #64748b !important; }
                  .header-title { color: #f1f5f9 !important; }
                  .btn-dashboard { background-color: #1e293b !important; color: #e2e8f0 !important; border-color: #475569 !important; }
                }
              </style>
            </head>
            <body class="email-body" style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div class="email-card" style="max-width: 580px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                
                <!-- Header sobre -->
                <div style="background: #0f172a; padding: 28px 32px; border-bottom: 3px solid #0d9488;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">LamarqueTs</p>
                        <h1 class="header-title" style="margin: 4px 0 0 0; color: #f1f5f9; font-size: 20px; font-weight: 600;">
                          ${priority === 'high' ? '⚡ Message prioritaire' : '📬 Nouveau message'}
                        </h1>
                      </td>
                      <td style="text-align: right; vertical-align: middle;">
                        <span style="background: #0d9488; color: white; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                          #${newMessage.id}
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>

                <div style="padding: 28px 32px;">

                  <!-- Infos contact -->
                  <div class="section-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <p style="margin: 0 0 14px 0; color: #0d9488; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">Contact</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td class="label-text" style="padding: 5px 0; color: #64748b; font-size: 13px; width: 90px;">Nom</td>
                        <td class="value-text" style="padding: 5px 0; color: #0f172a; font-size: 14px; font-weight: 500;">${nom}</td>
                      </tr>
                      <tr>
                        <td class="label-text" style="padding: 5px 0; color: #64748b; font-size: 13px;">Email</td>
                        <td style="padding: 5px 0;">
                          <a href="mailto:${email}" style="color: #0d9488; font-size: 14px; text-decoration: none; font-weight: 500;">${email}</a>
                        </td>
                      </tr>
                      ${telephone ? `
                      <tr>
                        <td class="label-text" style="padding: 5px 0; color: #64748b; font-size: 13px;">Téléphone</td>
                        <td class="value-text" style="padding: 5px 0; color: #0f172a; font-size: 14px; font-weight: 500;">${telephone}</td>
                      </tr>
                      ` : ''}
                      ${sujet ? `
                      <tr>
                        <td class="label-text" style="padding: 5px 0; color: #64748b; font-size: 13px;">Sujet</td>
                        <td class="value-text" style="padding: 5px 0; color: #0f172a; font-size: 14px; font-weight: 500;">${sujet}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td class="label-text" style="padding: 5px 0; color: #64748b; font-size: 13px;">Reçu le</td>
                        <td class="value-text" style="padding: 5px 0; color: #0f172a; font-size: 13px;">${new Date().toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Message -->
                  <div class="message-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #0d9488; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <p style="margin: 0 0 12px 0; color: #0d9488; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">Message</p>
                    <p class="message-text" style="white-space: pre-wrap; line-height: 1.7; color: #334155; margin: 0; font-size: 14px;">${message}</p>
                  </div>

                  <!-- Sécurité -->
                  <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 12px; text-align: center;">
                    🔒 Chiffré AES-256-GCM · ID #${newMessage.id}
                  </p>

                  <!-- Actions -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right: 8px;">
                        <a href="mailto:${email}" style="display: block; background: #0d9488; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center;">
                          Répondre
                        </a>
                      </td>
                      <td style="padding-left: 8px;">
                        <a class="btn-dashboard" href="https://lamarquets.com/dashboard/messages" style="display: block; background: #f1f5f9; color: #334155; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; text-align: center; border: 1px solid #e2e8f0;">
                          Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>

                </div>

                <!-- Footer -->
                <div class="footer-bg" style="background: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p class="footer-text" style="margin: 0; color: #94a3b8; font-size: 12px;">LamarqueTs · Système de contact sécurisé</p>
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
            <html lang="fr">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                @media (prefers-color-scheme: dark) {
                  .email-body { background-color: #0f172a !important; }
                  .email-card { background-color: #1e293b !important; border-color: #334155 !important; }
                  .section-card { background-color: #0f172a !important; border-color: #334155 !important; }
                  .body-text { color: #cbd5e1 !important; }
                  .intro-text { color: #94a3b8 !important; }
                  .footer-bg { background-color: #0f172a !important; border-color: #334155 !important; }
                  .footer-text { color: #64748b !important; }
                  .contact-text { color: #94a3b8 !important; }
                }
              </style>
            </head>
            <body class="email-body" style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div class="email-card" style="max-width: 580px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">

                <!-- Header -->
                <div style="background: #0f172a; padding: 32px; text-align: center; border-bottom: 3px solid ${smartContent.isUrgent ? '#f43f5e' : '#0d9488'};">
                  <img src="https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/logo.jpg" alt="LamarqueTs" style="width: 64px; height: auto; border-radius: 10px; margin-bottom: 16px; opacity: 0.95;">
                  <h1 style="margin: 0; color: #f1f5f9; font-size: 22px; font-weight: 600;">
                    ${smartContent.isUrgent ? '⚡ Message urgent reçu' : 'Message bien reçu'} 
                  </h1>
                  <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">${smartContent.config.title}</p>
                </div>

                <div style="padding: 32px;">

                  <!-- Salutation + intro -->
                  <p class="body-text" style="color: #1e293b; font-size: 15px; line-height: 1.7; margin: 0 0 8px 0;">
                    Bonjour <strong style="color: #0d9488;">${nom}</strong>,
                  </p>
                  <p class="intro-text" style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0 0 24px 0;">
                    ${smartContent.config.intro}
                  </p>

                  ${smartContent.crisisBlock}
                  ${smartContent.urgentBadge}

                  <!-- Confirmation -->
                  <div class="section-card" style="background: #f0fdfa; border: 1px solid #99f6e4; border-left: 3px solid #0d9488; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #0f766e; font-size: 14px; line-height: 1.6;">
                      ✓ &nbsp;Votre message est enregistré. Je vous réponds <strong>${smartContent.config.timeframe}</strong>.
                    </p>
                  </div>

                  <!-- Info sujet -->
                  <div class="section-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
                    <p style="margin: 0 0 8px 0; color: #0d9488; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">${smartContent.config.emoji} À savoir</p>
                    <p class="intro-text" style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">${smartContent.config.additionalInfo}</p>
                  </div>

                  <!-- Contact -->
                  ${!smartContent.isCrisis ? `
                  <div class="section-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                    <p class="contact-text" style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                      Une question urgente ? &nbsp;<a href="tel:4189316786" style="color: #0d9488; text-decoration: none; font-weight: 600;">(418) 931-6786</a>
                    </p>
                  </div>
                  ` : ''}

                  <!-- Signature -->
                  <p class="intro-text" style="color: #64748b; font-size: 14px; margin: 0 0 4px 0;">Au plaisir d'échanger avec vous,</p>
                  <p style="color: #0d9488; font-size: 15px; font-weight: 600; margin: 0;">Nicolas Lamarque · Travailleur social</p>

                </div>

                <!-- Footer -->
                <div class="footer-bg" style="background: #f8fafc; padding: 18px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p class="footer-text" style="margin: 0 0 4px 0; color: #94a3b8; font-size: 12px; font-weight: 600;">LamarqueTs · Services Psychosociaux</p>
                  <p class="footer-text" style="margin: 0; color: #94a3b8; font-size: 11px;">
                    <a href="https://lamarquets.com" style="color: #0d9488; text-decoration: none;">lamarquets.com</a>
                    &nbsp;·&nbsp; infos@lamarquets.com &nbsp;·&nbsp; Shawinigan, Québec
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