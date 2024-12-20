import MyFonts, { NoFonts } from "@/components/layout/my-fonts";
import { getFontsByClerkId } from "@/db/crud";
import { ChangeFontName, DeleteFont, IsProMember } from "@/lib/server-actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {unstable_noStore as noStore} from "next/cache";
import NotSubscribed from "@/components/layout/not-subscribed";

const Page = async () => {
  noStore();

  const user = await currentUser();
  if (!user) redirect("/sign-in");
  
  const isProMember = await IsProMember(user.id);
  if (!isProMember) return <NotSubscribed title="Add Custom Fonts?" />;

  const userFonts = await getFontsByClerkId(user.id);
  if (userFonts.length < 1) return <NoFonts />;

  return <MyFonts fonts={userFonts} changeFontName={ChangeFontName} deleteFont={DeleteFont} />;
};

export default Page;