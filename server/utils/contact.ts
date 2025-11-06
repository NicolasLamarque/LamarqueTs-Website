
// server/utils/contacts.ts
import { db } from "./db";
import { contacts_messages, ContactMessageSelect } from "./schema";
import { ContactMessage } from "./schema";
import { eq, desc } from "drizzle-orm";
import { encrypt, decrypt } from "./crypto"; // 🔐 notre module crypto.ts

// ========================================
// CRUD messages de contact
// ========================================

/**
 * Insère un nouveau message de contact (chiffré)
 */
export async function insertMessage(msg: ContactMessage): Promise<ContactMessageSelect> {
  const encryptedMessage = encrypt(msg.message!); // ⚡ chiffrement automatique

  const [newMsg] = await db.insert(contacts_messages)
    .values({ ...msg, message: encryptedMessage, encrypted: true, created_at: new Date() })
    .returning();

  return newMsg;
}

/**
 * Récupère tous les messages (avec déchiffrement côté serveur)
 */
export async function getAllMessages(): Promise<ContactMessageSelect[]> {
  const messages = await db.select().from(contacts_messages).orderBy(desc(contacts_messages.created_at));

  return messages.map(m => ({
    ...m,
    message: m.encrypted ? decrypt(m.message) : m.message
  }));
}

/**
 * Récupère un message par ID (décrypté si nécessaire)
 */
export async function getMessageById(id: number): Promise<ContactMessageSelect | undefined> {
  const [msg] = await db.select().from(contacts_messages).where(eq(contacts_messages.id, id)).limit(1);

  if (!msg) return undefined;

  return {
    ...msg,
    message: msg.encrypted ? decrypt(msg.message) : msg.message
  };
}
