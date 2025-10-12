// server/api/auth/login.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path from 'path'

// Définition de l'interface pour le corps de la requête de connexion
interface LoginBody {
  username?: string;
  password?: string;
}

// Chemin vers la DB
const dbPath = path.join(process.cwd(), 'server/db/auth.db')

// Assurez-vous que la clé est définie pour éviter les erreurs
const jwtSecret = process.env.JWT_SECRET;

// Ne pas oublier de gérer le cas où la clé n'existe pas
if (!jwtSecret) {
  // Gérer l'erreur, par exemple en arrêtant l'application
  throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement.');
}


export default defineEventHandler(async (event) => {
  // Lire le corps de la requête et le typer
  const body = await readBody(event) as LoginBody; // Correction ici
  const { username, password } = body

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Veuillez fournir un nom d’utilisateur et un mot de passe' });
  }

  // Connexion à la DB
  const db = new Database(dbPath)
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?")
  const user = stmt.get(username)
  db.close()

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Utilisateur inconnu' });
  }

  // Vérification du mot de passe
  // Le 'user' retourné par la DB n'est pas typé par défaut,
  // donc nous devons forcer le type pour que TypeScript reconnaisse 'password'
  const valid = bcrypt.compareSync(password, (user as any).password)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Mot de passe incorrect' });
  }
  
  // Générer un token JWT
  const token = jwt.sign(
    {
      id: (user as any).id,
      username: (user as any).username,
      role: (user as any).role
    },
    jwtSecret,
    { expiresIn: '1h' } // Le token expire après 1 heure
  )
console.log("token généré:", token);
  return { token }
})