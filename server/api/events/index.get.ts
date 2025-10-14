// server/api/evenements/index.get.ts

import { defineEventHandler, createError } from 'h3';
import { getAllEvenements, Evenement } from '../../db/initEvenementsDb'; 

export default defineEventHandler(async () => {
    
    try {
        // 🟢 CORRECT : L'appel est dans le try, donc toute erreur est attrapée par le catch
        const evenements: Evenement[] = getAllEvenements();
        
        return evenements;
        
    } catch (err) {
        // L'erreur est attrapée ici et traduite en 500
        console.error('Erreur DB lors de la récupération des événements:', err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne lors de la récupération des événements.',
        });
    }
});