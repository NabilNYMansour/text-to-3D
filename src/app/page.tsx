import UserBeingProcessed from "@/components/elements/user-being-processed";
import { isUserSyncedWithDB } from "@/lib/server-helpers";

export default async function Home() {
  const isSynced = await isUserSyncedWithDB();
  if (!isSynced) return <UserBeingProcessed />;

  return <div>
    hello world
  </div>;
}