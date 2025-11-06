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

  try {
    // Récupérer la structure des colonnes
    const columns = await db.execute(sql`
      SELECT 
        column_name as name,
        data_type as type,
        is_nullable = 'YES' as nullable,
        column_default as default,
        character_maximum_length as max_length
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
      ORDER BY ordinal_position
    `);

    // Récupérer les contraintes (clés primaires, foreign keys, etc.)
    const constraints = await db.execute(sql`
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_schema = 'public'
      AND tc.table_name = ${tableName}
    `);

    // Récupérer les index
    const indexes = await db.execute(sql`
      SELECT
        indexname as name,
        indexdef as definition
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename = ${tableName}
    `);

    return {
      columns: columns || [],
      constraints: constraints || [],
      indexes: indexes || []
    };
  } catch (error) {
    console.error(`Erreur pour la table ${tableName}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur lors de la récupération des détails de la table ${tableName}`
    });
  }
});