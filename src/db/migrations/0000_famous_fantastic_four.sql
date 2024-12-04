CREATE TYPE "public"."subscription_enum" AS ENUM('free', 'basic', 'premium');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"clerkId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"createAt" date DEFAULT 'now()' NOT NULL,
	"subscriptionType" "subscription_enum" DEFAULT 'free' NOT NULL,
	"subscriptionId" varchar(255) DEFAULT '' NOT NULL,
	"subscriptionItemId" varchar(255) DEFAULT '' NOT NULL,
	CONSTRAINT "users_clerkId_unique" UNIQUE("clerkId"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
