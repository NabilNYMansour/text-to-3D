"use server";

import { fontsTable, InsertProject, InsertUser, projectsTable, SelectProject, SelectUser, usersTable } from "./schema";
import { db } from '.';
import { and, desc, eq, like, count } from "drizzle-orm";
import { compressControls, ControlsType, decompressControls } from "@/lib/constants-and-types";
import { utapi } from "@/uploadthing/server-side";
import { captureException } from "@sentry/nextjs";

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
    controls: string,
  }>> {
  return await db.select({
    clerkId: projectsTable.clerkId,
    name: projectsTable.name,
    controls: projectsTable.controls,
  }).from(projectsTable).where(eq(projectsTable.slug, slug));
}

export async function deleteProjectBySlug(slug: SelectProject['slug']) {
  await db.delete(projectsTable).where(eq(projectsTable.slug, slug));
}

export async function updateProjectNameBySlug(slug: SelectProject['slug'], name: SelectProject['name']) {
  await db.update(projectsTable).set({ name }).where(eq(projectsTable.slug, slug));
}

export async function updateProjectPayloadBySlug(slug: SelectProject['slug'], payload: ControlsType) {
  await db.update(projectsTable).set({ controls: compressControls(payload) }).where(eq(projectsTable.slug, slug));
}

export async function updateLastOpenedAtBySlug(slug: SelectProject['slug']) {
  await db.update(projectsTable).set({ lastOpenedAt: new Date().toISOString() }).where(eq(projectsTable.slug, slug));
}

export async function getUserProjects(
  clerkId: SelectProject['clerkId'],
  searchTerm: string,
  page: number,
  limit: number,
  latest: boolean = false,
): Promise<Array<{ slug: string, name: string, controls: string }>> {
  const actualPage = Math.max(page - 1, 0);
  const query = db
    .select({ slug: projectsTable.slug, name: projectsTable.name, controls: projectsTable.controls })
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

//=========={ Font }==========//
export async function createFont(clerkId: SelectUser['clerkId'], name: string, url: string, key: string) {
  await db.insert(fontsTable).values({ clerkId, name, url, key });
}

export async function getFontsByClerkId(clerkId: SelectUser['clerkId']): Promise<Array<{ name: string, url: string }>> {
  return await db.select({ name: fontsTable.name, url: fontsTable.url }).from(fontsTable).where(eq(fontsTable.clerkId, clerkId));
}

export async function getFontByUrl(clerkId: SelectUser['clerkId'], url: string): Promise<Array<{ name: string, key: string }>> {
  return await db.select({ name: fontsTable.name, key: fontsTable.key }).from(fontsTable).where(and(eq(fontsTable.clerkId, clerkId), eq(fontsTable.url, url)));
}

export async function deleteFontByKey(clerkId: SelectUser['clerkId'], key: string) {
  await utapi.deleteFiles(key);
  await db.delete(fontsTable).where(and(eq(fontsTable.clerkId, clerkId), eq(fontsTable.key, key)));
}

export async function deleteFontByUrl(clerkId: SelectUser['clerkId'], url: string) {
  const font = await db.select({ key: fontsTable.key }).from(fontsTable).where(and(eq(fontsTable.clerkId, clerkId), eq(fontsTable.url, url)));
  try {
    await utapi.deleteFiles(font[0].key);
  } catch (error) {
    captureException(error);
  }
  await db.delete(fontsTable).where(and(eq(fontsTable.clerkId, clerkId), eq(fontsTable.url, url)));
}

export async function deleteAllFontsByClerkId(clerkId: SelectUser['clerkId']) {
  const fonts = await db.select({ key: fontsTable.key }).from(fontsTable).where(eq(fontsTable.clerkId, clerkId));
  try {
    await utapi.deleteFiles(fonts.map((font) => font.key));
  } catch (error) {
    captureException(error);
  }
  await db.delete(fontsTable).where(eq(fontsTable.clerkId, clerkId));
}

export async function updateFontNameByUrl(clerkId: SelectUser['clerkId'], url: string, name: string) {
  await db.update(fontsTable).set({ name }).where(and(eq(fontsTable.clerkId, clerkId), eq(fontsTable.url, url)));
}