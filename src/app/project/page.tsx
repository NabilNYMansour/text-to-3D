import MainApp from "@/components/layout/main-app";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createProject, getUserProjectsCount } from "@/db/crud";
import { compressControls, defaultControls, SearchParams } from "@/lib/constants-and-types";
import { unstable_noStore as noStore } from "next/cache";
import { decodeJson } from "@/lib/utils";
import { isUserSyncedWithDB } from "@/lib/server-helpers";
import UserBeingProcessed from "@/components/elements/user-being-processed";

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  noStore();

  let controls = defaultControls;
  const controlsParam = searchParams.controls
  if (searchParams.controls) controls = decodeJson(String(controlsParam));

  const user = await currentUser();
  if (!user) return <MainApp isProMember={false} initControls={controls} />;

  const isSynced = await isUserSyncedWithDB();
  if (!isSynced) return <UserBeingProcessed />;

  const slug = crypto.randomUUID().replace(/-/g, '');
  const projectsCount = (await getUserProjectsCount(user.id, ""))[0].count;

  await createProject({
    clerkId: user.id,
    name: "New Project " + (projectsCount + 1),
    slug: slug,
    controls: compressControls(controls),
  });

  redirect(`project/${slug}`);
}

export default Page;