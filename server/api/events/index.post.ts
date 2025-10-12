// server/api/evenements/index.post.ts

import { defineEventHandler, createError, H3Error, readBody } from 'h3';
import { insertEvenement, Evenement } from '../../db/initEvenementsDb';


export default defineEventHandler(async (event) => { // 👈 On passe l'objet 'event'
    let nouvelEvenement: Evenement;
    
    // 1. Lire et valider les données envoyées par le client
    try {
        // Lire le corps de la requête de manière ASYNCHRONE
        nouvelEvenement = await readBody<Evenement>(event); 
        
        // ⚠️ Ajoutez ici une validation essentielle (ex: le titre doit exister)
        if (!nouvelEvenement || !nouvelEvenement.titleEvenement) {
             throw createError({ statusCode: 400, message: 'Le titre de l\'événement est requis.' });
        }

    } catch (err) {
        // Attrape les erreurs de validation ou de lecture du corps (JSON mal formé)
        if (err instanceof H3Error) throw err;
        throw createError({ statusCode: 400, message: 'Format de données invalide.' });
    }

    try {
        // 2. Appeler la fonction centralisée d'insertion
        //    Passer l'objet 'nouvelEvenement' en argument
        const result = insertEvenement(nouvelEvenement); 

        // 3. Retourner l'ID ou un message de succès (Code HTTP 201 Created est implicite ici)
        //    (La fonction insertEvenement doit être mise à jour pour retourner l'ID)
        return { 
            success: true, 
            id: result.lastInsertRowid, // Si on met à jour la fonction pour retourner le résultat
            message: "Événement créé avec succès." 
        };

    } catch (err) {
        // 4. Gestion des erreurs DB non-prévues (Erreur 500)
        console.error('Erreur DB lors de l\'insertion:', err);
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne lors de la création de l\'événement.',
        });
    } 
});