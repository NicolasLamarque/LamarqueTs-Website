// ============================================================================
// server/utils/blob.ts — Nettoyage du stockage d'images (Vercel Blob)
// ============================================================================
//
// POURQUOI CE FICHIER EXISTE
// --------------------------
// Chaque image téléversée part dans Vercel Blob, et c'est son URL qui est
// enregistrée en base (dans un article, un utilisateur, un service ou un
// événement). Jusqu'ici, quand on supprimait un article ou qu'on remplaçait
// son image, la ligne en base changeait bien... mais le FICHIER, lui, restait
// dans le Blob pour toujours : plus aucun lien vers lui, plus aucun moyen de
// le retrouver, et pourtant il continuait d'occuper l'espace du forfait.
// C'est ce qu'on appelle un « orphelin ». Ce module sert à les supprimer.
//
// POURQUOI ON GARDE `addRandomSuffix: true` À L'UPLOAD
// ----------------------------------------------------
// On pourrait croire que le suffixe aléatoire est la cause du problème,
// puisqu'il crée un nouveau fichier à chaque téléversement. En réalité c'est
// une sécurité : sans lui, deux photos différentes appelées toutes les deux
// « IMG_1234.jpg » écraseraient l'une l'autre, et l'image d'un ancien article
// disparaîtrait sans prévenir. Le suffixe reste donc. Ce qui manquait, ce
// n'était pas moins de fichiers créés — c'était le ménage derrière.
//
// PRINCIPE DE PRUDENCE
// --------------------
// Une suppression de fichier est irréversible. Ce module applique donc trois
// garde-fous avant d'effacer quoi que ce soit :
//   1. L'URL doit appartenir à NOTRE stockage Blob. Si quelqu'un a collé à la
//      main l'adresse d'une image hébergée ailleurs, ce n'est pas à nous de
//      la détruire.
//   2. L'URL ne doit plus être référencée nulle part en base. On vérifie les
//      quatre tables qui peuvent contenir une image.
//   3. Un échec de suppression ne doit JAMAIS faire échouer l'opération
//      principale. Si le ménage rate, l'article est quand même supprimé et on
//      se contente de le signaler dans les logs.
// ============================================================================

import { del } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { articles, users, services, evenements } from './schema'

// Toutes nos images vivent sur un sous-domaine de cet hôte.
// Toute URL qui ne s'y trouve pas est considérée comme extérieure : on n'y touche pas.
const BLOB_HOST_SUFFIX = '.public.blob.vercel-storage.com'

/**
 * L'URL désigne-t-elle bien un fichier de NOTRE stockage Blob ?
 *
 * Renvoie `false` pour une chaîne vide, une URL malformée, ou une image
 * hébergée ailleurs (Unsplash, site d'un partenaire, etc.).
 */
export function isManagedBlobUrl(url: unknown): url is string {
  if (typeof url !== 'string' || url.trim() === '') return false

  try {
    const { protocol, hostname } = new URL(url)
    // On exige HTTPS en plus du bon hôte : une URL en http:// ou data: n'a
    // rien à faire ici et ne correspond à aucun fichier qu'on aurait déposé.
    return protocol === 'https:' && hostname.endsWith(BLOB_HOST_SUFFIX)
  } catch {
    // `new URL()` lève une exception si la chaîne n'est pas une URL valide.
    return false
  }
}

/**
 * Cette image est-elle encore utilisée quelque part en base ?
 *
 * On interroge les cinq colonnes du schéma qui peuvent stocker une URL
 * d'image. Dès qu'on en trouve une, on s'arrête : inutile de continuer,
 * le fichier doit être conservé.
 *
 * IMPORTANT — cette fonction doit être appelée APRÈS l'écriture en base
 * (suppression ou mise à jour de la ligne), jamais avant. À ce moment-là
 * l'ancienne référence a déjà disparu, donc si l'URL ressort encore d'une
 * requête, c'est qu'une AUTRE ligne l'utilise vraiment.
 */
async function isBlobUrlStillReferenced(url: string): Promise<boolean> {
  // Chaque entrée = une colonne du schéma pouvant contenir une URL d'image.
  const colonnesImages = [
    { table: articles, colonne: articles.ImageArticle },
    { table: users, colonne: users.profile_picture },
    { table: services, colonne: services.image },
    { table: evenements, colonne: evenements.ImageEvenement },
    { table: evenements, colonne: evenements.avatarAnimateur },
  ] as const

  for (const { table, colonne } of colonnesImages) {
    const [trouve] = await db
      .select({ existe: colonne })
      .from(table)
      .where(eq(colonne, url))
      .limit(1) // on veut juste savoir s'il en existe au moins une

    if (trouve) return true
  }

  return false
}

/**
 * Supprime une image du Blob, mais uniquement si plus personne ne s'en sert.
 *
 * Ne lève jamais d'exception : le nettoyage est un bonus, pas une étape
 * critique. Si quoi que ce soit échoue, on l'écrit dans les logs et la vie
 * continue — l'article aura quand même été supprimé correctement.
 *
 * @param url      L'URL de l'image (peut être null/undefined sans problème)
 * @param contexte Un libellé court pour les logs, ex. "article 12"
 */
export async function deleteBlobIfUnused(
  url: string | null | undefined,
  contexte = 'inconnu'
): Promise<{ supprime: boolean; raison: string }> {
  // Garde-fou 1 — est-ce bien un de nos fichiers ?
  if (!isManagedBlobUrl(url)) {
    return { supprime: false, raison: 'url-externe-ou-vide' }
  }

  try {
    // Garde-fou 2 — quelqu'un s'en sert-il encore ?
    if (await isBlobUrlStillReferenced(url)) {
      console.log(`🔗 Image conservée (encore utilisée ailleurs) — ${contexte}`)
      return { supprime: false, raison: 'encore-referencee' }
    }

    await del(url)
    console.log(`🧹 Image orpheline supprimée du Blob — ${contexte}`)
    return { supprime: true, raison: 'supprimee' }
  } catch (err) {
    // Garde-fou 3 — on n'interrompt jamais l'opération principale pour ça.
    console.error(`⚠️ Nettoyage Blob impossible (${contexte}) :`, err)
    return { supprime: false, raison: 'echec-suppression' }
  }
}
