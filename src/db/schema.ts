// import { date, integer, pgEnum, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";


export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey(),
  clerkId: text('clerkId').unique().notNull(),
  name: text('name').notNull(),
  createAt: text().default(sql`(CURRENT_DATE)`),
  subscriptionType: text().notNull().default('free'),
  subscriptionId: text().notNull().default(''),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export const projectsTable = sqliteTable("projects", {
  id: integer("id").primaryKey(),
  clerkId: text('clerkId').notNull().references(() => usersTable.clerkId),
  name: text('name').notNull(),
  controls: text('controls').notNull(),
  slug: text('slug').notNull(),
  createAt: text().default(sql`(CURRENT_DATE)`),
  lastOpenedAt: text().default(sql`(CURRENT_DATE)`),
});

export type InsertProject = typeof projectsTable.$inferInsert;
export type SelectProject = typeof projectsTable.$inferSelect;

export const fontsTable = sqliteTable("fonts", {
  id: integer("id").primaryKey(),
  clerkId: text('clerkId').notNull().references(() => usersTable.clerkId),
  name: text('name').notNull(),
  url: text('url').notNull(),
  key: text('key').notNull(),
  createAt: text().default(sql`(CURRENT_DATE)`),
});

export type InsertFont = typeof fontsTable.$inferInsert;
export type SelectFont = typeof fontsTable.$inferSelect;