import {
  getUserCurrentSubscription,
  newSubscription,
  subscriptionTypeToPriceId
} from "@/lib/stripe-helpers";
import { z } from 'zod';

const schema = z.object({
  userId: z.string(),
  subscriptionType: z.string(),
  yearly: z.boolean(),
  email: z.string(),
});

export async function POST(req: Request) {
  //=========={ Get payload data }==========//
  const { userId, subscriptionType, yearly, email } = await req.json();

  try {
    schema.parse({ userId, subscriptionType, yearly, email });
  } catch (error) {
    console.log("Error occured:", error);
    return new Response('Error occured', { status: 400 });
  }

  if (subscriptionType === "free") {
    return Response.json({ ok: true, status: "already-subscribed", redirectUrl: process.env.STRIPE_CUSTOMER_PORTAL_URL! }, { status: 200 });
  }

  const priceId = await subscriptionTypeToPriceId(subscriptionType, yearly);
  if (!userId || !priceId || !subscriptionType) {
    return Response.json({ status: "unauthorized" }, { status: 401 });
  }

  //=========={ Check User Subscription }==========//
  const userCurrentSubscription = await getUserCurrentSubscription(userId);
  if (userCurrentSubscription === subscriptionType) {
    return Response.json({ status: "already-subscribed" }, { status: 400 });
  } else if (userCurrentSubscription !== "free") { // If the user has a subscription and wants to change it
    return Response.json({ ok: true, status: "already-subscribed", redirectUrl: process.env.STRIPE_CUSTOMER_PORTAL_URL! }, { status: 200 });
  }

  //=========={ Create New Subscription }==========//
  const stripeSession = await newSubscription(userId, priceId, email, subscriptionType);
  return Response.json({ ok: true, status: "success", result: stripeSession }, { status: 200 });
}
