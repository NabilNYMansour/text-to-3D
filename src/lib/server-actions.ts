"use server";

import * as z from 'zod';
import { ActionResponseType, ControlsType, fonts } from '@/lib/constants-and-types';
import { getProjectPayloadBySlug } from '@/db/crud';
import * as db from '@/db/crud';
import { captureException } from '@sentry/nextjs';

//=========={ User Actions }==========//
export const IsProMember = async (clerkId: string) => {
  const user = await db.getSubscriptionTypeByClerkId(clerkId);
  
  if (user.length < 1) return false;
  
  const userSubscription = user[0].subscriptionType;
  if (userSubscription === "pro") return true;
  
  return false;
}

//=========={ Project Actions }==========//
const zodNameActionSchema = z.object({
  clerkId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
});
export const UpdateName = async (clerkId: string, slug: string, name: string): Promise<ActionResponseType> => {
  try {
    zodNameActionSchema.parse({ clerkId, name, slug });
  } catch (error) {
    return { error: "Invalid input: " + error };
  }

  const project = await getProjectPayloadBySlug(slug);
  if (project.length < 1) return { error: "Project not found" };
  const projectClerkId = project[0].clerkId;
  if (clerkId !== projectClerkId) return { error: "Unauthorized" };

  await db.updateProjectNameBySlug(slug, name.trim());
  return { success: true };
}

const zodControlsActionSchema = z.object({
  clerkId: z.string().min(1),
  slug: z.string().min(1),
});
export const UpdateControls = async (clerkId: string, slug: string, payload: ControlsType): Promise<ActionResponseType> => {
  try {
    zodControlsActionSchema.parse({ clerkId, slug });
  } catch (error) {
    return { error: "Invalid input: " + error };
  }

  const project = await getProjectPayloadBySlug(slug);
  if (project.length < 1) return { error: "Project not found" };
  const projectClerkId = project[0].clerkId;
  if (clerkId !== projectClerkId) return { error: "Unauthorized" };

  await db.updateProjectPayloadBySlug(slug, payload);
  return { success: true };
}

const zodDeleteActionSchema = z.object({
  clerkId: z.string().min(1),
  slug: z.string().min(1),
});
export const DeleteProject = async (clerkId: string, slug: string): Promise<ActionResponseType> => {

  try {
    zodDeleteActionSchema.parse({ clerkId, slug });
  } catch (error) {
    return { error: "Invalid input: " + error };
  }

  const project = await db.getProjectPayloadBySlug(slug);
  if (project.length < 1) return { error: "Project not found" };
  const projectClerkId = project[0].clerkId;
  if (clerkId !== projectClerkId) return { error: "Unauthorized" };

  await db.deleteProjectBySlug(slug);
  return { success: true };
}

//=========={ Font Actions }==========//
const zodFontActionSchema = z.object({
  clerkId: z.string().min(1),
  url: z.string().min(1),
  name: z.string().min(1),
});
export const ChangeFontName = async (clerkId: string, url: string, name: string): Promise<ActionResponseType> => {
  try {
    zodFontActionSchema.parse({ clerkId, url, name });
  } catch (error) {
    return { error: "Invalid input: " + error };
  }

  const font = await db.getFontByUrl(clerkId, url);
  if (font.length < 1) return { error: "Font not found" };

  const userFonts = await db.getFontsByClerkId(clerkId);
  const fontNames = userFonts.map((font) => font.name);
  if (fontNames.includes(name.trim())) return { error: "Font with this name already exists" };

  await db.updateFontNameByUrl(clerkId, url, name.trim());
  return { success: true };
}

const zodFontDeleteActionSchema = z.object({
  clerkId: z.string().min(1),
  url: z.string().min(1),
});
export const DeleteFont = async (clerkId: string, url: string): Promise<ActionResponseType> => {
  try {
    zodFontDeleteActionSchema.parse({ clerkId, url });
  } catch (error) {
    return { error: "Invalid input: " + error };
  }

  const font = await db.getFontByUrl(clerkId, url);
  if (font.length < 1) return { error: "Font not found" };

  await db.deleteFontByUrl(clerkId, url);
  return { success: true };
}

//=========={ Font Check }==========//
export const CheckFont = async (clerkId: string, slug: string, payload: ControlsType) => {
  if (fonts.map((font) => font.url).includes(payload.font.url)) return; // no need to check default fonts
  try {
    const response = await fetch(payload.font.url);
    if (!response.ok) {
      captureException(new Error(`Font file not found: ${payload.font.name}`));
      await db.deleteFontByUrl(clerkId, payload.font.url);
      payload.font = fonts[0];
      UpdateControls(clerkId, slug, payload);
    }
  } catch (error) {
    captureException(error);
    await db.deleteFontByUrl(clerkId, payload.font.url);
    payload.font = fonts[0];
    UpdateControls(clerkId, slug, payload);
  }
}