import MainApp from "@/components/layout/main-app";
import { currentUser } from "@clerk/nextjs/server";
import { redirect, usePathname } from "next/navigation";
import * as db from "@/db/crud";
import { defaultControls } from "@/lib/constants";

const Page = async () => {
  const user = await currentUser();
  if (!user) return <MainApp />;

  const slug = crypto.randomUUID().replace(/-/g, '');

  await db.createProject({
    clerkId: user.id,
    name: "New Project",
    slug: slug,
    payload: defaultControls,
  });

  redirect(`project/${slug}`);
}

export default Page;