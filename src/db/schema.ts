import { date, integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const subscriptionEnum = pgEnum('subscription_enum', ['free', 'basic', 'premium']);
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