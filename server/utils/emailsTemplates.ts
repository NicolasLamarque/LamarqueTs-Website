// ============================================
// server/utils/emailTemplates.ts
// Templates HTML pour les emails
// ============================================

/**
 * Template pour notifier l'admin d'un nouveau message
 */
export function getAdminNotificationEmail(data: {
  nom: string
  email: string
  telephone?: string
  sujet?: string
  priority: string
  messageId: number
}) {
  const priorityEmoji = data.priority === 'high' ? '🔴' : '🟢'
  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  
  return {
    subject: `🔔 Nouveau message de ${data.nom}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; }
            .content { padding: 32px 24px; }
            .info-row { display: flex; padding: 12px 16px; margin-bottom: 8px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #0284c7; }
            .info-label { font-weight: 600; color: #374151; min-width: 100px; }
            .info-value { color: #6b7280; }
            .priority-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; background: ${data.priority === 'high' ? '#fee2e2' : '#dcfce7'}; color: ${data.priority === 'high' ? '#991b1b' : '#166534'}; }
            .alert-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0; }
            .alert-box p { margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5; }
            .cta-button { display: inline-block; margin-top: 24px; padding: 14px 32px; background: #0284c7; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.3s; }
            .cta-button:hover { background: #0369a1; }
            .footer { background: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 12px; }
            .security-icon { font-size: 20px; margin-right: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📨 Nouveau message de contact</h1>
            </div>
            
            <div class="content">
              <div class="info-row">
                <span class="info-label">👤 Nom:</span>
                <span class="info-value">${data.nom}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">📧 Email:</span>
                <span class="info-value">${data.email}</span>
              </div>
              
              ${data.telephone ? `
                <div class="info-row">
                  <span class="info-label">📱 Téléphone:</span>
                  <span class="info-value">${data.telephone}</span>
                </div>
              ` : ''}
              
              ${data.sujet ? `
                <div class="info-row">
                  <span class="info-label">📋 Sujet:</span>
                  <span class="info-value">${data.sujet}</span>
                </div>
              ` : ''}
              
              <div class="info-row">
                <span class="info-label">⚡ Priorité:</span>
                <span class="priority-badge">${priorityEmoji} ${data.priority === 'high' ? 'Haute' : 'Normale'}</span>
              </div>
              
              <div class="alert-box">
                <p>
                  <span class="security-icon">🔒</span>
                  <strong>Message crypté et sécurisé</strong><br>
                  Le contenu du message a été automatiquement crypté avec AES-256-GCM et stocké en toute sécurité dans votre base de données.
                  Connectez-vous au dashboard pour le décrypter et le consulter.
                </p>
              </div>
              
              <center>
                <a href="${appUrl}/admin/messages?id=${data.messageId}" class="cta-button">
                  🔓 Voir le message décrypté
                </a>
              </center>
            </div>
            
            <div class="footer">
              <p>Cette notification a été générée automatiquement par LamarqueTs</p>
              <p style="margin-top: 8px;">ID du message: #${data.messageId}</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

/**
 * Template pour répondre à un contact
 */
export function getReplyEmail(data: {
  senderName: string
  replyContent: string
  originalMessage: string
}) {
  return {
    subject: 'Re: Votre message à LamarqueTs',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; }
            .content { padding: 32px 24px; }
            .reply-content { background: #f9fafb; border-left: 4px solid #0284c7; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .original-message { background: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 30px; border: 1px solid #e5e7eb; }
            .original-message-header { font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 12px; text-transform: uppercase; }
            .original-message-content { color: #374151; font-size: 14px; line-height: 1.6; }
            .footer { background: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
            .signature p { margin: 4px 0; color: #374151; }
            .contact-info { display: inline-flex; align-items: center; margin: 8px 16px 8px 0; color: #0284c7; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 Réponse à votre message</h1>
            </div>
            
            <div class="content">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                Bonjour <strong>${data.senderName}</strong>,
              </p>
              
              <div class="reply-content">
                ${data.replyContent.split('\n').map(line => `<p style="margin: 8px 0; color: #374151;">${line}</p>`).join('')}
              </div>
              
              <div class="original-message">
                <div class="original-message-header">📝 Votre message original</div>
                <div class="original-message-content">
                  ${data.originalMessage.split('\n').map(line => `<p style="margin: 8px 0;">${line}</p>`).join('')}
                </div>
              </div>
              
              <div class="signature">
                <p style="font-weight: 600; color: #0284c7; margin-bottom: 12px;">Cordialement,</p>
                <p style="font-weight: 700; font-size: 16px; color: #374151;">L'équipe LamarqueTs</p>
                <div style="margin-top: 16px;">
                  <div class="contact-info">
                    📧 info@LamarqueTs.com
                  </div>
                  <div class="contact-info">
                    📱 (418) 931-6786
                  </div>
                </div>
                <p style="margin-top: 12px; color: #6b7280; font-size: 13px;">
                  3700 Rue place Masson, Shawinigan, Québec
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>Cet email a été envoyé depuis notre système de gestion de contacts</p>
              <p style="margin-top: 8px; font-size: 11px;">
                Si vous n'êtes pas l'expéditeur de ce message, veuillez ignorer cet email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

/**
 * Template de confirmation pour l'expéditeur (optionnel)
 */
export function getConfirmationEmail(senderName: string) {
  return {
    subject: '✅ Message bien reçu - LamarqueTs',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px 24px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; }
            .content { padding: 32px 24px; text-align: center; }
            .checkmark { font-size: 64px; margin-bottom: 20px; }
            .message { color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0; }
            .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: left; }
            .footer { background: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Message bien reçu !</h1>
            </div>
            
            <div class="content">
              <div class="checkmark">✅</div>
              
              <p class="message">
                <strong>Bonjour ${senderName},</strong><br><br>
                Merci pour votre message ! Nous l'avons bien reçu et il a été traité en toute sécurité.
              </p>
              
              <div class="info-box">
                <p style="margin: 0 0 12px 0; color: #1e40af; font-weight: 600;">
                  🔒 Votre vie privée est importante
                </p>
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                  Votre message a été automatiquement crypté avec un système de chiffrement de niveau bancaire (AES-256-GCM). 
                  Seul notre équipe autorisée peut le consulter de manière sécurisée.
                </p>
              </div>
              
              <p class="message">
                Nous nous efforçons de répondre à tous les messages dans les <strong>24 à 48 heures</strong>.
              </p>
            </div>
            
            <div class="footer">
              <p>LamarqueTs - Services professionnels</p>
              <p style="margin-top: 8px;">📧 info@LamarqueTs.com | 📱 (418) 931-6786</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}