import { put } from '@vercel/blob'

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

    // Upload vers Vercel BLOB
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
    throw createError({
      statusCode: 500,
      message: error.message || 'Erreur lors de l\'upload'
    })
  }
})