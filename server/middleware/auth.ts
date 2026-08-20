// ============================================================================
// server/middleware/auth.ts
// Middleware d'authentification — protège les routes sensibles
// ============================================================================
//
// PRINCIPE : TOUT EST FERMÉ PAR DÉFAUT
// ------------------------------------
// Auparavant, ce fichier listait les routes à protéger (/dashboard, /admin)
// et laissait passer tout le reste. Conséquence : chaque route de l'API était
// ouverte à qui la demandait — /api/mail renvoyait les messages de contact
// déchiffrés, /api/users la liste des comptes, et les suppressions
// s'exécutaient sans le moindre jeton.
//
// La logique est désormais inversée : une requête est refusée sauf si elle
// figure explicitement dans la liste des routes publiques ci-dessous.
// L'intérêt est qu'une route ajoutée plus tard est protégée d'office, au
// lieu d'être ouverte par oubli.
//
// LA MÉTHODE COMPTE AUTANT QUE L'URL
// ----------------------------------
// /api/mail illustre pourquoi l'URL seule ne suffit pas :
//   - en POST, c'est le formulaire de contact  -> doit rester public
//   - en GET, c'est la boîte de réception      -> doit être protégé
// Chaque entrée de la liste précise donc les méthodes autorisées.
// ============================================================================

import { defineEventHandler, getCookie, createError } from 'h3'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET non défini')
}

/**
 * Routes accessibles sans être connecté.
 *
 * `exact: true` signifie que l'URL doit correspondre pile, sans sous-chemin.
 * C'est indispensable pour /api/mail : en préfixe, « POST /api/mail » ouvrirait
 * aussi « POST /api/mail/5/reply », et n'importe qui pourrait alors envoyer
 * des réponses depuis la messagerie.
 */
const ROUTES_PUBLIQUES = [
  // --- Connexion ---
  { chemin: '/api/auth/login', methodes: ['POST'], exact: true },
  { chemin: '/api/auth/logout', methodes: ['POST'], exact: true },
  { chemin: '/api/auth/verify', methodes: ['GET'], exact: true },

  // --- Formulaire de contact : envoi d'un message par un visiteur ---
  // Exact, pour ne surtout pas ouvrir /api/mail/:id/reply.
  { chemin: '/api/mail', methodes: ['POST'], exact: true },

  // --- Blog : lecture seule, c'est le contenu public du site ---
  { chemin: '/api/articles', methodes: ['GET'] },

  // --- Événements : lecture seule, information publique ---
  { chemin: '/api/events', methodes: ['GET'] },
]

/** Pages (hors API) accessibles sans être connecté. */
const PAGES_PUBLIQUES = [
  '/login',
  '/_nuxt/',
  '/__nuxt_',
  '/favicon.ico',
  '/sitemap',
  '/robots.txt',
  '/_ipx/',
  '/_vercel/',
]

export default defineEventHandler(async (event) => {
  const urlBrute = event.node.req.url || ''
  const methode = (event.node.req.method || 'GET').toUpperCase()

  // On retire la chaîne de requête avant toute comparaison : sans ça,
  // « /api/mail?x=1 » ne correspondrait à aucune règle.
  // Et on normalise la casse, car le routeur de Nuxt sert la même page quelle
  // que soit la casse — sans ça, une simple majuscule (/Dashboard) suffisait
  // à contourner la vérification.
  const chemin = urlBrute.split('?')[0].toLowerCase()

  const estUneRouteApi = chemin.startsWith('/api/')

  // ---------------------------------------------------------------------
  // 1. Routes internes du framework
  // ---------------------------------------------------------------------
  // Nuxt et ses modules exposent leurs propres routes sous /api/_ :
  // les icônes (/api/_nuxt_icon/...), le contenu, etc. Aucune n'est écrite
  // par nous, aucune ne touche aux données — et les bloquer casserait
  // l'affichage du site. Le préfixe « _ » les distingue sans ambiguïté de
  // nos routes métier (/api/articles, /api/mail...).
  if (chemin.startsWith('/api/_')) {
    return
  }

  // ---------------------------------------------------------------------
  // 2. Pages publiques (hors API)
  // ---------------------------------------------------------------------
  if (!estUneRouteApi) {
    // La page d'accueil et tout le site vitrine restent libres d'accès.
    // Seules les zones d'administration exigent une connexion.
    const zonesPrivees = ['/dashboard', '/admin']
    const estZonePrivee = zonesPrivees.some((zone) => chemin.startsWith(zone))

    if (!estZonePrivee) {
      return
    }
    // Sinon : on tombe dans la vérification du jeton, plus bas.
  } else {
    // -------------------------------------------------------------------
    // 3. Routes API : fermées par défaut, sauf autorisation explicite
    // -------------------------------------------------------------------
    const estPublique = ROUTES_PUBLIQUES.some((regle) => {
      const cheminRegle = regle.chemin.toLowerCase()

      const correspond = regle.exact
        ? chemin === cheminRegle || chemin === cheminRegle + '/'
        : chemin === cheminRegle || chemin.startsWith(cheminRegle + '/')

      return correspond && regle.methodes.includes(methode)
    })

    if (estPublique) {
      return
    }
  }

  // ---------------------------------------------------------------------
  // 4. Vérification du jeton — tout ce qui arrive ici est protégé
  // ---------------------------------------------------------------------
  const token = getCookie(event, 'auth_token')

  if (!token) {
    console.log(`🔒 Accès refusé (aucun jeton) : ${methode} ${urlBrute}`)
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié - Token manquant'
    })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: number
      username: string
      role: string
    }

    // On attache l'utilisateur à la requête : les endpoints peuvent ainsi
    // savoir qui agit, sans revérifier le jeton de leur côté.
    event.context.auth = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    }

  } catch (err) {
    console.log(`🔒 Accès refusé (jeton invalide) : ${methode} ${urlBrute}`)
    throw createError({
      statusCode: 401,
      statusMessage: 'Non authentifié - Token invalide ou expiré'
    })
  }
})
