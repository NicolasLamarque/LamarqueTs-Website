// server/api/users/index.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

// Définition de l'interface pour le corps de la requête
interface User {
  username?: string;
  password?: string;
  mail?: string;
  role?: string;
}

// Chemin vers la DB
const dbPath = path.join(process.cwd(), 'server/db/auth.db');

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as User; // Correction ici
  const { username, password, mail, role } = body;

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Nom d\'utilisateur ou mot de passe manquant.' });
  }

  const db = new Database(dbPath);
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Vérification de l'existence de l'utilisateur
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existingUser) {
      throw createError({ statusCode: 409, statusMessage: 'Le nom d\'utilisateur existe déjà.' });
    }

    const stmt = db.prepare('INSERT INTO users (username, password, mail, role, is_active, bio, profile_picture, two_factor_enabled, preferences) VALUES (?, ?, ?, ?, ?, "", "", 0, "{}")');
    const result = stmt.run(username, hashedPassword, mail, role, 1);

    return { id: result.lastInsertRowid, message: 'Utilisateur ajouté avec succès.' };
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error && err.message.includes('UNIQUE constraint failed')) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Le nom d\'utilisateur existe déjà.'
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'ajout de l\'utilisateur.'
    });
  } finally {
    db.close();
  }
});