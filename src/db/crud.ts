"use server";

import { InsertProject, InsertUser, projectsTable, SelectProject, SelectUser, usersTable } from "./schema";
import { db } from '.';
import { and, desc, eq, like, count } from "drizzle-orm";
import { ControlsType } from "@/lib/constants-and-types";

//=========={ User }==========//
export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function getUserIdByClerkId(clerkId: SelectUser['clerkId']): Promise<Array<{ id: number }>> {
  return await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.clerkId, clerkId));
}

export async function deleteUserByClerkId(clerkId: SelectUser['clerkId']) {
  await db.delete(projectsTable).where(eq(projectsTable.clerkId, clerkId));
  await db.delete(usersTable).where(eq(usersTable.clerkId, clerkId));
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

//=========={ Project }==========//
export async function createProject(data: InsertProject) {
  await db.insert(projectsTable).values(data);
}

export async function getProjectPayloadBySlug(slug: SelectProject['slug']):
  Promise<Array<{
    clerkId: string,
    name: string,
    payload: ControlsType,
  }>> {
  return await db.select({
    clerkId: projectsTable.clerkId,
    name: projectsTable.name,
    payload: projectsTable.payload,
  }).from(projectsTable).where(eq(projectsTable.slug, slug));
}

export async function deleteProjectBySlug(slug: SelectProject['slug']) {
  await db.delete(projectsTable).where(eq(projectsTable.slug, slug));
}

export async function updateProjectNameBySlug(slug: SelectProject['slug'], name: SelectProject['name']) {
  await db.update(projectsTable).set({ name }).where(eq(projectsTable.slug, slug));
}

export async function updateProjectPayloadBySlug(slug: SelectProject['slug'], payload: SelectProject['payload']) {
  await db.update(projectsTable).set({ payload }).where(eq(projectsTable.slug, slug));
}

export async function updateLastOpenedAtBySlug(slug: SelectProject['slug']) {
  await db.update(projectsTable).set({ lastOpenedAt: new Date() }).where(eq(projectsTable.slug, slug));
}

export async function getUserProjects(
  clerkId: SelectProject['clerkId'],
  searchTerm: string,
  page: number,
  limit: number,
  latest: boolean = false,
): Promise<Array<{ slug: string, name: string, payload: ControlsType }>> {
  const actualPage = Math.max(page - 1, 0);
  const query = db
    .select({ slug: projectsTable.slug, name: projectsTable.name, payload: projectsTable.payload })
    .from(projectsTable)
    .where(and(eq(projectsTable.clerkId, clerkId), like(projectsTable.name, `%${searchTerm}%`)))
    .limit(limit)
    .offset(actualPage * limit);

  if (latest) {
    query.orderBy(desc(projectsTable.lastOpenedAt));
  }

  return await query;
}

export async function getUserProjectsCount(clerkId: SelectProject['clerkId'], searchTerm: string): Promise<Array<{ count: number }>> {
  return await db
    .select({ count: count() })
    .from(projectsTable)
    .where(and(eq(projectsTable.clerkId, clerkId), like(projectsTable.name, `%${searchTerm}%`)));
}