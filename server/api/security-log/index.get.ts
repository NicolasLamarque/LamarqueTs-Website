// ============================================================================
// server/api/security-log/index.get.ts — Lecture du journal de sécurité
// ============================================================================
//
// Cette route n'a besoin d'aucune déclaration pour être protégée : elle ne
// figure pas dans la liste blanche du middleware, donc elle exige un jeton
// d'office. C'est précisément l'intérêt du modèle « fermé par défaut » —
// une nouvelle route sensible ne peut pas être oubliée.
// ============================================================================

import { db } from '../../utils/db'
import { security_log } from '../../utils/schema'
import { desc, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Nombre de lignes renvoyées, borné pour ne pas rapatrier tout l'historique
  // d'un coup si le journal grossit.
  const query = getQuery(event)
  const limite = Math.min(Number(query.limite) || 100, 500)

  try {
    const entrees = await db
      .select()
      .from(security_log)
      .orderBy(desc(security_log.created_at))
      .limit(limite)

    // Compteurs par type d'événement et par fenêtre de temps. Calculés en
    // base plutôt qu'en JavaScript : inutile de rapatrier des milliers de
    // lignes pour en compter quelques-unes.
    const [stats] = (await db.execute(sql`
      SELECT
        count(*)::int                                                            AS total,
        count(*) FILTER (WHERE event = 'denied')::int                            AS refus,
        count(*) FILTER (WHERE event = 'login_unknown')::int                     AS comptes_inconnus,
        count(*) FILTER (WHERE event = 'login_badpass')::int                     AS mots_de_passe_faux,
        count(*) FILTER (WHERE event = 'login_blocked')::int                     AS blocages,
        count(*) FILTER (WHERE event = 'login_ok')::int                          AS connexions,
        count(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours')::int    AS dernieres_24h,
        count(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int      AS derniers_7j,
        count(DISTINCT ip)::int                                                  AS ip_distinctes
      FROM security_log
    `)) as any[]

    // Adresses les plus insistantes : c'est le signal le plus parlant pour
    // repérer une tentative répétée plutôt qu'un accès isolé.
    const ipsFrequentes = (await db.execute(sql`
      SELECT ip, count(*)::int AS nombre, max(created_at) AS derniere
      FROM security_log
      WHERE event IN ('denied', 'login_unknown', 'login_badpass', 'login_blocked')
      GROUP BY ip
      HAVING count(*) > 1
      ORDER BY nombre DESC
      LIMIT 10
    `)) as any[]

    return {
      entrees,
      stats: {
        total: stats?.total ?? 0,
        refus: stats?.refus ?? 0,
        comptesInconnus: stats?.comptes_inconnus ?? 0,
        motsDePasseFaux: stats?.mots_de_passe_faux ?? 0,
        blocages: stats?.blocages ?? 0,
        connexions: stats?.connexions ?? 0,
        dernieres24h: stats?.dernieres_24h ?? 0,
        derniers7j: stats?.derniers_7j ?? 0,
        ipDistinctes: stats?.ip_distinctes ?? 0,
      },
      ipsFrequentes,
    }
  } catch (error: any) {
    console.error('Erreur lecture du journal de sécurité :', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la lecture du journal de sécurité',
    })
  }
})
