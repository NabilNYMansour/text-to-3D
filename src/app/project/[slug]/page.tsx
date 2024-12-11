import MainApp from '@/components/layout/main-app';
import { getProjectPayloadBySlug } from '@/db/crud';
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import React from 'react';
import * as db from '@/db/crud';
import { unstable_noStore as noStore } from 'next/cache';

const UpdateName = async (clerkId: string, slug: string, name: string) => {
  "use server";

  const project = await getProjectPayloadBySlug(slug);
  if (project.length < 1) return { error: "Project not found" };
  const projectClerkId = project[0].clerkId;
  if (clerkId !== projectClerkId) return { error: "Unauthorized" };

  await db.updateProjectNameBySlug(slug, name);
  return { success: true };
}

const UpdateControls = async (clerkId: string, slug: string, payload: any) => {
  "use server";

  const project = await getProjectPayloadBySlug(slug);
  if (project.length < 1) return { error: "Project not found" };
  const projectClerkId = project[0].clerkId;
  if (clerkId !== projectClerkId) return { error: "Unauthorized" };

  await db.updateProjectPayloadBySlug(slug, payload);
  return { success: true };
}

const Page = async ({ params }: { params: { slug: string } }) => {
  noStore();
  const slug = params.slug;

  const project = await getProjectPayloadBySlug(slug);
  if (project.length < 1) return notFound();
  const clerkId = project[0].clerkId;

  const user = await currentUser();
  if (!user || user.id !== clerkId) return notFound();

  const payload = project[0].payload;
  const name = project[0].name;

  return <MainApp name={name} updateName={UpdateName} slug={slug} initControls={payload} updateControls={UpdateControls} />;
};

export default Page;