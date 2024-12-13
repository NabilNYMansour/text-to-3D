"use server";

import * as z from 'zod';
import { ControlsType } from '@/lib/constants-and-types';
import { getProjectPayloadBySlug } from '@/db/crud';
import * as db from '@/db/crud';

//=========={ Project Actions }==========//
export type ActionResponseType = { error: string; success?: undefined; } | { success: boolean; error?: undefined; };

const zodNameActionSchema = z.object({
  clerkId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
});
export const UpdateName = async (clerkId: string, slug: string, name: string): Promise<ActionResponseType> => {
  try {
    zodNameActionSchema.parse({ clerkId, name, slug });
  } catch (error) {
    return { error: "Invalid input" };
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
  // not checking payload, but you could add that later
});
export const UpdateControls = async (clerkId: string, slug: string, payload: ControlsType) : Promise<ActionResponseType> => {
  try {
    zodControlsActionSchema.parse({ clerkId, slug });
  } catch (error) {
    return { error: "Invalid input" };
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
export const DeleteProject = async (clerkId: string, slug: string) : Promise<ActionResponseType> => {

  try {
    zodDeleteActionSchema.parse({ clerkId, slug });
  } catch (error) {
    return { error: "Invalid input" };
  }

  const project = await db.getProjectPayloadBySlug(slug);
  if (project.length < 1) return { error: "Project not found" };
  const projectClerkId = project[0].clerkId;
  if (clerkId !== projectClerkId) return { error: "Unauthorized" };

  await db.deleteProjectBySlug(slug);
  return { success: true };
}