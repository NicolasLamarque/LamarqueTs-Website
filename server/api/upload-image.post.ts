// ============================================================================
// server/api/upload-image.post.ts — Réception et stockage d'une image
// ============================================================================
//
// La compression a lieu côté navigateur (voir app/composables/useImageUpload.ts),
// parce que c'est là qu'elle est la plus efficace : le fichier est allégé AVANT
// de transiter sur le réseau.
//
// Mais le navigateur ne peut pas être la seule barrière : n'importe qui peut
// appeler cette route directement. Le plafond ci-dessous est donc le vrai
// garde-fou, celui qui protège l'espace de stockage quoi qu'il arrive.
// ============================================================================

import { put } from '@vercel/blob'

// Plafond volontairement large : les images normales arrivent compressées,
// autour de quelques centaines de Ko. Ce seuil ne sert qu'à bloquer
// l'anormal (un fichier envoyé sans passer par l'interface, par exemple).
const TAILLE_MAX_OCTETS = 25 * 1024 * 1024 // 25 Mo

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)

    if (!form || !form[0]) {
      throw createError({
        statusCode: 400,
        message: 'Aucun fichier trouvé'
      })
    }

    const file = form[0]

    // Vérifier que c'est une image
    if (!file.type?.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        message: 'Le fichier doit être une image'
      })
    }

    // Garde-fou de taille — le seul qui compte vraiment, car il ne dépend pas
    // du navigateur. Sans lui, un fichier de 200 Mo pourrait atterrir dans le
    // stockage et y rester.
    if (file.data.length > TAILLE_MAX_OCTETS) {
      const poidsMo = (file.data.length / (1024 * 1024)).toFixed(1)
      throw createError({
        statusCode: 413, // 413 = Payload Too Large
        message: `Image trop volumineuse (${poidsMo} Mo, maximum 25 Mo)`
      })
    }

    // Upload vers Vercel BLOB
    //
    // `addRandomSuffix: true` est volontaire et doit le rester : sans lui,
    // deux photos différentes nommées toutes deux « IMG_1234.jpg » se
    // remplaceraient l'une l'autre, et l'image d'un ancien article
    // disparaîtrait sans prévenir.
    // Le revers — des fichiers qui s'accumulent — est traité ailleurs :
    // server/utils/blob.ts supprime les images devenues orphelines quand un
    // article ou un utilisateur est supprimé ou change d'image.
    const blob = await put(file.filename || 'image.png', file.data, {
      access: 'public',
      addRandomSuffix: true
    })

    return {
      success: true,
      url: blob.url
    }

  } catch (error: any) {
    console.error('Erreur upload:', error)

    // On relaie les erreurs déjà explicites (400, 413...) telles quelles,
    // sinon le message utile serait remplacé par un 500 générique.
    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      message: error.message || 'Erreur lors de l\'upload'
    })
  }
})
