import { InsertUser, SelectUser, usersTable } from "./schema";
import { db } from '.';
import { eq } from "drizzle-orm";

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function getUserIdByClerkId(clerkId: SelectUser['clerkId']): Promise<Array<{ id: number }>> {
  return await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.clerkId, clerkId));
}

export async function deleteUserByClerkId(clerkId: SelectUser['clerkId']) {
  const userId = (await getUserIdByClerkId(clerkId))[0].id;
  await db.delete(usersTable).where(eq(usersTable.id, userId));
}

export async function getClerkIdGivenId(id: SelectUser['id']): Promise<Array<{ clerkId: string }>> {
  return await db.select({ clerkId: usersTable.clerkId }).from(usersTable).where(eq(usersTable.id, id));
}

export async function updateUserSubscription(
  clerkId: SelectUser['clerkId'], 
  subscriptionType: SelectUser['subscriptionType'], 
  subscriptionId: SelectUser['subscriptionId'],
) {
  await db.update(usersTable).set({ subscriptionType, subscriptionId }).where(eq(usersTable.clerkId, clerkId));
}

export async function getSubscriptionTypeByClerkId(clerkId: SelectUser['clerkId']): Promise<Array<{ subscriptionType: string }>> {
  return await db.select({ subscriptionType: usersTable.subscriptionType }).from(usersTable).where(eq(usersTable.clerkId, clerkId));
}

export async function getSubscriptionByClerkId(clerkId: SelectUser['clerkId']): Promise<Array<{ subscriptionId: string }>> {
  return await db.select({ subscriptionId: usersTable.subscriptionId }).from(usersTable).where(eq(usersTable.clerkId, clerkId));
}