// ============================================
// server/utils/articles.ts - CORRIGÉ
// ============================================

import { db } from "./db";
import { articles, ArticleSelect } from "./schema"; // ✅ IMPORT MANQUANT
import { eq, desc } from "drizzle-orm";

// ========================================
// TYPES
// ========================================

/** Type pour l'insertion d'un nouvel article */
export type ArticleInsert = typeof articles.$inferInsert;

// ========================================
// FONCTIONS CRUD
// ========================================

/**
 * Insère un nouvel article dans la base de données.
 */
export async function insertArticle(article: ArticleInsert): Promise<ArticleSelect> {
  const [newArticle] = await db.insert(articles)
    .values({
      ...article,
      updated_at: new Date(),
    })
    .returning();
  
  return newArticle;
}

/**
 * Récupère tous les articles, triés par date de publication décroissante.
 */
export async function getAllArticles(): Promise<ArticleSelect[]> {
  const allArticles = await db.select()
    .from(articles)
    .orderBy(desc(articles.DatePost)); // ✅ Plus récents en premier
  
  console.log('📊 Articles récupérés depuis DB:', allArticles.length);
  
  return allArticles;
}

/**
 * Récupère un article par son ID.
 */
export async function getArticleById(id: number): Promise<ArticleSelect | undefined> {
  const [article] = await db.select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);
  
  return article;
}

/**
 * Met à jour un article existant.
 */
export async function updateArticle(
  id: number, 
  articleData: Partial<ArticleInsert>
): Promise<ArticleSelect | undefined> {
  const [updatedArticle] = await db.update(articles)
    .set({
      ...articleData,
      updated_at: new Date(),
    })
    .where(eq(articles.id, id))
    .returning();
  
  return updatedArticle;
}

/**
 * Supprime un article par son ID.
 */
export async function deleteArticle(id: number): Promise<ArticleSelect | undefined> {
  console.log('🗑️ Tentative de suppression de l\'article ID:', id);
  
  const [deletedArticle] = await db.delete(articles)
    .where(eq(articles.id, id))
    .returning();
  
  if (deletedArticle) {
    console.log('✅ Article supprimé:', deletedArticle.id);
  } else {
    console.log('❌ Article non trouvé pour suppression');
  }
  
  return deletedArticle;
}