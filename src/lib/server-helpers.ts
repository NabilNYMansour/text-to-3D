"use server";

import { getSubscriptionTypeByClerkId } from "@/db/crud";
import { SelectUser } from "@/db/schema";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export const delayServerResponse = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const isUserSyncedWithDB = async () => {
  const user = await currentUser();

  if (user && user.privateMetadata.isSynced) {
    return true;
  }

  const subscriptionQuery = user ? await getSubscriptionTypeByClerkId(user.id) : null;
  let subscriptionType: SelectUser['subscriptionType'] | null;

  if (subscriptionQuery && subscriptionQuery.length > 0) {
    subscriptionType = subscriptionQuery[0].subscriptionType as SelectUser['subscriptionType'];
  } else {
    subscriptionType = null;
  }

  const isSynced = !(user && !subscriptionType);

  if (user) {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.id, { privateMetadata: { isSynced } });
  }

  return isSynced;
}