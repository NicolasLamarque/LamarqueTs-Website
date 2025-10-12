// server/db/initArticlesDb.ts
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

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
export function insertArticle(article: Article): void {
  const db = openDb();
  const stmt = db.prepare("INSERT INTO articles (titleArticle, TextArticle, ImageArticle, DatePost, AuthorArticle, CategoryArticle, TagsArticle) VALUES (@titleArticle, @TextArticle, @ImageArticle, @DatePost, @AuthorArticle, @CategoryArticle, @TagsArticle)");
  stmt.run(article.titleArticle, article.TextArticle, article.ImageArticle, article.DatePost, article.AuthorArticle, article.CategoryArticle, article.TagsArticle);
  db.close();
}

export function getAllArticles(): Article[] {
  const db = openDb();
  const stmt = db.prepare("SELECT * FROM articles");
  const articles = stmt.all() as Article[];
  db.close();
  return articles;
}

export function updateArticle(id: number, article: Article): void {
  const db = openDb();
  const stmt = db.prepare("UPDATE articles SET titleArticle = ?, TextArticle = ?, ImageArticle = ?, DatePost = ?, AuthorArticle = ?, CategoryArticle = ?, TagsArticle = ? WHERE id = ?");
  stmt.run({
  titleArticle: article.titleArticle,
  TextArticle: article.TextArticle,
  ImageArticle: article.ImageArticle,
  DatePost: article.DatePost,
  AuthorArticle: article.AuthorArticle,
  CategoryArticle: article.CategoryArticle,
  TagsArticle: article.TagsArticle
});

  db.close();
}

export function deleteArticle(id: number): void {
  const db = openDb();
  const stmt = db.prepare("DELETE FROM articles WHERE id = ?");
  stmt.run(id);
  db.close();
}

if (!fs.existsSync(dbPath)) {
  initArticlesDb();
}
console.log("Articles database initialized.");