import { db } from "~/server/utils/db";
import { sql } from "drizzle-orm";

// Interfaces pour typer les résultats SQL
interface TableStat {
  schema?: string;
  name?: string;
  size_bytes?: number | string;
  column_count?: number | string;
}

interface CountResult {
  count?: number | string;
}

interface UpdateResult {
  last_updated?: Date | string | null;
}

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les statistiques de toutes les tables
    const tablesStats = await db.execute(sql`
      SELECT 
        schemaname as schema,
        tablename as name,
        pg_total_relation_size(quote_ident(schemaname)||'.'||quote_ident(tablename))::bigint as size_bytes,
        (SELECT count(*) 
         FROM information_schema.columns 
         WHERE table_schema = schemaname 
         AND table_name = tablename) as column_count
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename NOT LIKE 'pg_%'
      AND tablename NOT LIKE 'sql_%'
      ORDER BY tablename
    `) as TableStat[];

    // Pour chaque table, compter les enregistrements
    const tablesWithCounts = await Promise.all(
      tablesStats.map(async (table) => {
        try {
          const countResult = await db.execute(
            sql.raw(`SELECT COUNT(*) as count FROM "${table.name}"`)
          ) as CountResult[];
          
          const recordCount = countResult[0]?.count 
            ? parseInt(String(countResult[0].count)) 
            : 0;
          
          // Récupérer la dernière date de modification
          let lastUpdated: string | null = null;
          
          try {
            const updateResult = await db.execute(
              sql.raw(`
                SELECT MAX(updated_at) as last_updated 
                FROM "${table.name}" 
                WHERE updated_at IS NOT NULL
              `)
            ) as UpdateResult[];
            
            lastUpdated = updateResult[0]?.last_updated 
              ? String(updateResult[0].last_updated) 
              : null;
          } catch {
            // Si pas de colonne updated_at, essayer created_at
            try {
              const createResult = await db.execute(
                sql.raw(`
                  SELECT MAX(created_at) as last_updated 
                  FROM "${table.name}" 
                  WHERE created_at IS NOT NULL
                `)
              ) as UpdateResult[];
              
              lastUpdated = createResult[0]?.last_updated 
                ? String(createResult[0].last_updated) 
                : null;
            } catch {
              lastUpdated = null;
            }
          }

          return {
            name: table.name || '',
            schema: table.schema || 'public',
            record_count: recordCount,
            size_bytes: table.size_bytes ? parseInt(String(table.size_bytes)) : 0,
            column_count: table.column_count ? parseInt(String(table.column_count)) : 0,
            last_updated: lastUpdated
          };
        } catch (error) {
          console.error(`Erreur pour la table ${table.name}:`, error);
          return {
            name: table.name || '',
            schema: table.schema || 'public',
            record_count: 0,
            size_bytes: table.size_bytes ? parseInt(String(table.size_bytes)) : 0,
            column_count: table.column_count ? parseInt(String(table.column_count)) : 0,
            last_updated: null
          };
        }
      })
    );

    return tablesWithCounts;
  } catch (error) {
    console.error("Erreur lors de la récupération des tables:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des statistiques des tables"
    });
  }
});