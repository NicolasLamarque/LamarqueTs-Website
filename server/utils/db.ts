
// server/utils/db.ts

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// ⚠️ 1. SUPPRIMER : Nuxt gère déjà le .env.
// import * as dotenv from "dotenv";
// dotenv.config();

// Récupération de l'URL à partir des variables d'environnement de Nuxt
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    // Une vérification simple pour éviter que l'application ne crash au démarrage
    throw new Error('DATABASE_URL is not defined in environment variables');
}

// 2. Initialisation du client SANS SSL (mode local)
const client = postgres(databaseUrl, { 
    // 💡 Changement CRUCIAL : 'require' devient 'false' pour le local
    ssl: false, 
    
    // Laissez 'prepare: false' si vous en avez besoin (souvent pour de meilleures perfs dans certains cas)
    prepare: false 
}); 

export const db = drizzle(client);