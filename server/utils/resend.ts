// ============================================
// server/utils/resend.ts
// Configuration Resend centralisée
// ============================================
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export { resend }