import MainApp from "@/components/layout/main-app";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import * as db from "@/db/crud";
import { defaultControls } from "@/lib/constants-and-types";
import { unstable_noStore as noStore } from "next/cache";

const Page = async () => {
  noStore();

  const user = await currentUser();
  if (!user) return <MainApp />;

  const slug = crypto.randomUUID().replace(/-/g, '');
  const projectsCount = (await db.getUserProjectsCount(user.id, ""))[0].count;

  await db.createProject({
    clerkId: user.id,
    name: "New Project " + (projectsCount + 1),
    slug: slug,
    payload: defaultControls,
  });

  redirect(`project/${slug}`);
}

export default Page;