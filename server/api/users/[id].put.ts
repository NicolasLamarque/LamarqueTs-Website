// server/api/users/[id].put.ts
import { defineEventHandler, readBody, createError } from 'h3'
import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

// Définition de l'interface pour le corps de la requête
interface UserUpdate {
  username?: string;
  password?: string;
  mail?: string;
  role?: string;
  is_active?: boolean;
  bio?: string;
  profile_picture?: string;
  two_factor_enabled?: boolean;
  preferences?: string;
}

const dbPath = path.join(process.cwd(), 'server/db/auth.db');

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id;
  const body = await readBody(event) as UserUpdate; // Correction ici

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'ID d\'utilisateur manquant.' });
  }

  const updates: any = {};
  if (body.username) updates.username = body.username;
  if (body.mail) updates.mail = body.mail;
  if (body.role) updates.role = body.role;
  if (body.is_active !== undefined) updates.is_active = body.is_active;
  if (body.bio) updates.bio = body.bio;
  if (body.profile_picture) updates.profile_picture = body.profile_picture;
  if (body.two_factor_enabled !== undefined) updates.two_factor_enabled = body.two_factor_enabled;
  if (body.preferences) updates.preferences = body.preferences;
  if (body.password) {
    updates.password = bcrypt.hashSync(body.password, 10);
  }

  const db = new Database(dbPath);
  try {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    if (values.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Aucun champ à mettre à jour.' });
    }

    const stmt = db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`);
    const result = stmt.run(...values, userId);

    if (result.changes === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Utilisateur non trouvé.' });
    }
    
    return { success: true, message: `Utilisateur avec l'ID ${userId} mis à jour.` };
  } catch (err) {
    console.error(err);
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la mise à jour de l\'utilisateur.' });
  } finally {
    db.close();
  }
});