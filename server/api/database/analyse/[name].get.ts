import { db } from "~/server/utils/db";
import { sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const tableName = getRouterParam(event, 'name');
  
  if (!tableName) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nom de table requis"
    });
  }

  // ---------------------------------------------------------------------
  // Validation du nom de table — indispensable
  // ---------------------------------------------------------------------
  // Plus bas, ce nom est insere dans une requete assemblee par concatenation
  // (sql.raw), car PostgreSQL n'accepte pas de parametre a la place d'un nom
  // de table. Sans le controle ci-dessous, un guillemet double place dans
  // l'adresse refermait l'identifiant et permettait de poursuivre la requete.
  //
  // Le principe retenu est une liste blanche : on demande a la base la liste
  // de ses propres tables, et on n'accepte que les noms qui y figurent
  // EXACTEMENT. Le nom utilise ensuite ne vient donc plus de l'utilisateur,
  // mais de PostgreSQL lui-meme — ce qui rend l'injection impossible plutot
  // que difficile.
  const tablesExistantes = await db.execute(sql`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `);

  const nomValide = (tablesExistantes as any[]).find(
    (t) => t.tablename === tableName
  );

  if (!nomValide) {
    throw createError({
      statusCode: 404,
      statusMessage: "Table inconnue"
    });
  }

  // A partir d'ici, on n'utilise plus la valeur recue mais celle renvoyee par
  // la base : meme en cas d'erreur de comparaison, rien d'arbitraire ne passe.
  const tableSure = String(nomValide.tablename);

  try {
    // Compter les enregistrements totaux
    const totalCount = await db.execute(
      sql.raw(`SELECT COUNT(*) as total FROM "${tableSure}"`)
    );

    const totalRecords = totalCount[0] ? parseInt(String((totalCount[0] as any).total || '0')) : 0;

    // Compter les enregistrements de la dernière semaine
    let weekCount = 0;
    let growth7d = 0;
    
    try {
      const weekResult = await db.execute(
        sql.raw(`
          SELECT COUNT(*) as week_count 
          FROM "${tableSure}" 
          WHERE created_at >= NOW() - INTERVAL '7 days'
        `)
      );
      weekCount = weekResult[0] ? parseInt(String((weekResult[0] as any).week_count || '0')) : 0;
      growth7d = weekCount;
    } catch {
      // Si pas de colonne created_at, ignorer
      weekCount = 0;
      growth7d = 0;
    }

    // Calculer le taux de remplissage (pourcentage de colonnes obligatoires)
    const columnsInfo = await db.execute(sql`
      SELECT 
        COUNT(*) as total_columns,
        COUNT(CASE WHEN is_nullable = 'NO' THEN 1 END) as required_columns
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
    `);

    const totalColumns = columnsInfo[0] ? parseInt(String((columnsInfo[0] as any).total_columns || '0')) : 0;
    const requiredColumns = columnsInfo[0] ? parseInt(String((columnsInfo[0] as any).required_columns || '0')) : 0;
    const fillRate = totalColumns > 0 ? Math.round((requiredColumns / totalColumns) * 100) : 0;

    // Taille de la table
    const sizeResult = await db.execute(sql`
      SELECT pg_total_relation_size(quote_ident('public')||'.'||quote_ident(${tableName}))::bigint as table_size
    `);

    const tableSize = sizeResult[0] ? parseInt(String((sizeResult[0] as any).table_size || '0')) : 0;

    return {
      totalRecords,
      growth7d,
      fillRate,
      weekCount,
      tableSize
    };
  } catch (error) {
    console.error(`Erreur analyse de ${tableSure}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur lors de l'analyse de la table ${tableSure}`
    });
  }
});