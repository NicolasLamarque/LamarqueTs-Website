// server/db/initArticlesDb.ts
import Database,  { RunResult }  from "better-sqlite3";
import fs from "fs";
import path from "path";
import { Result } from "postcss";

const dbDir = path.join(process.cwd(), "server/db");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, "articles.db");

export interface Article {
    id?: number;
    titleArticle?: string;
    TextArticle?: string;
    DatePost?: string;
    AuthorArticle?: string;
    CategoryArticle?: string;
    ImageArticle?: string;
    TagsArticle?: string;
}

function openDb() {
  return new Database(dbPath);
}

// Initialise la table 'articles'
export function initArticlesDb() {
  const db = openDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titleArticle TEXT NOT NULL,
      TextArticle TEXT NOT NULL,
      DatePost TEXT,
      AuthorArticle TEXT,
      CategoryArticle TEXT,
      ImageArticle TEXT,
      TagsArticle TEXT
    );
  `);
  db.close();
}

// Fonctions CRUD pour les articles
export function insertArticle(article: Article): RunResult {
  const db = openDb();
  // 1. Déclarer la variable stmt en dehors du try (pour garantir la portée)
  let stmt; 
  let result: RunResult; // Déclarer le résultat ici pour le retourner après
  try {
     // 2. Préparer la requête (dans le try pour gérer l'erreur de préparation)
    stmt = db.prepare(`
      INSERT INTO articles (titleArticle, TextArticle, ImageArticle, DatePost, AuthorArticle, CategoryArticle, TagsArticle) 
      VALUES (@titleArticle, @TextArticle, @ImageArticle, @DatePost, @AuthorArticle, @CategoryArticle, @TagsArticle)
    `);

     // 3. Préparer les paramètres (avant l'exécution)
    const params = {
      ...article,
      // Note : La colonne created_at/updated_at doit être dans votre table pour que cela fonctionne
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString()
    };
     // 4. Exécuter la requête et stocker le résultat
    result = stmt.run(params) as RunResult;

  } catch (error) {
    // 5. Gérer les erreurs et les laisser remonter à la couche API
    throw error; 
  } finally {
    // 6. Fermer la connexion GARANTIE
    db.close(); 
  }
  // 7. Retourner le résultat après que la connexion est fermée
  return result;
}
 

export function getAllArticles(): Article[] {
  const db = openDb();
try {
    const stmt = db.prepare("SELECT * FROM articles");
   const articles = stmt.all() as Article[];
   return articles;

  } finally { 
  db.close();
}
}

// 🟢 VERSION CORRIGÉE : Mise à Jour Dynamique (la seule façon de gérer Partial<Article>)

export function updateArticle(id: number, article: Partial<Article>): number {
  const db = openDb();
    try {
    // 1. Initialiser la liste des champs à SET et l'objet de paramètres
    const setFields: string[] = [];
    const params: { [key: string]: any } = { id }; // Démarre avec l'ID pour le WHERE
    // 2. Boucler sur les clés de l'objet fourni
    for (const key in article) {
        const value = article[key as keyof Article];
        // 3. Inclure seulement les champs qui ont une valeur (non undefined/null)
        if (value !== undefined && value !== null) {
            // Utiliser les paramètres nommés @champ
            setFields.push(`${key} = @${key}`);
            params[key] = value;
        }
    }    // 4. Sortir s'il n'y a rien à mettre à jour
    if (setFields.length === 0) return 0;
    // 5. Ajouter le champ updated_at
    setFields.push('updated_at = datetime(\'now\')');
    // 6. Préparer la requête SQL dynamique
    const stmt = db.prepare(`
      UPDATE articles 
      SET ${setFields.join(', ')} 
      WHERE id = @id
    `);
    // 7. Exécution
    const result = stmt.run(params);    // Retourner le nombre de changements (plus utile que boolean)
    return result.changes; 
  } finally {
    db.close();
  }
}

export function deleteArticle(id: number): number {
  const db = openDb();
  try {
    const stmt = db.prepare("DELETE FROM articles WHERE id = ?");
    const result = stmt.run({ id });
    return result.changes;
  } finally {
    db.close();
  }

}





if (!fs.existsSync(dbPath)) {
  initArticlesDb();
}
console.log("Articles database initialized.");