// server/api/users/index.get.ts

// 💡 Importation stable des fonctions depuis server/utils/
import { getAllUsers } from "../../utils/users";
import { createError } from "h3"; // Ajout de l'importation de createError

export default defineEventHandler(async () => {
  try {
    // 1. Appel simple à la fonction de service
    const allUsers = await getAllUsers(); // 2. Sécurité : Retirer le mot de passe (Même si getAllUsers ne le sélectionne pas, c'est une bonne pratique)

    const safeUsers = allUsers.map((user) => {
      // Utilisation de la déstructuration pour exclure la propriété 'password'
      const { password, ...safeUser } = user as any; // Assurez la déstructuration correcte
      return safeUser;
    }); // 3. CORRECTION MAJEURE : Retourner la liste (le tableau) directement

    return safeUsers; // Ceci retourne directement le tableau d'utilisateurs [...]
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de tous les utilisateurs:",
      error
    );
    throw createError({
      statusCode: 500,
      statusMessage: "Échec de la récupération de la liste des utilisateurs.",
    });
  }
});
