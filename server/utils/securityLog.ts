// ============================================================================
// server/utils/securityLog.ts — Journal de sécurité
// ============================================================================
//
// CE QUE CE JOURNAL N'EST PAS
// ---------------------------
// Ce n'est pas un outil de mesure d'audience. Aucune visite de page, aucun
// parcours de visiteur, aucun contenu de formulaire n'y est enregistré.
//
// Depuis que l'API est fermée par défaut, le trafic normal ne produit
// jamais d'entrée ici : lire le blog ou envoyer le formulaire de contact
// passe par des routes autorisées, donc aucun refus n'est déclenché. Il ne
// reste que deux catégories d'événements :
//
//   1. les connexions au tableau de bord — les tiennes, ou celles des
//      comptes que tu as créés ;
//   2. les tentatives d'accès à une route protégée.
//
// Chaque ligne est donc un signal, pas du bruit. C'est l'inverse d'un
// journal de serveur classique, où les vrais signaux se noient dans le
// trafic ordinaire.
//
// POURQUOI IL EST NÉCESSAIRE
// --------------------------
// PostgreSQL ne peut pas répondre à la question « qui a lu cette table ? » :
// l'application s'y connecte avec un compte SQL unique, à travers un pooler.
// Toutes les requêtes du monde y ressemblent au même utilisateur. L'identité
// n'existe qu'au niveau applicatif — donc ici.
// ============================================================================

import { db } from './db'
import { security_log } from './schema'
import { sql } from 'drizzle-orm'
import type { H3Event } from 'h3'
import { getRequestIP, getRequestHeader } from 'h3'

/** Types d'événements enregistrés. */
export type EvenementSecurite = 'login_ok' | 'login_fail' | 'denied'

/** Durée de conservation. Au-delà, les lignes sont effacées. */
const RETENTION_JOURS = 90

// ---------------------------------------------------------------------------
// Protection contre l'inondation
// ---------------------------------------------------------------------------
// Écrire une ligne à chaque refus est une amplification : un robot qui
// martèle le site pourrait remplir la base à lui seul. On plafonne donc le
// nombre d'écritures par adresse IP et par fenêtre de temps.
//
// Le compteur vit en mémoire. Sur un hébergement sans état comme Vercel,
// chaque instance a le sien, donc le plafond réel est un multiple du plafond
// configuré — c'est volontaire : un compteur partagé demanderait une lecture
// en base avant chaque écriture, soit exactement le coût qu'on cherche à
// éviter. L'ordre de grandeur suffit à empêcher le remplissage.
const PLAFOND_PAR_IP = 12
const FENETRE_MS = 10 * 60 * 1000 // 10 minutes

const compteurs = new Map<string, { nombre: number; expire: number }>()

function plafondAtteint(ip: string): boolean {
  const maintenant = Date.now()
  const actuel = compteurs.get(ip)

  if (!actuel || actuel.expire < maintenant) {
    compteurs.set(ip, { nombre: 1, expire: maintenant + FENETRE_MS })
    return false
  }

  actuel.nombre += 1
  return actuel.nombre > PLAFOND_PAR_IP
}

/**
 * Vide périodiquement les compteurs expirés.
 *
 * Sans ça, la Map grossirait indéfiniment sur une instance de longue durée :
 * une entrée par adresse IP rencontrée, jamais libérée.
 */
function nettoyerCompteurs() {
  const maintenant = Date.now()
  for (const [ip, valeur] of compteurs) {
    if (valeur.expire < maintenant) compteurs.delete(ip)
  }
}

/** Tronque une valeur à la longueur de sa colonne, pour ne jamais faire échouer l'insertion. */
function tronquer(valeur: string | null | undefined, max: number): string | null {
  if (!valeur) return null
  return valeur.length > max ? valeur.slice(0, max) : valeur
}

/**
 * Enregistre un événement de sécurité.
 *
 * Ne lève JAMAIS d'exception et n'est jamais attendue par l'appelant : la
 * journalisation est une observation, pas une étape du traitement. Si elle
 * échoue, la requête doit se poursuivre exactement comme avant.
 */
export function journaliserSecurite(
  event: H3Event,
  type: EvenementSecurite,
  details: { username?: string | null } = {}
): void {
  // `xForwardedFor` est indispensable derrière un hébergeur : sans lui, on
  // enregistrerait l'adresse du serveur relais au lieu de celle du visiteur.
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'inconnue'

  if (plafondAtteint(ip)) return

  const ligne = {
    event: type,
    method: tronquer(event.node.req.method, 10),
    path: tronquer((event.node.req.url || '').split('?')[0], 500),
    ip: tronquer(ip, 64),
    username: tronquer(details.username, 255),
    user_agent: tronquer(getRequestHeader(event, 'user-agent'), 400),
  }

  // Volontairement sans `await` : l'écriture part en arrière-plan pour ne pas
  // retarder la réponse. Le `.catch` est obligatoire — sans lui, un échec
  // deviendrait un rejet de promesse non capturé.
  Promise.resolve()
    .then(async () => {
      await db.insert(security_log).values(ligne)

      // Purge d'entretien, déclenchée rarement (environ 1 écriture sur 50)
      // pour éviter d'avoir à programmer une tâche planifiée.
      if (Math.random() < 0.02) {
        nettoyerCompteurs()
        await db.execute(sql`
          DELETE FROM security_log
          WHERE created_at < NOW() - INTERVAL '${sql.raw(String(RETENTION_JOURS))} days'
        `)
      }
    })
    .catch((err) => {
      console.error('Journal de sécurité indisponible :', err)
    })
}
