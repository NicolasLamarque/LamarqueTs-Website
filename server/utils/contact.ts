// server/utils/contact.ts
import { db } from "./db";
import { contacts_messages, ContactMessageSelect } from "./schema";
import { ContactMessage } from "./schema";
import { eq, desc } from "drizzle-orm";
import { encrypt, decrypt } from "./crypto";

// ========================================
// CRUD messages de contact - CHIFFREMENT COMPLET
// ========================================

/**
 * Insère un nouveau message de contact (TOUT chiffré)
 */
export async function insertMessage(msg: ContactMessage): Promise<ContactMessageSelect> {
  console.log('🔐 Chiffrement de toutes les données sensibles...')
  
  // Chiffrer TOUTES les données sensibles
  const encryptedData = {
    sender_name: encrypt(msg.sender_name!),
    sender_email: encrypt(msg.sender_email!),
    message: encrypt(msg.message!),
    category: encrypt(msg.category || 'general'), // Le sujet peut être sensible
  }

  console.log('✅ Données chiffrées, insertion en DB...')

  const [newMsg] = await db.insert(contacts_messages)
    .values({ 
      ...msg,
      ...encryptedData,
      encrypted: true,
      encryption_algo: 'aes-256-gcm',
      created_at: new Date() 
    })
    .returning();

  console.log(`✅ Message #${newMsg.id} enregistré (chiffré)`)
  
  // Retourner le message AVEC les données chiffrées (pour la DB)
  return newMsg;
}

/**
 * Récupère tous les messages (avec déchiffrement complet côté serveur)
 */
export async function getAllMessages(): Promise<ContactMessageSelect[]> {
  console.log('📬 Récupération et déchiffrement de tous les messages...')
  
  const messages = await db
    .select()
    .from(contacts_messages)
    .orderBy(desc(contacts_messages.created_at));

  console.log(`🔓 Déchiffrement de ${messages.length} messages...`)

  // Déchiffrer TOUTES les données sensibles
  return messages.map(m => {
    if (!m.encrypted) {
      // Messages anciens non chiffrés (rétrocompatibilité)
      return m
    }

    try {
      return {
        ...m,
        sender_name: decrypt(m.sender_name),
        sender_email: decrypt(m.sender_email),
        message: decrypt(m.message),
        category: decrypt(m.category),
      }
    } catch (error) {
      console.error(`❌ Erreur déchiffrement message #${m.id}:`, error)
      // En cas d'erreur, retourner les données chiffrées avec un flag
      return {
        ...m,
        sender_name: '[ERREUR DÉCHIFFREMENT]',
        sender_email: '[ERREUR DÉCHIFFREMENT]',
        message: '[ERREUR DÉCHIFFREMENT]',
      }
    }
  });
}

/**
 * Récupère un message par ID (déchiffrement complet)
 */
export async function getMessageById(id: number): Promise<ContactMessageSelect | undefined> {
  console.log(`📬 Récupération message #${id}...`)
  
  const [msg] = await db
    .select()
    .from(contacts_messages)
    .where(eq(contacts_messages.id, id))
    .limit(1);

  if (!msg) {
    console.log(`❌ Message #${id} introuvable`)
    return undefined;
  }

  if (!msg.encrypted) {
    // Message ancien non chiffré
    return msg;
  }

  console.log(`🔓 Déchiffrement message #${id}...`)

  try {
    return {
      ...msg,
      sender_name: decrypt(msg.sender_name),
      sender_email: decrypt(msg.sender_email),
      message: decrypt(msg.message),
      category: decrypt(msg.category),
    };
  } catch (error) {
    console.error(`❌ Erreur déchiffrement message #${id}:`, error)
    throw new Error('Impossible de déchiffrer ce message. La clé de chiffrement est peut-être invalide.')
  }
}

/**
 * Recherche dans les messages (déchiffre puis filtre)
 * ⚠️ ATTENTION : Moins performant car doit tout déchiffrer
 */
export async function searchMessages(query: string): Promise<ContactMessageSelect[]> {
  console.log(`🔍 Recherche: "${query}"`)
  
  // Récupérer TOUS les messages déchiffrés
  const allMessages = await getAllMessages()
  
  const searchLower = query.toLowerCase()
  
  // Filtrer après déchiffrement
  return allMessages.filter(m => 
    m.sender_name.toLowerCase().includes(searchLower) ||
    m.sender_email.toLowerCase().includes(searchLower) ||
    m.message.toLowerCase().includes(searchLower)
  )
}

/**
 * Mettre à jour un message (re-chiffrement si nécessaire)
 */
export async function updateMessage(
  id: number, 
  updates: Partial<ContactMessage>
): Promise<ContactMessageSelect | undefined> {
  console.log(`📝 Mise à jour message #${id}...`)
  
  // Si on modifie des champs sensibles, les re-chiffrer
  const encryptedUpdates: any = { ...updates, updated_at: new Date() }
  
  if (updates.sender_name) {
    encryptedUpdates.sender_name = encrypt(updates.sender_name)
  }
  if (updates.sender_email) {
    encryptedUpdates.sender_email = encrypt(updates.sender_email)
  }
  if (updates.message) {
    encryptedUpdates.message = encrypt(updates.message)
  }
  if (updates.category) {
    encryptedUpdates.category = encrypt(updates.category)
  }

  const [updated] = await db
    .update(contacts_messages)
    .set(encryptedUpdates)
    .where(eq(contacts_messages.id, id))
    .returning()

  if (!updated) return undefined

  // Retourner déchiffré
  return getMessageById(id)
}

/**
 * Supprimer un message (soft delete)
 */
export async function softDeleteMessage(id: number, deletedBy: string = 'admin'): Promise<boolean> {
  console.log(`🗑️ Suppression (soft) message #${id}...`)
  
  const [deleted] = await db
    .update(contacts_messages)
    .set({
      deleted: true,
      deleted_at: new Date(),
      deleted_by: deletedBy,
      updated_at: new Date()
    })
    .where(eq(contacts_messages.id, id))
    .returning()

  return !!deleted
}

/**
 * Supprimer définitivement un message (hard delete)
 */
export async function hardDeleteMessage(id: number): Promise<boolean> {
  console.log(`💥 Suppression définitive message #${id}...`)
  
  const result = await db
    .delete(contacts_messages)
    .where(eq(contacts_messages.id, id))
    .returning()

  return result.length > 0
}