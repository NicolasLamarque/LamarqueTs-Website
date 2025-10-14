// server/db/initEvenementsDb.ts
import Database,  { RunResult }  from "better-sqlite3";
import fs from "fs";
import path from "path";

// Configuration de la base de données
const dbDir = path.join(process.cwd(), "server/db");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, "CalendarEvents.db");

// Interface pour les événements
export interface Evenement {
  id?: number;
  titleEvenement: string;
  TextEvenement: string;

  // Dates
  dateDebut: string | null;
  heureDebut: string | null;
  dateFin: string | null;
  heureFin: string | null;
  allDay: boolean;

  // Auteur / organisation
  AuthorEvenement: string;
  groupId: string | null;

  // Catégories / visuels
  CategoryEvenement: string | null;
  ImageEvenement: string | null;
  TagsEvenement: string | null;
  link: string | null;
  icon: string | null;
  color: string | null;

  // Récurrence
  isRecurrent: boolean;
  recurrentId: number | null;
  recurrentRule: string | null;
  originalDate: string | null;

  // Suivi
  status: string; // confirmed | tentative | cancelled
  location: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Ouvre une connexion à la base de données
function openDb() {
  return new Database(dbPath);
}

// Initialise la table 'Evenements' si elle n'existe pas
export function initEvenementsDb() {
  const db = openDb(); // Ouverture de la connexion

  try {
    // Exécution du code qui pourrait potentiellement échouer (création de table)
    db.exec(`
      CREATE TABLE IF NOT EXISTS Evenements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        titleEvenement TEXT NOT NULL,
        TextEvenement TEXT NOT NULL,

        -- Dates
        dateDebut TEXT,
        heureDebut TEXT,
        dateFin TEXT,
        heureFin TEXT,
        allDay INTEGER DEFAULT 0,

        -- Auteur / organisation
        AuthorEvenement TEXT,
        groupId TEXT,

        -- Catégories / visuels
        CategoryEvenement TEXT,
        ImageEvenement TEXT,
        TagsEvenement TEXT,
        link TEXT,
        icon TEXT,
        color TEXT,

        -- Récurrence
        isRecurrent INTEGER DEFAULT 0,
        recurrentId INTEGER,
        recurrentRule TEXT,
        originalDate TEXT,

        -- Suivi
        status TEXT DEFAULT 'confirmed',
        location TEXT,

        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } finally {
    // Fermeture garantie de la connexion, quoi qu'il arrive.
    db.close();
  }
}

// --- INSERT ---
export function insertEvenement(evenement: Evenement): RunResult { 
  const db = openDb();// Ouverture de la connexion
  
  try {
    const stmt = db.prepare(`
        INSERT INTO Evenements (
          titleEvenement, TextEvenement, dateDebut, heureDebut, dateFin, heureFin, allDay,
          AuthorEvenement, groupId, CategoryEvenement, ImageEvenement, TagsEvenement, 
          link, icon, color, isRecurrent, recurrentId, recurrentRule, originalDate, status, location
        ) VALUES (
          @titleEvenement, @TextEvenement, @dateDebut, @heureDebut, @dateFin, @heureFin, @allDay,
          @AuthorEvenement, @groupId, @CategoryEvenement, @ImageEvenement, @TagsEvenement, 
          @link, @icon, @color, @isRecurrent, @recurrentId, @recurrentRule, @originalDate, @status, @location
        )
    `);

    // Construction des paramètres pour stmt.run()
    const params = {
        ...evenement,
        allDay: evenement.allDay ? 1 : 0,
        isRecurrent: evenement.isRecurrent ? 1 : 0,
    };
    
    // 🟢 CORRIGÉ : L'instruction retourne explicitement le résultat de l'exécution
    return stmt.run(params) as RunResult; 

  } finally {
    // Fermeture garantie
    db.close();
  }
}

// --- GET ALL ---
// --- GET ALL ---
export function getAllEvenements(): Evenement[] {
  const db = openDb(); // La connexion est ouverte en premier

  try {
    const stmt = db.prepare("SELECT * FROM Evenements");
    // L'exécution se fait dans le try
    const evenements = stmt.all() as Evenement[];
    
    // Le 'return' doit être fait ici, car c'est là que les données existent.
    return evenements; 

  } finally {
    // La fermeture est garantie, peu importe ce qui s'est passé dans le try.
    db.close();
  }
}

// --- GET BY ID ---
// Retourne un seul événement ou 'undefined' s'il n'est pas trouvé.
export function getEvenementById(id: number): Evenement | undefined {
  const db = openDb();
  try {
    const stmt = db.prepare(`
      SELECT *
      FROM Evenements
      WHERE id = ?
    `);
    
    // stmt.get() retourne le premier résultat ou undefined
    const evenement = stmt.get(id) as Evenement | undefined;
    return evenement;
    
  } finally {
    db.close();
  }
}


// --- UPDATE ---
export function updateEvenement(id: number, evenement: Evenement): number {
  const db = openDb(); // La connexion est ouverte ici

  try {
    const stmt = db.prepare(`
      UPDATE Evenements SET
        titleEvenement = @titleEvenement,  -- Uniformisé les alias pour la clarté (voir note 1)
        TextEvenement = @TextEvenement,
        dateDebut = @dateDebut,
        heureDebut = @heureDebut,
        dateFin = @dateFin,
        heureFin = @heureFin,
        allDay = @allDay,
        AuthorEvenement = @AuthorEvenement,
        groupId = @groupId,
        CategoryEvenement = @CategoryEvenement,
        ImageEvenement = @ImageEvenement,
        TagsEvenement = @TagsEvenement,
        link = @link,
        icon = @icon,
        color = @color,
        isRecurrent = @isRecurrent,
        recurrentId = @recurrentId,
        recurrentRule = @recurrentRule,
        originalDate = @originalDate,
        status = @status,
        location = @location,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = @id
    `);

    // 1. Construction des paramètres pour stmt.run()
    const params = {
      id: id,
      ...evenement, // Déverse toutes les propriétés de l'objet 'evenement'
      
      // 2. Écrase les booléens par des entiers pour SQLite
      allDay: evenement.allDay ? 1 : 0,
      isRecurrent: evenement.isRecurrent ? 1 : 0,
    };

    // 3. Exécution et récupération du résultat
    const result = stmt.run(params);

    // 4. Retourne le nombre de lignes modifiées (obligatoire pour le ': number')
    return result.changes; 

  } finally {
    // Fermeture garantie de la connexion
    db.close();
  }
}

// --- DELETE ---
export function deleteEvenement(id: number): number { // Retourne le nombre de lignes changées
  const db = openDb();
  try {
    const stmt = db.prepare("DELETE FROM Evenements WHERE id = @id");
    const result = stmt.run({ id });
    return result.changes; // 👈 Retourne le nombre de changements
  } finally {
    db.close();
  }
}


// --- UPDATE RECURRENT GROUP ---
// Met à jour les propriétés communes de tous les événements d'un groupe récurrent.
// Retourne le nombre de lignes modifiées.
export function updateRecurrentGroup(groupId: string, evenementData: Evenement): number {
  const db = openDb();
  try {
    const stmt = db.prepare(`
      UPDATE Evenements 
      SET titleEvenement = @titleEvenement, TextEvenement = @TextEvenement, AuthorEvenement = @AuthorEvenement, 
          CategoryEvenement = @CategoryEvenement, ImageEvenement = @ImageEvenement, TagsEvenement = @TagsEvenement, 
          link = @link, updatedAt = CURRENT_TIMESTAMP
      WHERE recurrentId = @groupId
    `);
    
    // Construction des paramètres pour la requête SQL
    const params = {
      groupId: groupId, // Utilisé dans la clause WHERE
      // Utiliser les noms complets pour les colonnes mises à jour
      titleEvenement: evenementData.titleEvenement,
      TextEvenement: evenementData.TextEvenement,
      AuthorEvenement: evenementData.AuthorEvenement,
      CategoryEvenement: evenementData.CategoryEvenement,
      ImageEvenement: evenementData.ImageEvenement,
      TagsEvenement: evenementData.TagsEvenement,
      link: evenementData.link,
    };

    const result = stmt.run(params);
    return result.changes; // Retourne le nombre d'événements mis à jour

  } finally {
    db.close();
  }
}

//delete byRecurentId
export function deleteByRecurrentId(recurrentId: number): number {
  const db = openDb();
  try {
    const stmt = db.prepare("DELETE FROM Evenements WHERE recurrentId = @recurrentId");
    const result = stmt.run({ recurrentId });
    return result.changes; // 👈 Retourne le nombre d'événements supprimés'
  } finally {
    db.close();
  }
}

// Initialisation DB si besoin
if (!fs.existsSync(dbPath)) {
  initEvenementsDb();
}
console.log("Evenements database initialized.");
