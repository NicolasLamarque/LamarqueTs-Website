// server/db/initServicesDb.ts
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbDir = path.join(process.cwd(), "server/db");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = path.join(dbDir, "services.db");
console.log(`Tentative de création de la base de données à : ${dbPath}`);

// Définition du type Service
export interface Service {
  id?: number;
  title: string;
  description: string;
  contenu?: string;
  icon: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  deleted?: boolean;
  deleted_by?: string;
  image?: string;
  link?: string;
  color?: string;
  tags?: string;
}

// Fonction interne pour ouvrir la DB
function openDb() {
  return new Database(dbPath);
}

// Initialise la table 'services'
export function initServicesDb() {
  const db = openDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      contenu TEXT,
      icon TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT,
      deleted_at TEXT,
      deleted BOOLEAN DEFAULT 0,
      deleted_by TEXT,
      image TEXT,
      link TEXT,
      color TEXT,
      tags TEXT
    );
  `);
  db.close();
}

// **Fonctions CRUD pour les services**

export function insertService(service: Service): number {
  const db = openDb();
  try {
    const stmt = db.prepare(`
      INSERT INTO services (
        title, description, icon, image, link, color, tags, contenu, 
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);
    
    const now = new Date().toISOString();
    const info = stmt.run(
      service.title,
      service.description,
      service.icon,
      service.image || null,
      service.link || null,
      service.color || null,
      service.tags || null,
      service.contenu || null,
      now,
      now
    );
    
    return Number(info.lastInsertRowid);
  } finally {
    db.close();
  }
}

export function getAllServices(): Service[] {
  const db = openDb();
  try {
    const stmt = db.prepare('SELECT * FROM services WHERE deleted = 0');
    const services = stmt.all() as Service[];
    return services;
  } finally {
    db.close();
  }
}

export function getServiceById(id: number): Service | undefined {
  const db = openDb();
  try {
    const stmt = db.prepare('SELECT * FROM services WHERE id = ? AND deleted = 0');
    const service = stmt.get(id) as Service | undefined;
    return service;
  } finally {
    db.close();
  }
}


// 🟢 VERSION FINALE ET CORRECTE
export function updateService(id: number, service: Partial<Service>): number {
  const db = openDb();
  try {
    const setFields: string[] = [];
    const params: { [key: string]: any } = { id }; // Démarre avec l'ID pour le WHERE
    
    // 2. Boucler sur les clés de l'objet fourni
    for (const key in service) {
        const value = service [key as keyof Service]; 
    
        // 3. Inclure seulement les champs qui ont une valeur (non undefined/null)
        if (value !== undefined && value !== null) {
            // Utiliser les paramètres nommés @champ
            setFields.push(`${key} = @${key}`);
            params[key] = value; // Ajout de la valeur au paramètre nommé
        }
    }
    
    // 4. Sortir s'il n'y a rien à mettre à jour
    if (setFields.length === 0) return 0;
    
    // Toujours mettre à jour updated_at
    // 💡 REMARQUE: Pas besoin de le mettre dans 'params' car on utilise 'datetime()' dans le SQL
    setFields.push('updated_at = datetime(\'now\')');
    
    // 5. Sortir s'il n'y a rien à mettre à jour
    if (setFields.length === 0) return 0;
    // 6. Préparer la requête SQL dynamique
    const stmt = db.prepare(`
      UPDATE services 
      SET ${setFields.join(', ')} 
      WHERE id = @id
    `);
     
    // 7. Exécution (on passe l'objet 'params' qui contient toutes les clés @champ et @id)
    const result = stmt.run(params);
   
    // Retourner le nombre de changements 
    return result.changes; 

  } finally {
    db.close();
  }
}
export function deleteService(id: number, deletedBy?: string): number {
  const db = openDb();
  try {
    const stmt = db.prepare(`
      UPDATE services 
      SET deleted = 1, 
          deleted_at = @deletedAt,
          deleted_by = @deletedBy
      WHERE id = @id
    `);
    
    const params = {
      deletedAt: new Date().toISOString(),
      deletedBy: deletedBy || null,
      id: id
    };
        const result = stmt.run(params);
        // Retourne le nombre de changements pour une meilleure gestion API
    return result.changes; 
  } finally {
    db.close();
  }
}

export function hardDeleteService(id: number): boolean {
  const db = openDb();
  try {
    const stmt = db.prepare('DELETE FROM services WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  } finally {
    db.close();
  }
}


// Initialisation de la base de données à l'importation du module 
if (!fs.existsSync(dbPath)) 
  initServicesDb();
console.log("Services database initialized.");

