
//  schema.ts



import { pgTable, serial, text, varchar, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";




// ========================================
// TABLE USERS
// ========================================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  mail: text("mail"),
  role: text("role").default("user"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at"),
  last_login: timestamp("last_login"),
  profile_picture: text("profile_picture"),
  bio: text("bio"),
  reset_token: text("reset_token"),
  reset_token_expiry: timestamp("reset_token_expiry"),
  email_verified: boolean("email_verified").default(false),
  email_verification_token: text("email_verification_token"),
  preferences: text("preferences"),
  two_factor_enabled: boolean("two_factor_enabled").default(false),
  two_factor_secret: text("two_factor_secret"),
  oauth_provider: text("oauth_provider"),
  oauth_id: text("oauth_id"),
  oauth_token: text("oauth_token"),
});

// ========================================
// TABLE SERVICES
// ========================================
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }),
  link: varchar("link", { length: 255 }),
  color: varchar("color", { length: 255 }),
  tags: varchar("tags", { length: 255 }),
  contenu: text("contenu"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at"),
  deleted_at: timestamp("deleted_at"),
  deleted: boolean("deleted").default(false),
  deleted_by: varchar("deleted_by", { length: 255 }),
});

// ========================================
// TABLE ARTICLES
// ========================================
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  titleArticle: varchar("title_article", { length: 500 }).notNull(),
  TextArticle: text("text_article").notNull(),
  DatePost: timestamp("date_post").defaultNow(),
  AuthorArticle: varchar("author_article", { length: 255 }),
  CategoryArticle: varchar("category_article", { length: 255 }),
  ImageArticle: varchar("image_article", { length: 500 }),
  TagsArticle: varchar("tags_article", { length: 500 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at"),
});

// ========================================
// TABLE EVENEMENTS (Calendrier)
// ========================================



export const evenements = pgTable("evenements", {
  id: serial("id").primaryKey(),
    
  // Info de base
  titleEvenement: varchar("title_evenement", { length: 500 }).notNull(),
  TextEvenement: text("text_evenement").notNull(),
    
  // POUR ÉVÉNEMENT SIMPLE
  dateDebut: timestamp("date_debut"),
  heureDebut: varchar("heure_debut", { length: 10 }),
  heureFin: varchar("heure_fin", { length: 10 }),
  allDay: boolean("all_day").default(false),
    
  // POUR ÉVÉNEMENT RÉCURRENT
  isRecurrent: boolean("is_recurrent").default(false),
  rrule: text("rrule"),                        // Règle RRule complète
  duration: varchar("duration", { length: 10 }), // Ex: "08:00" ou "01:30"
  exdate: text("exdate"),                      // Dates exclues
    
  // Autres champs existants
  AuthorEvenement: varchar("author_evenement", { length: 255 }),
  CategoryEvenement: varchar("category_evenement", { length: 255 }),
  color: varchar("color", { length: 50 }),
  location: varchar("location", { length: 500 }),
  status: varchar("status", { length: 50 }).default("confirmed"),

  // === NOUVEAUX CHAMPS (visuels / avatars) ===
  avatarAnimateur: varchar("avatar_animateur", { length: 500 }), 
  // URL ou chemin vers l’image/avatar de l’animateur
  nomAnimateur: varchar("nom_animateur", { length: 255 }), 
  // Optionnel : pour afficher le nom de l’animateur directement
  iconEvenement: varchar("icon_evenement", { length: 255 }), 
  // Ex: "🎨", "🏃‍♂️", "🧘", ou chemin d’icône personnalisée
  themeVisuel: varchar("theme_visuel", { length: 100 }),
  // Optionnel : thème ou style de carte, ex. "teal", "nature", "zen"
  ImageEvenement: varchar("image_evenement", { length: 500 }), 
  // Image d’en-tête ou bannière pour l’événement
  TagsEvenement: varchar("tags_evenement", { length: 500 }),
  // Mots-clés ou catégories supplémentaires pour filtrage
  Link: varchar("link", { length: 500 }),
  // URL ou lien vers le site de l’e-vénement

  

  // Dates de création / mise à jour
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// ========================================
// TABLE CONTACTS_MESSAGES
// ========================================

// Table pour gérer tous les mails/messages reçus

export const contacts_messages = pgTable("contacts_messages", {
  id: serial("id").primaryKey(),

  // Infos sur l’expéditeur
  sender_name: varchar("sender_name", { length: 255 }).notNull(),
  sender_email: varchar("sender_email", { length: 255 }).notNull(),

  // Contenu du message
  message: text("message").notNull(), // contenu (clair ou chiffré)
  encrypted: boolean("encrypted").default(false),
  encryption_algo: varchar("encryption_algo", { length: 50 }), // ex: 'aes-256-gcm'

  // Métadonnées
  category: varchar("category", { length: 100 }).default("general"), // ex: support, feedback
  priority: varchar("priority", { length: 20 }).default("normal"),   // normal, high, urgent

  // Statut de traitement
  status: varchar("status", { length: 50 }).default("new"), // new, read, replied, archived
  assigned_to: varchar("assigned_to", { length: 255 }),     // agent ou admin responsable

  // Historique (JSONB)
  reply_history: jsonb("reply_history").default([]),
  mail_log: jsonb("mail_log").default([]),

  // Soft delete / archivage
  deleted: boolean("deleted").default(false),
  deleted_at: timestamp("deleted_at", { withTimezone: true }),
  deleted_by: varchar("deleted_by", { length: 255 }),

  // Audit
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  last_sent_at: timestamp("last_sent_at", { withTimezone: true }),
});


// ========================================
// TYPES INFÉRÉS (à utiliser dans tes services)
// ========================================

// Services
export type Service = typeof services.$inferSelect;     // ✅ Lecture (lignes existantes)
export type ServiceInsert = typeof services.$inferInsert; // ✅ Insertion (nouvelles lignes)

// Users
export type User = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;

// Articles
export type Article = typeof articles.$inferInsert;
export type ArticleSelect = typeof articles.$inferSelect;

// Événements
export type Evenement = typeof evenements.$inferInsert;
export type EvenementSelect = typeof evenements.$inferSelect;

// Contacts Messages
export type ContactMessage = typeof contacts_messages.$inferInsert;
export type ContactMessageSelect = typeof contacts_messages.$inferSelect;
