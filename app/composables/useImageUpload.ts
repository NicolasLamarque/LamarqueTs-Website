// ============================================================================
// app/composables/useImageUpload.ts — Téléversement d'images, avec compression
// ============================================================================
//
// POURQUOI CE FICHIER EXISTE
// --------------------------
// Avant, une photo choisie dans l'admin partait telle quelle vers le stockage :
// une photo sortie d'un téléphone pèse couramment 3 à 6 Mo, et c'est ce poids
// qui était conservé pour toujours, puis renvoyé à chaque visiteur. L'ancien
// contrôle se contentait de REFUSER au-delà de 5 Mo — ce qui était à la fois
// pénible (beaucoup de photos dépassent) et insuffisant (une photo de 4,9 Mo
// passait entière).
//
// Ici, on redimensionne et on recompresse l'image DANS LE NAVIGATEUR avant de
// l'envoyer. Une photo de 5 Mo tombe typiquement à 150–400 Ko, sans différence
// visible : de toute façon elle ne sera jamais affichée au-delà d'environ
// 1600 px de large sur le site.
//
// Trois bénéfices d'un coup : moins d'espace occupé, moins de bande passante
// pour les visiteurs, et un téléversement bien plus rapide.
//
// PRINCIPE DE PRUDENCE
// --------------------
// La compression ne doit jamais empêcher un téléversement. Si quoi que ce soit
// se passe mal (format exotique, image corrompue, navigateur récalcitrant),
// on renvoie le fichier d'origine et l'envoi se poursuit normalement.
// ============================================================================

/** Réglages de compression. Les valeurs par défaut conviennent au site. */
export interface OptionsCompression {
  /** Largeur ou hauteur maximale, en pixels. Au-delà, l'image est réduite. */
  dimensionMax?: number
  /** Qualité de 0 à 1. 0.82 est le bon compromis poids / rendu. */
  qualite?: number
}

/**
 * Formats qu'on ne touche PAS, volontairement :
 *  - GIF : le passer dans un canvas ne garderait que la première image,
 *          l'animation serait perdue.
 *  - SVG : c'est du vectoriel, déjà minuscule ; le rasteriser le dégraderait
 *          tout en l'alourdissant.
 */
const FORMATS_A_NE_PAS_TOUCHER = ['image/gif', 'image/svg+xml']

/** En dessous de ce poids, l'image est déjà légère : inutile d'y toucher. */
const SEUIL_COMPRESSION_OCTETS = 200 * 1024 // 200 Ko

