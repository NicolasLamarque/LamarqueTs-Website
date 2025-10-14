// server/db/initLoginDb.ts

// 🟢 CORRIGÉ : Importer la classe Database comme l'export par défaut.
// (Nous renommons l'import pour qu'il soit plus clair que c'est la classe)
import BetterSqlite3 from "better-sqlite3";
const Database = BetterSqlite3;

// 🟢 CORRIGÉ : Importer le type RunResult en utilisant 'import type'.
// Ceci permet à TypeScript de l'utiliser pour le typage sans causer de problème
// à Node.js au moment de l'exécution.
import type { RunResult } from "better-sqlite3";

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

// Crée le dossier db si nécessaire
const dbDir = path.join(process.cwd(), "server/db")
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

const dbPath = path.join(dbDir, "auth.db")

// Typage utilisateur
export interface User {
  id?: number
  username: string
  password: string
  mail: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
  last_login: string
  profile_picture: string
  bio: string
  reset_token: string
  reset_token_expiry: string
  email_verified: boolean
  email_verification_token: string
  preferences: string
  two_factor_enabled: boolean
  two_factor_secret: string
  oauth_provider: string
  oauth_id: string
  oauth_token: string
}
// Typage utilisateur sommaire
type UserSummary = Pick<User, 'id' | 'username' | 'mail' | 'role' | 'is_active'>;


// Fonction interne pour ouvrir la DB
export function openDb() {
  return new Database(dbPath)
}

// Initialise la table users et admin
export function initDb() {
  const db = openDb()
  try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      mail TEXT,
      role TEXT DEFAULT 'user',
      created_at TEXT,
      updated_at TEXT,
      last_login TEXT,
      is_active BOOLEAN DEFAULT 1,
      profile_picture TEXT,
      bio TEXT,
      reset_token TEXT,
      reset_token_expiry TEXT,
      email_verified BOOLEAN DEFAULT 0,
      email_verification_token TEXT,
      preferences TEXT,
      two_factor_enabled BOOLEAN DEFAULT 0,
      two_factor_secret TEXT,
      oauth_provider TEXT,
      oauth_id TEXT,
      oauth_token TEXT
    );
  `)

// CRUD utilisateurs
  } finally {
    db.close()
  }

}




// MODIFIÉ : Nous utilisons un type de retour pour récupérer l'ID
export function insertUser(user: User): RunResult { 
  const db = openDb();
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  
  try {
    const stmt = db.prepare(`
        INSERT INTO users (username, password, role, is_active, created_at, mail) 
        VALUES (@username, @password, @role, @is_active, datetime('now'), @mail)
    `);
    
    // 💡 Micro-Refactorisation avec le Déversement (Spread)
    const params = {
      ...user, // Déverse toutes les propriétés de l'objet 'user' (Username, Mail, etc.)
      
      // Écrase les propriétés qui nécessitent une manipulation ou une valeur par défaut
      password: hashedPassword, // Écrase le mot de passe clair par le hash
      role: user.role || 'user',
      mail: user.mail || '',
      is_active: true, // Valeur forcée
      
      // Note : Si les noms des alias SQL (@username) ne correspondent pas 
      // aux noms de l'interface (user.username), il faut les mapper explicitement.
    };

    // 🟢 CORRIGÉ : On ajoute 'return' pour satisfaire le type RunResult
    return stmt.run(params) as RunResult; 

  } finally {
    db.close();
  }
}




export function getAllUsers(): UserSummary[] {
  const db = openDb();
  
  try {
    // 🟢 CORRIGÉ : On ne sélectionne que les champs définis dans UserSummary (pas le 'password')
    const stmt = db.prepare("SELECT id, username, role, is_active, mail FROM users");
    // La requête SQL a été mise à jour pour sélectionner tous les champs utiles
    const users = stmt.all() as UserSummary[];
    
    // Le retour se fait dans le try
    return users; 
    
  } finally {
    // La fermeture est garantie
    db.close(); 
  }
}




export function getUserSummaryById(id: number): UserSummary | undefined {
  const db = openDb()
  try {
    const stmt = db.prepare("SELECT id, username, role, is_active, mail FROM users WHERE id = ? ");
    const user = stmt.get(id) as User | undefined
    return user
  } finally {
    db.close()
  }
}


// MODIFIÉ : Retourne le nombre de changements (pour vérifier si l'utilisateur existe)
export function updateUser(id: number, user: User): number { 

  const db = openDb();
  
  try {
    // Le hashage doit se faire AVANT le try/finally si possible,
    // mais dans le cas d'une update, il est souvent géré ici.
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    
    const stmt = db.prepare(`
      UPDATE users 
      SET username = @username, password = @password, mail = @mail, role = @role, 
          is_active = @is_active, updated_at = datetime('now') 
      WHERE id = @id
    `);

    // Construction des paramètres optimisée
    const params = {
      // 1. Déverse les propriétés de 'user' (sauf celles qu'on écrase)
      ...user, 
      
      // 2. Ajoute l'ID pour la clause WHERE (si non présent dans 'user')
      id: id, 

      // 3. Écrase les valeurs qui doivent être transformées ou avoir des valeurs par défaut
      password: hashedPassword,           // Le hash sécurisé
      mail: user.mail || '',              // Assure une chaîne vide
      role: user.role || 'user',          // Assure le rôle par défaut
      is_active: user.is_active ?? true,  // Assure une valeur booléenne (ou 1/0 si conversion)
    };
    
    // Exécution et récupération du nombre de changements
    const result = stmt.run(params);
    return result.changes; 

  } finally {
    db.close();
  }
}


export function deleteUser(id: number): number {
  const db = openDb()
  try {
    const stmt = db.prepare("DELETE FROM users WHERE id = @id?")
    const result = stmt.run({ id });
    return result.changes
  } finally {
    db.close()
  }
}

// Initialisation de la base de données à l'importation du module 
if (!fs.existsSync(dbPath)) {
  initDb();
}

