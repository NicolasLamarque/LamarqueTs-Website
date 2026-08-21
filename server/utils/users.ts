// server/src/users.ts
import { db } from "./db"
import { User, users } from "./schema"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

// Nombre de "salt rounds" — 10 est un bon compromis
const SALT_ROUNDS = 10

// 🔐 Insertion d'un utilisateur
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
    // Selection complete, volontairement — meme raison que getUserById.
    //
    // Cette fonction ne renvoyait que cinq colonnes. Consequence en cascade :
    // la liste affichee dans l'administration ne contenait ni photo, ni bio,
    // ni preferences. Et comme editUser() remplit le formulaire a partir de
    // CETTE liste, le champ photo arrivait toujours vide — puis etait
    // reenvoye vide a l'enregistrement, ce qui effacait la valeur en base.
    //
    // Une colonne absente d'un SELECT ne provoque aucune erreur : elle vaut
    // simplement undefined. Le defaut se propage donc en silence jusqu'a
    // l'ecran, ou l'on croit a tort que l'enregistrement a echoue.
    //
    // Le mot de passe reste exclu, evidemment.
    .select({
      id: users.id,
      username: users.username,
      mail: users.mail,
      role: users.role,
      is_active: users.is_active,
      bio: users.bio,
      profile_picture: users.profile_picture,
      two_factor_enabled: users.two_factor_enabled,
      preferences: users.preferences,
      created_at: users.created_at,
      updated_at: users.updated_at,
      last_login: users.last_login,
    })
    .from(users)
}

// 🔍 Récupérer un utilisateur par ID
export async function getUserById(id: number) {
  const [user] = await db
    // Selection complete, volontairement.
    //
    // Cette fonction ne renvoyait que cinq colonnes. Le nettoyage des photos
    // orphelines lisait donc `profile_picture` sur un objet qui ne la contenait
    // pas : la valeur etait toujours undefined, et aucune ancienne photo n'a
    // jamais ete supprimee. Un bug silencieux — la fonctionnalite semblait
    // marcher, elle ne faisait rien.
    //
    // Le mot de passe reste evidemment exclu.
    .select({
      id: users.id,
      username: users.username,
      mail: users.mail,
      role: users.role,
      is_active: users.is_active,
      bio: users.bio,
      profile_picture: users.profile_picture,
      two_factor_enabled: users.two_factor_enabled,
      preferences: users.preferences,
      created_at: users.created_at,
      updated_at: users.updated_at,
      last_login: users.last_login,
    })
    .from(users)
    .where(eq(users.id, id))

  return user
}

// ✏️ Mise à jour d'un utilisateur
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

// 🗑️ Suppression d'un utilisateur
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