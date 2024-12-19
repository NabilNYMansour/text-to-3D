"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useState } from "react";
import SwitchText from "@/components/ui/switch-text";
import { CircleCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import SubscribeButton from "../buttons/subscribe-button";
import Link from "next/link";
import Loader from "../elements/loader";
import { getPricingIcon } from "@/lib/client-helpers";
import { useMixpanel } from "@/lib/hooks";

type PricingPlan = {
  name: string;
  description: string;
  oneTimePrice?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  features: string[];
  saveBadgeTailwind: string;
  everythingInPreviousText: string;
  cardTailwind: string;
  buttonTailwind: string;
  buttonVariant: "link" | "outline" | "default" | "destructive" | "secondary" | "ghost" | null | undefined;
};

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    description: "Perfect for beginners and hobbyists",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Unlimited projects",
      "2k and 4k screenshots",
      "Up to five 3D model downloads",
      "Personal use",
    ],
    everythingInPreviousText: "",
    saveBadgeTailwind: "",
    cardTailwind: "border-muted ",
    buttonTailwind: "text-muted-foreground ",
    buttonVariant: "outline"
  },
  {
    name: "Pro",
    description: "For designers and 3D professionals",
    monthlyPrice: 5,
    yearlyPrice: 30,
    features: [
      "8k screenshots",
      "Unlimited 3D model downloads",
      "Custom fonts upload",
      "Commercial use",
    ],
    everythingInPreviousText: "Everything in Free, plus:",
    saveBadgeTailwind: "bg-muted ",
    cardTailwind: "border-primary ",
    buttonTailwind: "hover:bg-yellow-300 ",
    buttonVariant: "default"
  },
];

const calculateMonthlyCost = (yearly: boolean, yearlyPrice: number, monthlyPrice: number) => {
  return yearly ? yearlyPrice / 12 : monthlyPrice;
};
const calculateSavingsPercentage = (yearlyPrice: number, monthlyPrice: number) => {
  if (monthlyPrice === 0) return -1;
  const monthlySavings = monthlyPrice - (yearlyPrice / 12);
  return Math.round((monthlySavings / monthlyPrice) * 100);
};

const PricingCard = ({ plan, index, yearly, subscriptionType, userId, userLoaded, loading, setLoading, handleClick }: {
  plan: PricingPlan,
  index: number,
  yearly: boolean,
  subscriptionType: string | null,
  userId: string | null,
  userLoaded: boolean,
  loading: boolean,
  setLoading: (loading: boolean) => void
  handleClick?: () => void
}) => {
  const isCurrentPlan = useMemo(() => {
    return subscriptionType === plan.name.toLocaleLowerCase();
  }, [subscriptionType]);
  const buttonText = useMemo(() => {
    if (isCurrentPlan) return "Current Plan";
    if (subscriptionType === "free" || subscriptionType === null) return "Select Plan";
    if (plan.name.toLocaleLowerCase() === "free") return "Cancel Plan";
    return "Manage Plan";
  }, [isCurrentPlan, subscriptionType]);

  const savingsPercentage = useMemo(() => {
    if (!plan.yearlyPrice || !plan.monthlyPrice) return 0;
    return calculateSavingsPercentage(plan.yearlyPrice, plan.monthlyPrice);
  }, [plan.yearlyPrice, plan.monthlyPrice]);

  const monthlyCost = useMemo(() => {
    if (!plan.yearlyPrice || !plan.monthlyPrice) return 0;
    return calculateMonthlyCost(yearly, plan.yearlyPrice, plan.monthlyPrice);
  }, [yearly, plan.yearlyPrice, plan.monthlyPrice]);

  return (
    <Card key={index} className={plan.cardTailwind + "border-2 max-w-[325px] h-full flex flex-col"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            {getPricingIcon(plan.name)}
            {plan.name}
          </CardTitle>
          {plan.name != "Free" && yearly && plan.monthlyPrice && plan.yearlyPrice && savingsPercentage > 0 &&
            <span className={plan.saveBadgeTailwind + "mr-2 px-2.5 py-0.5 rounded-full"}>
              Save {savingsPercentage}%
            </span>}
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <div className="text-4xl font-bold">
            {plan.oneTimePrice ? <span>
              ${plan.oneTimePrice}
            </span> : <>
              ${monthlyCost}
              <span className="text-lg font-normal text-muted-foreground">
                /month
              </span>
            </>}
          </div>
          {plan.oneTimePrice ? <div className="text-sm text-muted-foreground mt-1">
            one time payment
          </div> : plan.yearlyPrice && plan.yearlyPrice > 0 ?
            yearly ?
              <div className="text-sm text-muted-foreground mt-1">
                ${plan.yearlyPrice} billed annually
              </div> : <br className="mt-1" /> :
            <div className="text-sm text-muted-foreground mt-1">
              Free
            </div>}
        </div>
        <ul className="space-y-3">
          <li className="text-muted-foreground text-xs">
            {plan.everythingInPreviousText ? plan.everythingInPreviousText : <br />}
          </li>
          {plan.features.map((feature: string, featureIndex: number) => (
            <li key={featureIndex} className="flex">
              <CircleCheck className="min-h-4 min-w-4 max-h-4 max-w-4 mr-2 mt-1 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        {userId ?
          <SubscribeButton variant={plan.buttonVariant} className={plan.buttonTailwind + "w-full font-bold"}
            disabled={isCurrentPlan || loading}
            yearly={yearly}
            subscriptionType={plan.name.toLocaleLowerCase()}
            setLoading={setLoading}
            onParentGivenClick={handleClick}
          >
            {loading ? <Loader tailwind="text-foreground" /> : buttonText}
          </SubscribeButton> :
          <Link href="/sign-up?redirect=pricing" className="w-full">
            <Button
              className={plan.buttonTailwind + "w-full font-bold"}
              onClick={handleClick}
              variant={plan.buttonVariant}
              disabled={!userLoaded}
            >
              {userLoaded ? "Sign Up" : <Loader tailwind="text-foreground" />}
            </Button>
          </Link>
        }
      </CardFooter>
    </Card>
  )
};

const Pricing = ({ handleClick }: { handleClick?: () => void }) => {
  const [yearly, setYearly] = useState(true);
  const [loading, setLoading] = useState(false);
  const user = useUser();

  const subscriptionType = user.user ? user.user.publicMetadata.subscriptionType as string : null;
  const userId = user.user ? user.user.id : null;

  useMixpanel("pricing-page", { currentSubscriptionType: subscriptionType });

  return (
    <ScrollArea className="flex-1">
      <div className="container mx-auto py-12 px-4 flex-1 bg-ora">
        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl mb-4">Pricing Plans</h1>
          <p className="text-xl text-muted-foreground mb-6">Choose the plan that&apos;s right for you</p>
          <SwitchText
            leftLabel="Monthly"
            rightLabel="Yearly"
            defaultChecked={yearly}
            onClick={() => setYearly(!yearly)}
          />
        </div>
        <div className="cu-flex-center">
          <div className="grid gap-8 lg:grid-cols-2 grid-">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index}
                index={index}
                plan={plan}
                yearly={yearly}
                subscriptionType={subscriptionType}
                userId={userId}
                userLoaded={user.isLoaded}
                loading={loading}
                setLoading={setLoading}
                handleClick={handleClick}
              />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Pricing;
