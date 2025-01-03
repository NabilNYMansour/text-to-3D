import UserBeingProcessed from "@/components/elements/user-being-processed";
import { LandingNoUser, LandingUser } from "@/components/layout/landing";
import { getUserProjects } from "@/db/crud";
import { decompressControls } from "@/lib/constants-and-types";
import { CheckFont, DeleteProject, UpdateName } from "@/lib/server-actions";
import { isUserSyncedWithDB } from "@/lib/server-helpers";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const isSynced = await isUserSyncedWithDB();
  if (!isSynced) return <UserBeingProcessed />;

  const user = await currentUser();
  if (!user) return <LandingNoUser />;

  const latestProjectsDB = await getUserProjects(user.id, "", 1, 3, true);
  const latestProjects = latestProjectsDB.map((project) => ({
    name: project.name,
    slug: project.slug,
    payload: decompressControls(project.controls),
  }));
  for (const project of latestProjects) {
    await CheckFont(user.id, project.slug, project.payload);
  }

  return <LandingUser
    userName={user.fullName}
    latestProjects={latestProjects}
    DeleteProject={DeleteProject}
    UpdateName={UpdateName}
  />;
}