"use server";

import { getSubscriptionByClerkId, getSubscriptionTypeByClerkId } from "@/db/crud";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const priceIdToSubscriptionType = (priceId: string) => {
  switch (priceId) {
    case process.env.STRIPE_BASIC_PRICE_ID:
    case process.env.STRIPE_BASIC_YR_PRICE_ID:
      return "basic";
    case process.env.STRIPE_PREMIUM_PRICE_ID:
    case process.env.STRIPE_PREMIUM_YR_PRICE_ID:
      return "premium";
  }
  return "free";
}

export const subscriptionTypeToPriceId = (subscriptionType: string, yearly: boolean) => {
  switch (subscriptionType) {
    case "basic":
      return yearly ? process.env.STRIPE_BASIC_YR_PRICE_ID : process.env.STRIPE_BASIC_PRICE_ID;
    case "premium":
      return yearly ? process.env.STRIPE_PREMIUM_YR_PRICE_ID : process.env.STRIPE_PREMIUM_PRICE_ID;
  }
  return null;
}

export const getUserCurrentSubscription = async (userId: string) => {
  const userCurrentSubscriptionQuery = await getSubscriptionTypeByClerkId(userId);
  let userCurrentSubscription;
  if (userCurrentSubscriptionQuery) {
    userCurrentSubscription = userCurrentSubscriptionQuery[0].subscriptionType;
  } else {
    userCurrentSubscription = null;
  }
  return userCurrentSubscription;
}

export const deleteSubscription = async (userId: string) => {
  const subscriptionQuery = await getSubscriptionByClerkId(userId);
  if (subscriptionQuery) {
    const subscriptionId = subscriptionQuery[0].subscriptionId;
    await stripe.subscriptions.cancel(subscriptionId);
  }
}

export const newSubscription = async (userId: string, priceId: string, email: string, subscriptionType: string) => {
  return await stripe.checkout.sessions.create({
    success_url: process.env.MAIN_URL!,
    cancel_url: process.env.MAIN_URL!,
    customer_email: email,
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      }
    ],
    subscription_data: {
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel',
        },
      },
      trial_period_days: 30,
      metadata: {
        userId: userId!,
        subscriptionType: subscriptionType,
      },
    },
    payment_method_collection: 'always',
  });
}