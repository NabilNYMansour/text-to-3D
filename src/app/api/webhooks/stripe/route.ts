import { updateUserSubscription } from "@/db/crud";
import { priceIdToSubscriptionType } from "@/lib/stripe-helpers";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" });

export async function POST(req: NextRequest) {
  //=========={ Get Payload and Signature }==========//
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature")!;

  try {
    //=========={ Establish Event }==========//
    let event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    const session = event.data.object as any;
    const userId = session.metadata.userId;
    const subscriptionType = await priceIdToSubscriptionType(session.items.data[0].price.id);
    // TODO: remove unnecessary awaits from backend like here

    //=========={ Logging }==========//
    console.log("=========={ Stripe Webhook }==========");
    console.log(`Received event: ${event.type}`);

    //=========={ DB syncing }==========//
    const clerk = await clerkClient();
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        console.log("Updating subscription:", userId, subscriptionType, session.id, session.items.data[0].id);
        await updateUserSubscription(userId, subscriptionType, session.id);
        await clerk.users.updateUserMetadata(userId, { publicMetadata: { subscriptionType } }); // Update the subscription type in Clerk
        break;
      case "customer.subscription.deleted":
        console.log("Deleting subscription:", userId);
        await updateUserSubscription(userId, "free", "");
        await clerk.users.updateUserMetadata(userId, { publicMetadata: { subscriptionType: "free" } });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);

    return NextResponse.json({ status: "success", event: event.type }, { status: 200 });
  } catch (error) {
    console.error("Error occured:", error);
    return NextResponse.json({ status: "failed", error }, { status: 400 });
  }
}
