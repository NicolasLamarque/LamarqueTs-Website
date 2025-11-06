ALTER TABLE "evenements" ADD COLUMN "rrule" text;--> statement-breakpoint
ALTER TABLE "evenements" ADD COLUMN "duration" varchar(10);--> statement-breakpoint
ALTER TABLE "evenements" ADD COLUMN "exdate" text;--> statement-breakpoint
ALTER TABLE "evenements" DROP COLUMN "date_fin";--> statement-breakpoint
ALTER TABLE "evenements" DROP COLUMN "group_id";--> statement-breakpoint
ALTER TABLE "evenements" DROP COLUMN "image_evenement";--> statement-breakpoint
ALTER TABLE "evenements" DROP COLUMN "tags_evenement";--> statement-breakpoint
ALTER TABLE "evenements" DROP COLUMN "link";--> statement-breakpoint
ALTER TABLE "evenements" DROP COLUMN "icon";--> statement-breakpoint
ALTER TABLE "evenements" DROP COLUMN "recurrent_id";--> statement-breakpoint
ALTER TABLE "evenements" DROP COLUMN "recurrent_rule";--> statement-breakpoint
ALTER TABLE "evenements" DROP COLUMN "original_date";