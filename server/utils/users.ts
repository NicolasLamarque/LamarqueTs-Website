
// server/src/users.ts
import { db } from "./db"
import { User, users } from "./schema"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"

// Nombre de "salt rounds" — 10 est un bon compromis
const SALT_ROUNDS = 10

// 🔐 Insertion d’un utilisateur
export async function insertUser(user: User) {
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS)

  const [newUser] = await db
    .insert(users)
    .values({
      ...user,
      password: hashedPassword,
      role: user.role || "user",
      is_active: user.is_active ?? true,
    })
    .returning()

  // On ne retourne **jamais** le mot de passe haché au front
  if (newUser) delete (newUser as any).password
  return newUser
}

// 📋 Récupérer tous les utilisateurs (sans mot de passe)
export async function getAllUsers() {
  return db
    .select({
      id: users.id,
      username: users.username,
      mail: users.mail,
      role: users.role,
      is_active: users.is_active,
    })
    .from(users)
}

// 🔍 Récupérer un utilisateur par ID
export async function getUserById(id: number) {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      mail: users.mail,
      role: users.role,
      is_active: users.is_active,
    })
    .from(users)
    .where(eq(users.id, id))

  return user
}

// ✏️ Mise à jour d’un utilisateur
export async function updateUser(id: number, user: Partial<User>) {
  const updateData: any = { ...user }

  if (user.password) {
    updateData.password = await bcrypt.hash(user.password, SALT_ROUNDS)
  }

  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning()

  if (updatedUser) delete (updatedUser as any).password
  return updatedUser
}

// 🗑️ Suppression d’un utilisateur
export async function deleteUser(id: number) {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning()

  if (deletedUser) delete (deletedUser as any).password
  return deletedUser
}

// 🔎 Authentification : récupérer un utilisateur avec son mot de passe
export async function getUserByUsernameWithPassword(username: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1)

  return user // Contient le hash (⚠️ Ne pas exposer publiquement)
}
