import { deleteAllFontsByClerkId, updateUserSubscription } from "@/db/crud";
import { priceIdToSubscriptionType } from "@/lib/stripe-helpers";
import { sendToMixpanelServer } from "@/mixpanel/server-side";
import { clerkClient } from "@clerk/nextjs/server";
import { captureException } from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" });

export async function POST(req: NextRequest) {
  //=========={ Get Payload and Signature }==========//
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature")!;

  console.log(sig);
  
  try {
    //=========={ Establish Event }==========//
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!); // eslint-disable-line
    const session = event.data.object as any; // eslint-disable-line
    const userId = session.metadata.userId;
    const subscriptionType = priceIdToSubscriptionType(session.items.data[0].price.id);

    //=========={ DB syncing }==========//
    const clerk = await clerkClient();
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        sendToMixpanelServer(userId, "subscription-updated", { subscriptionType, session_id: session.id });
        await updateUserSubscription(userId, subscriptionType, session.id);
        await clerk.users.updateUserMetadata(userId, { publicMetadata: { subscriptionType } }); // Update the subscription type in Clerk
        break;
      case "customer.subscription.deleted":
        sendToMixpanelServer(userId, "subscription-deleted", { subscriptionType, session_id: session.id });
        await updateUserSubscription(userId, "free", "");
        await deleteAllFontsByClerkId(userId);
        await clerk.users.updateUserMetadata(userId, { publicMetadata: { subscriptionType: "free" } });
        break;
      default:
        sendToMixpanelServer(userId, "unhandled-event", { event: event.type });
        break;
    }

    return NextResponse.json({ status: "success", event: event.type }, { status: 200 });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ status: "failed", error }, { status: 400 });
  }
}