export function useImageUpload() {
  /**
   * Charge le fichier en mémoire sous une forme dessinable sur un canvas.
   *
   * On privilégie `createImageBitmap` avec `imageOrientation: 'from-image'` :
   * c'est lui qui applique la rotation EXIF des photos de téléphone. Sans ça,
   * une photo prise à la verticale ressortirait couchée.
   */
  const chargerImage = async (file: File): Promise<ImageBitmap | HTMLImageElement> => {
    if (typeof createImageBitmap === 'function') {
      try {
        return await createImageBitmap(file, { imageOrientation: 'from-image' })
      } catch {
        // Certains navigateurs plus anciens ne connaissent pas l'option
        // `imageOrientation` et refusent l'appel : on retombe sur la méthode
        // classique juste en dessous.
      }
    }

    // Méthode de repli : passer par une balise <img> et une URL temporaire.
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(url) // libère la mémoire, sinon elle reste retenue
        resolve(img)
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Image illisible'))
      }
      img.src = url
    })
  }

  /** Reconstruit un File propre, avec l'extension qui correspond au contenu. */
  const fabriquerFichier = (blob: Blob, nomOrigine: string, extension: string): File => {
    const nomSansExtension = nomOrigine.replace(/\.[^.]+$/, '') || 'image'
    return new File([blob], nomSansExtension + '.' + extension, { type: blob.type })
  }

  /** Transforme le canvas en fichier, en essayant le WebP puis le JPEG. */
  const canvasVersFichier = (
    canvas: HTMLCanvasElement,
    nomOrigine: string,
    qualite: number
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Conversion du canvas impossible'))
            return
          }

          // Si le navigateur ne sait pas produire de WebP, il renvoie
          // silencieusement du PNG — bien plus lourd pour une photo.
          // On le détecte ici et on repasse en JPEG dans ce cas.
          if (blob.type !== 'image/webp') {
            canvas.toBlob(
              (blobJpeg) => {
                if (!blobJpeg) {
                  reject(new Error('Conversion JPEG impossible'))
                  return
                }
                resolve(fabriquerFichier(blobJpeg, nomOrigine, 'jpg'))
              },
              'image/jpeg',
              qualite
            )
            return
          }

          resolve(fabriquerFichier(blob, nomOrigine, 'webp'))
        },
        'image/webp',
        qualite
      )
    })
  }

  /**
   * Redimensionne et recompresse une image.
   *
   * Renvoie TOUJOURS un fichier utilisable : en cas de souci, c'est le fichier
   * d'origine qui ressort, inchangé.
   */
  const compresserImage = async (
    file: File,
    options: OptionsCompression = {}
  ): Promise<File> => {
    const dimensionMax = options.dimensionMax ?? 1600
    const qualite = options.qualite ?? 0.82

    // Formats qu'on laisse passer intacts (voir la constante plus haut).
    if (FORMATS_A_NE_PAS_TOUCHER.includes(file.type)) return file

    // Déjà légère : la recompresser ne gagnerait presque rien et risquerait
    // même de la dégrader inutilement.
    if (file.size <= SEUIL_COMPRESSION_OCTETS) return file

    try {
      const source = await chargerImage(file)
      const largeurSource = source.width
      const hauteurSource = source.height

      // Facteur de réduction : 1 si l'image tient déjà dans les limites,
      // sinon la proportion nécessaire pour que le plus grand côté fasse
      // exactement `dimensionMax`. On ne l'agrandit jamais.
      const facteur = Math.min(1, dimensionMax / Math.max(largeurSource, hauteurSource))
      const largeur = Math.round(largeurSource * facteur)
      const hauteur = Math.round(hauteurSource * facteur)

      const canvas = document.createElement('canvas')
      canvas.width = largeur
      canvas.height = hauteur

      const ctx = canvas.getContext('2d')
      if (!ctx) return file

      // Fond blanc : si l'image a de la transparence (un PNG) et qu'on finit
      // en JPEG, le transparent deviendrait noir. Le blanc est bien plus sûr.
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, largeur, hauteur)

      ctx.drawImage(source, 0, 0, largeur, hauteur)

      // Libère la mémoire du bitmap dès qu'il est dessiné.
      if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
        source.close()
      }

      const compresse = await canvasVersFichier(canvas, file.name, qualite)

      // Ultime garde-fou : si le résultat est plus lourd que l'original
      // (ça arrive sur des images déjà très optimisées), on garde l'original.
      return compresse.size < file.size ? compresse : file
    } catch (err) {
      console.warn('Compression impossible, envoi du fichier d\'origine :', err)
      return file
    }
  }

  /**
   * Compresse puis téléverse une image. Renvoie l'URL publique du fichier.
   *
   * @param file    Le fichier choisi dans l'input
   * @param options Réglages de compression (facultatif)
   */
  const televerserImage = async (
    file: File,
    options: OptionsCompression = {}
  ): Promise<string> => {
    const fichierPret = await compresserImage(file, options)

    const formData = new FormData()
    formData.append('file', fichierPret)

    const response = await $fetch<{ success: boolean; url: string }>('/api/upload-image', {
      method: 'POST',
      body: formData,
    })

    if (!response.success || !response.url) {
      throw new Error('Le serveur n\'a pas renvoyé d\'URL d\'image')
    }

    return response.url
  }

  /** Affiche un poids en Ko/Mo, pour les messages destinés à l'utilisateur. */
  const formaterPoids = (octets: number): string => {
    if (octets < 1024 * 1024) return Math.round(octets / 1024) + ' Ko'
    return (octets / (1024 * 1024)).toFixed(1) + ' Mo'
  }

  return { compresserImage, televerserImage, formaterPoids }
}
