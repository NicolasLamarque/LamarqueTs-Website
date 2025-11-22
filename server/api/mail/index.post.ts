// server/api/mail/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { insertMessage } from '../../utils/contact'
import { Resend } from 'resend'

// Initialiser Resend avec votre clé API
const resend = new Resend(process.env.RESEND_API_KEY)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { nom, email, telephone, sujet, message } = body

    console.log('📥 Nouveau message reçu:', { nom, email, sujet })

    // ============================================
    // VALIDATION
    // ============================================
    if (!nom || !email || !message) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: "Nom, email et message sont requis" 
      })
    }

    // Validation email
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
          // ⚠️ IMPORTANT : "from" doit être un domaine vérifié dans Resend
          // Si vous n'avez pas de domaine, utilisez onboarding@resend.dev pour les tests
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          
          // Email de destination (vous)
          to: process.env.ADMIN_EMAIL || 'lamarquets@outlook.com',
          
          // Le client pourra répondre directement
          replyTo: email,
          
          subject: `📢 Nouveau message: ${sujet || 'Sans sujet'} - ${nom}`,
          
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">📬 Nouveau Message</h1>
                <p style="color: #e0f2fe; margin: 10px 0 0 0;">Message chiffré en base de données</p>
              </div>
              
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #0ea5e9;">
                  <h2 style="color: #1f2937; margin-top: 0;">📋 Informations</h2>
                  <p><strong>Nom:</strong> ${nom}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  ${telephone ? `<p><strong>Téléphone:</strong> ${telephone}</p>` : ''}
                  ${sujet ? `<p><strong>Sujet:</strong> ${sujet}</p>` : ''}
                  <p><strong>Priorité:</strong> 
                    <span style="background: ${priority === 'high' ? '#ef4444' : '#3b82f6'}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                      ${priority === 'high' ? '🔥 HAUTE' : '📌 NORMALE'}
                    </span>
                  </p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #10b981;">
                  <h2 style="color: #1f2937; margin-top: 0;">💬 Message</h2>
                  <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                </div>

                <div style="background: #dcfce7; border: 1px solid #86efac; padding: 15px; border-radius: 10px; margin-top: 20px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">🔐</span>
                    <div>
                      <strong style="color: #15803d;">Sécurité maximale</strong>
                      <p style="margin: 5px 0 0 0; color: #166534; font-size: 14px;">
                        Ce message est chiffré (AES-256-GCM) en base de données.<br>
                        Seul le serveur peut le déchiffrer avec la clé privée.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                  <a href="mailto:${email}" style="background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    📧 Répondre par email
                  </a>
                </div>
                
                <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px;">
                  Message reçu le ${new Date().toLocaleString('fr-FR')}<br>
                  ID: #${newMessage.id}
                </p>
              </div>
            </div>
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