// server/db/initLoginDb.ts
import Database from "better-sqlite3"
import fs from "fs"
import path from "path"
import bcrypt from "bcryptjs"

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

// Fonction interne pour ouvrir la DB
export function openDb() {
  return new Database(dbPath)
}

// Initialise la table users et admin
export function initDb() {
  const db = openDb()
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

  // Vérifie si l'utilisateur admin existe déjà
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?")
  const adminUser = stmt.get("admin")

  if (!adminUser) {
    const hashedPassword = bcrypt.hashSync("admin123", 10)
    const insert = db.prepare("INSERT INTO users (username, password) VALUES (@username, @password)")
    insert.run("admin", hashedPassword)
    console.log("Utilisateur admin créé (admin / admin123)")
  } else {
    console.log("Utilisateur admin déjà existant")
  }

  db.close()
}

// CRUD utilisateurs

export function insertUser(user: User): void {
  const db = openDb();
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  const stmt = db.prepare(`
    INSERT INTO users (username, password, role, is_active, created_at, mail) 
    VALUES (@username, @password, @role, @is_active, datetime('now'), @mail)
  `);
  stmt.run({
    username: user.username,
    password: hashedPassword,
    role: user.role || 'user',
    is_active: true,
    mail: user.mail || ''
  });
  db.close();
}
type UserSummary = Pick<User, 'id' | 'username' | 'mail' | 'role' | 'is_active'>;

export function getAllUsers(): UserSummary[] {
  const db = openDb();
  const stmt = db.prepare("SELECT id, username, password, role, is_active, mail FROM users");
  const users = stmt.all() as UserSummary[];
  db.close();
  return users;
}

export function getUserById(id: number): User | undefined {
  const db = openDb()
  const stmt = db.prepare("SELECT id, username, password, role, is_active, mail FROM users WHERE id = ?")
  const user = stmt.get(id) as User | undefined
  db.close()
  return user
}

export function updateUser(id: number, user: User): void {
  const db = openDb();
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  const stmt = db.prepare(`
    UPDATE users 
    SET username = @username, password = @password, mail = @mail, role = @role, is_active = @is_active, updated_at = datetime('now') 
    WHERE id = @id
  `);
  stmt.run({
    id,
    username: user.username,
    password: hashedPassword,
    mail: user.mail || '',
    role: user.role || 'user',
    is_active: user.is_active ?? true
  });
  db.close();
}


export function deleteUser(id: number): void {
  const db = openDb()
  const stmt = db.prepare("DELETE FROM users WHERE id = ?")
  stmt.run(id)
  db.close()
}
// Initialisation de la base de données à l'importation du module 
if (!fs.existsSync(dbPath)) {
  initDb();
}

