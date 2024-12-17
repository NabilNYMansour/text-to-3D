import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { UserJSON, WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteAllFontsByClerkId, deleteUserByClerkId, getSubscriptionTypeByClerkId } from '@/db/crud'
import { deleteSubscription } from '@/lib/stripe-helpers'
import { clerkClient } from '@clerk/nextjs/server'
import { sendToMixpanelServer } from '@/mixpanel/server-side'

// You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

export async function POST(req: Request) {
  //=========={ Check Webhook Secret }==========//
  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  //=========={ Get Signature }==========//
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  //=========={ Get Body }==========//
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let evt: WebhookEvent;

  //=========={ Verify Payload }==========//
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  //=========={ Handle Event }==========//
  let clerkId: string;
  switch (evt.type) {
    case 'user.created':
      clerkId = evt.data.id;
      const name = (evt.data as UserJSON).first_name + ' ' + (evt.data as UserJSON).last_name;
      const clerk = await clerkClient();
      await createUser({ name: name, clerkId: clerkId, createAt: new Date().toISOString() });
      await clerk.users.updateUserMetadata(clerkId, { publicMetadata: { subscriptionType: "free" } }); // Set the default subscription type to free
      sendToMixpanelServer(clerkId, 'user-created', { name: name });
      break;

    case 'user.deleted':
      clerkId = evt.data.id!;
      const subscriptionQuery = await getSubscriptionTypeByClerkId(clerkId);
      let subscriptionType: string | null;
      if (subscriptionQuery && subscriptionQuery.length > 0) {
        subscriptionType = subscriptionQuery[0].subscriptionType;
      } else {
        subscriptionType = null;
      }
      if (subscriptionType !== 'free' && subscriptionType !== null) { // if stripe subscription exists
        await deleteSubscription(clerkId); // Delete the subscription from Stripe
      }
      await deleteAllFontsByClerkId(clerkId); // Delete the fonts from the database
      await deleteUserByClerkId(clerkId); // Delete the user from the database
      sendToMixpanelServer(clerkId, 'user-deleted', { subscriptionType });
      break;
  }

  return new Response('', { status: 200 })
}