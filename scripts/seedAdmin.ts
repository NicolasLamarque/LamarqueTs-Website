// script/seedDb.ts (ou une autre localisation séparée)
import { openDb } from '../server/db/initLoginDb.ts'; 
import bcrypt from 'bcrypt';

export function seedAdminUser() {
  const db = openDb();
  try {
    const stmt = db.prepare("SELECT username FROM users WHERE username = ?");
    const adminUser = stmt.get("admin");

    if (!adminUser) {
      // ⚠️ Utiliser une variable d'environnement pour le mot de passe en prod
      const defaultPassword = "admin123"; 
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
      
      const insert = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
      insert.run("admin", hashedPassword);
      
      console.log("Utilisateur admin créé (admin / admin123)");
    } else {
      console.log("Utilisateur admin déjà existant, pas de seeding nécessaire.");
    }
  } finally {
    db.close();
  }
}

// 🌐 Optionnel: Appeler la fonction ici pour l'exécution directe du script
seedAdminUser(); 