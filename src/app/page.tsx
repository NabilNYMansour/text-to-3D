import UserBeingProcessed from "@/components/elements/user-being-processed";
import AddNewFont from "@/components/layout/add-new-font";
import { Separator } from "@/components/ui/separator";
import { deleteAllFontsByClerkId, getSubscriptionTypeByClerkId } from "@/db/crud";
import { SelectUser } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const subscriptionQuery = user ? await getSubscriptionTypeByClerkId(user.id) : null;
  let subscriptionType: SelectUser['subscriptionType'] | null;

  if (subscriptionQuery && subscriptionQuery.length > 0) {
    subscriptionType = subscriptionQuery[0].subscriptionType as SelectUser['subscriptionType'];
  } else {
    subscriptionType = null;
  }

  if (user && !subscriptionType) { // if db is not in sync yet with Clerk
    return <UserBeingProcessed />;
  }

  return <div>
    Test {" | "}
    {user ? user.emailAddresses[0].emailAddress : ""} {" | "}
    {subscriptionType ? subscriptionType : "No subscription"}
    <AddNewFont />
  </div>;
}