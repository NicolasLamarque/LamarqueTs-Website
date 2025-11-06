// drizzle/seed.ts
import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';

// Configuration directe de la DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seed() {
  console.log("🚀 Début du seeding...");
  
  const client = await pool.connect();
  
  try {
    // 1. Vérifier si l'admin existe
    const checkResult = await client.query(
      "SELECT * FROM users WHERE email = $1",
      ["lamarquets@outlook.com"]
    );
    
    if (checkResult.rows.length > 0) {
      console.log("✅ L'utilisateur admin existe déjà.");
      return;
    }
    
    // 2. Hasher le mot de passe
    const hashedPassword = bcrypt.hashSync("20195", 10);
    
    // 3. INSERT simple
    const result = await client.query(
      `INSERT INTO users (username, email, password, role, is_active) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      ["nil", "lamarquets@outlook.com", hashedPassword, "admin", true]
    );
    
    console.log("✨ Utilisateur admin créé avec succès!");
    console.log("   📧 Email: lamarquets@outlook.com");
    console.log("   🔑 Mot de passe: 20195");
    console.log("   🆔 ID:", result.rows[0].id);
    
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    console.error("Détails:", err);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

seed();