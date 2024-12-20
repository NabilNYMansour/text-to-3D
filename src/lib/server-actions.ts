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

const zodControlsPayloadSchema = z.object({
  text: z.string(),
  font: z.object({
    name: z.string(),
    url: z.string(),
  }),
  height: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  curveSegments: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  size: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  bevelEnabled: z.boolean(),
  bevelOffset: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  bevelSegments: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  bevelSize: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  bevelThickness: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  lineHeight: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  letterSpacing: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  material: z.string(),
  colorOnly: z.boolean(),
  color: z.string(),
  secondColor: z.string(),
  roughness: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  metalness: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  perspective: z.boolean(),
  preset: z.string(),
  background: z.string(),
  backgroundColor: z.string(),
  secondBackgroundColor: z.string(),
  gradientAngle: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  backdropEnabled: z.boolean(),
  backdropColor: z.string(),
  backdropRoughness: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  backdropMetalness: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  lightEnabled: z.boolean(),
  light: z.object({
    intensity: z.number(),
    color: z.string(),
    position: z.array(z.number()),
    minMax: z.array(z.array(z.number())),
    step: z.number(),
  }),
  enableVerticalShadow: z.boolean(),
  verticalShadowOffset: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
    value: z.number(),
  }),
  panels: z.object({
    general: z.object({ opened: z.boolean() }),
    material: z.object({ opened: z.boolean() }),
    bevel: z.object({ opened: z.boolean() }),
    light: z.object({ opened: z.boolean() }),
    scene: z.object({ opened: z.boolean() }),
  }),
});
const zodControlsActionSchema = z.object({
  clerkId: z.string().min(1),
  slug: z.string().min(1),
  payloadString: z.string().min(1).max(512000),
});
export const UpdateControls = async (clerkId: string, slug: string, payload: ControlsType): Promise<ActionResponseType> => {
  try {
    zodControlsActionSchema.parse({ clerkId, slug, payloadString: JSON.stringify(payload) });
    zodControlsPayloadSchema.parse(payload);
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
    console.log(error);
    await db.deleteFontByUrl(clerkId, payload.font.url);
    payload.font = fonts[0];
    UpdateControls(clerkId, slug, payload);
  }
}