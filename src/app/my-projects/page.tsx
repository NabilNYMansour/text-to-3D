import { currentUser } from "@clerk/nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import * as db from "@/db/crud";
import MyProjects from "@/components/layout/my-projects";
import { CheckFont, DeleteProject, UpdateName } from "@/lib/server-actions";
import { SearchParams } from "@/lib/constants-and-types";

const MyProjectsPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  noStore();

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const currentPage = Number(searchParams.page ?? 1);
  const search = String(searchParams.search ?? "");
  const pageSize = 6;

  const projects = await db.getUserProjects(user.id, search, currentPage, pageSize);
  const latestProjects = await db.getUserProjects(user.id, "", 1, 3, true);
  const projectsCount = (await db.getUserProjectsCount(user.id, search))[0].count;

  for (const project of projects) await CheckFont(user.id, project.slug, project.payload);

  return <MyProjects
    latestProjects={latestProjects}
    projects={projects}
    deleteProject={DeleteProject}
    updateProjectName={UpdateName}
    projectsCount={projectsCount}
    currentPage={currentPage}
    pageSize={pageSize}
  />;
};

export default MyProjectsPage;