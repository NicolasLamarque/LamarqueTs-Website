import { defineEventHandler, readBody, createError } from 'h3'
import { insertUser} from '../../utils/users'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Champs requis manquants (username et password).",
    })
  }

  try {
    // 💡 Appel à la fonction qui gère le HASHAGE du mot de passe
    const newUser = await insertUser(body as User)

    if (!newUser) {
      throw createError({
        statusCode: 500,
        statusMessage: "Échec de la création de l'utilisateur.",
      })
    }

    // ✅ La fonction insertUser supprime déjà le mot de passe du retour
    return { user: newUser }

  } catch (error: any) {
    console.error("Erreur lors de l'insertion de l'utilisateur:", error)

    // Gérer le cas d’un doublon (par exemple, username déjà utilisé)
    if (error.message?.includes("duplicate key") || error.code === "23505") {
      throw createError({
        statusCode: 409,
        statusMessage: "Nom d’utilisateur déjà pris.",
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne lors de l'inscription.",
    })
  }
})
