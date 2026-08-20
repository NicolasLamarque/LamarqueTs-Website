// ============================================================================
// server/utils/rateLimit.ts — Limitation des tentatives de connexion
// ============================================================================
//
// LE PROBLÈME
// -----------
// Sans limite, rien n'empêche d'essayer des mots de passe en boucle. Un
// programme peut en tester des milliers par minute ; ce n'est qu'une question
// de temps avant qu'un mot de passe faible ne tombe. C'est le point R-01 de
// l'audit.
//
// LA SOLUTION RETENUE
// -------------------
// On s'appuie sur le journal de sécurité déjà en place : il enregistre déjà
// chaque échec de connexion, avec l'adresse et l'identifiant essayé. Il suffit
// donc de compter — aucune structure supplémentaire n'est nécessaire, et le
// comptage survit à un redémarrage du serveur, contrairement à un compteur
// gardé en mémoire.
//
// DEUX AXES DE COMPTAGE
// ---------------------
// Par adresse IP     : bloque la personne ou le programme qui insiste.
// Par identifiant    : bloque l'acharnement sur UN compte précis, même si les
//                      tentatives viennent d'adresses différentes.
//
// PRUDENCE — NE JAMAIS TE VERROUILLER DEHORS
// ------------------------------------------
// Le seuil est volontairement large et le blocage temporaire. Se tromper trois
// ou quatre fois de mot de passe est normal ; il faut vraiment insister pour
// déclencher la limite, et elle se lève d'elle-même après la fenêtre. Aucun
// compte n'est jamais désactivé de façon permanente.
// ============================================================================

import { db } from './db'
import { sql } from 'drizzle-orm'

/** Nombre d'échecs tolérés dans la fenêtre avant blocage. */
const SEUIL = 10

/** Durée de la fenêtre d'observation, en minutes. */
const FENETRE_MINUTES = 15

export interface ResultatLimite {
  bloque: boolean
  /** Nombre d'échecs comptés dans la fenêtre. */
  echecs: number
  /** Minutes restantes avant que la limite ne se lève. */
  minutesRestantes: number
}

/**
 * Vérifie si les tentatives de connexion doivent être refusées.
 *
 * En cas d'erreur de base de données, on renvoie « non bloqué » : la
 * protection ne doit jamais empêcher une connexion légitime. Un incident sur
 * cette requête ne doit pas te fermer la porte de ton propre site.
 */
export async function verifierLimiteConnexion(
  ip: string,
  username: string
): Promise<ResultatLimite> {
  try {
    // Le delai restant est calcule DANS PostgreSQL, pas en JavaScript.
    //
    // Raison : la colonne created_at est un timestamp sans fuseau. Relue en
    // JavaScript, elle est interpretee comme une heure locale alors qu'elle
    // contient une heure UTC — ce qui ajoutait ici le decalage horaire au
    // delai annonce (255 minutes au lieu de 15, en heure du Quebec).
    // En restant dans la base, les deux dates comparees sont dans le meme
    // referentiel et le calcul est juste quel que soit le fuseau du serveur.
    const [ligne] = (await db.execute(sql`
      SELECT
        count(*)::int AS echecs,
        GREATEST(
          0,
          CEIL(
            EXTRACT(EPOCH FROM (
              MAX(created_at) + (${FENETRE_MINUTES} || ' minutes')::interval - NOW()
            )) / 60
          )
        )::int AS minutes_restantes
      FROM security_log
      WHERE event IN ('login_unknown', 'login_badpass')
        AND created_at > NOW() - (${FENETRE_MINUTES} || ' minutes')::interval
        AND (ip = ${ip} OR username = ${username})
    `)) as any[]

    const echecs = Number(ligne?.echecs ?? 0)

    if (echecs < SEUIL) {
      return { bloque: false, echecs, minutesRestantes: 0 }
    }

    // La limite se leve une fenetre apres la DERNIERE tentative : insister
    // pendant le blocage prolonge l'attente, ce qui decourage l'acharnement.
    const minutesRestantes = Math.max(1, Number(ligne?.minutes_restantes ?? FENETRE_MINUTES))

    return { bloque: true, echecs, minutesRestantes }
  } catch (err) {
    // Priorité à la disponibilité : mieux vaut une protection qui s'efface
    // qu'un site dont le propriétaire ne peut plus entrer.
    console.error('Limitation des tentatives indisponible :', err)
    return { bloque: false, echecs: 0, minutesRestantes: 0 }
  }
}
