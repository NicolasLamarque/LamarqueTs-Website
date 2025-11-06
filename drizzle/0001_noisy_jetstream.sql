CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_article" varchar(500) NOT NULL,
	"text_article" text NOT NULL,
	"date_post" timestamp DEFAULT now(),
	"author_article" varchar(255),
	"category_article" varchar(255),
	"image_article" varchar(500),
	"tags_article" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "db_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" varchar(255) NOT NULL,
	"record_count" integer DEFAULT 0 NOT NULL,
	"size_bytes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "evenements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_evenement" varchar(500) NOT NULL,
	"text_evenement" text NOT NULL,
	"date_debut" timestamp,
	"heure_debut" varchar(10),
	"date_fin" timestamp,
	"heure_fin" varchar(10),
	"all_day" boolean DEFAULT false,
	"author_evenement" varchar(255),
	"group_id" varchar(255),
	"category_evenement" varchar(255),
	"image_evenement" varchar(500),
	"tags_evenement" varchar(500),
	"link" varchar(500),
	"icon" varchar(255),
	"color" varchar(50),
	"is_recurrent" boolean DEFAULT false,
	"recurrent_id" integer,
	"recurrent_rule" text,
	"original_date" timestamp,
	"status" varchar(50) DEFAULT 'confirmed',
	"location" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"icon" varchar(255) NOT NULL,
	"image" varchar(255),
	"link" varchar(255),
	"color" varchar(255),
	"tags" varchar(255),
	"contenu" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"deleted" boolean DEFAULT false,
	"deleted_by" varchar(255)
);
