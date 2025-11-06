// server/utils/services.ts
import { db } from "./db";
import { services, Service } from "./schema";
import { eq } from 'drizzle-orm';

// Types pour la clarté :
export type NewService = typeof services.$inferInsert; // 🎯 Pour l'insertion

export type UpdateService = Partial<NewService>;       // 🎯 Pour la mise à jour
/**
 * Insérer un nouveau service
 */
export async function insertService(service: NewService) {
  const [newService] = await db.insert(services)
    .values({
      ...service,
      updated_at: new Date(),
    })
    .returning();
  
  return newService;
}

/**
 * Récupérer tous les services (non supprimés)
 */
export async function getAllServices() {
  return db.select()
    .from(services)
    .where(eq(services.deleted, false))
    .orderBy(services.created_at);
}

/**
 * Récupérer un service par ID
 */
export async function getServiceById(id: number) {
  const [service] = await db.select()
    .from(services)
    .where(eq(services.id, id));
  
  return service;
}

/**
 * Mettre à jour un service
 */
export async function updateService(id: number, service: Partial<Service>) {
  const [updatedService] = await db.update(services)
    .set({
      ...service,
      updated_at: new Date(),
    })
    .where(eq(services.id, id))
    .returning();
  
  return updatedService;
}

/**
 * Soft delete - Marquer un service comme supprimé
 */
export async function deleteService(id: number, deletedBy?: string) {
  const [deletedService] = await db.update(services)
    .set({
      deleted: true,
      deleted_at: new Date(),
      deleted_by: deletedBy || null,
    })
    .where(eq(services.id, id))
    .returning();
  
  return deletedService;
}

/**
 * Hard delete - Supprimer définitivement un service
 */
export async function hardDeleteService(id: number) {
  const [deletedService] = await db.delete(services)
    .where(eq(services.id, id))
    .returning();
  
  return deletedService;
}

/**
 * Récupérer tous les services incluant ceux supprimés
 */
export async function getAllServicesIncludingDeleted() {
  return db.select()
    .from(services)
    .orderBy(services.created_at);
}

/**
 * Restaurer un service supprimé
 */
export async function restoreService(id: number) {
  const [restoredService] = await db.update(services)
    .set({
      deleted: false,
      deleted_at: null,
      deleted_by: null,
      updated_at: new Date(),
    })
    .where(eq(services.id, id))
    .returning();
  
  return restoredService;
}