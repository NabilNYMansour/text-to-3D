import { date, integer, pgEnum, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const subscriptionEnum = pgEnum('subscription_enum', ['free', 'pro']);
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  createAt: date().notNull().default("now()"),
  subscriptionType: subscriptionEnum().notNull().default('free'),
  subscriptionId: varchar({ length: 255 }).notNull().default(''),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export const projectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull().references(() => usersTable.clerkId),
  name: varchar({ length: 255 }).notNull(),
  controls: varchar({ length: 2550 }).notNull(),
  slug: varchar({ length: 255 }).notNull(),
  createAt: date().notNull().default("now()"),
  lastOpenedAt: timestamp().notNull().defaultNow(),
});

export type InsertProject = typeof projectsTable.$inferInsert;
export type SelectProject = typeof projectsTable.$inferSelect;

export const fontsTable = pgTable("fonts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull().references(() => usersTable.clerkId),
  name: varchar({ length: 255 }).notNull(),
  url: varchar({ length: 255 }).notNull(),
  key: varchar({ length: 255 }).notNull(),
  createAt: date().notNull().default("now()"),
});

export type InsertFont = typeof fontsTable.$inferInsert;
export type SelectFont = typeof fontsTable.$inferSelect;