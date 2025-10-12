// server/api/evenements/getduree.ts
import { defineEventHandler, createError, getQuery } from 'h3';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server/db/evenements.db');

type EvenementRow = {
  dateDebut: string;
  heureDebut: string;
  dateFin: string | null;
  heureFin: string | null;
};

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const id = query.id ? Number(query.id) : null;

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requis (query param)' });
  }

  const db = new Database(dbPath, { readonly: true });
  
  try {
    const row = db
      .prepare("SELECT dateDebut, heureDebut, dateFin, heureFin FROM evenements WHERE id = ?")
      .get(id) as EvenementRow | undefined;

    if (!row || !row.dateFin || !row.heureFin) {
      return { duree: null };
    }

    const debut = new Date(`${row.dateDebut}T${row.heureDebut}`);
    const fin = new Date(`${row.dateFin}T${row.heureFin}`);

    const dureeMs = fin.getTime() - debut.getTime();
    const dureeMinutes = dureeMs / (1000 * 60);

    return { duree: dureeMinutes };
  } catch (err) {
    console.error('Erreur getDuree:', err);
    throw createError({ statusCode: 500, statusMessage: 'Erreur serveur' });
  } finally {
    db.close();
  }
});