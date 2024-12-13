import MainApp from '@/components/layout/main-app';
import { getProjectPayloadBySlug } from '@/db/crud';
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import React from 'react';
import * as db from '@/db/crud';
import { unstable_noStore as noStore } from 'next/cache';
import { UpdateControls, UpdateName } from '@/lib/server-actions';

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

  await db.updateLastOpenedAtBySlug(slug);

  return <MainApp name={name} updateName={UpdateName} slug={slug} initControls={payload} updateControls={UpdateControls} />;
};

export default Page;