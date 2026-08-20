// ============================================
// server/api/articles/[id].delete.ts - CORRIGÉ
// ============================================

import { defineEventHandler, getRouterParam, createError } from 'h3';
import { deleteArticle } from '~/server/utils/articles';
import { deleteBlobIfUnused } from '~/server/utils/blob';

export default defineEventHandler(async (event) => {
  try {
    // ✅ CORRECTION : Utiliser getRouterParam au lieu de event.context.params
    const idParam = getRouterParam(event, 'id');
    
    if (!idParam) {
      throw createError({ statusCode: 400, message: 'ID manquant' });
    }
    
    const id = Number(idParam);
    
    if (isNaN(id)) {
      throw createError({ statusCode: 400, message: 'ID invalide' });
    }
    
    console.log('🗑️ Suppression article ID:', id);
    
    const deletedArticle = await deleteArticle(id);
    
    if (!deletedArticle) {
      throw createError({ 
        statusCode: 404, 
        message: `Article ${id} non trouvé` 
      });
    }
    
    console.log('✅ Article supprimé:', deletedArticle.id);

    // L'article n'existe plus, mais son image est toujours dans le Blob.
    // On la supprime pour ne pas laisser un fichier orphelin occuper l'espace.
    // Appelé APRÈS la suppression en base, pour que la vérification
    // « encore utilisée ailleurs ? » ne retombe pas sur l'article qu'on vient
    // justement d'effacer.
    await deleteBlobIfUnused(deletedArticle.ImageArticle, `article ${deletedArticle.id} supprimé`);

    return { 
      success: true,
      message: `Article ${deletedArticle.id} supprimé avec succès.`,
      id: deletedArticle.id
    };
    
  } catch (err: any) {
    console.error('❌ Erreur suppression:', err);
    if (err.statusCode) throw err;
    throw createError({ 
      statusCode: 500, 
      message: 'Erreur lors de la suppression de l\'article.' 
    });
  }
});