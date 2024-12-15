"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useState } from "react";
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
  monthlyPrice: number;
  yearlyPrice: number;
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
      "Unlimited private shaders",
      "Public shader sharing",
      "iframe exports with logo",
    ],
    saveBadgeTailwind: "",
    everythingInPreviousText: "",
    cardTailwind: "border-muted ",
    buttonTailwind: "text-muted-foreground ",
    buttonVariant: "outline"
  },
  {
    name: "Basic",
    description: "For serious shading enthusiasts",
    monthlyPrice: 7,
    yearlyPrice: 60,
    features: [
      "Asset uploads up to 5GB",
      "iframe exports without logo",
      "R3F exports with hosted assets",
    ],
    saveBadgeTailwind: "bg-muted ",
    everythingInPreviousText: "Everything in Free, plus:",
    cardTailwind: "border-primary ",
    buttonTailwind: "hover:bg-yellow-300 ",
    buttonVariant: "default"
  },
  {
    name: "Premium",
    description: "For developers and professionals",
    monthlyPrice: 15,
    yearlyPrice: 120,
    features: [
      "AI Shader Copilot",
      "Asset uploads up to 20GB",
      "Advanced exporting options",
    ],
    saveBadgeTailwind: "bg-gradient-to-r from-orange-700 to-orange-500 text-primary shadow-orange-500 shadow-[0_0_10px_2px] ",
    everythingInPreviousText: "Everything in Basic, plus:",
    cardTailwind: "border-orange-500 shadow-[0_0_20px_2px] shadow-orange-500 bg-orange-100 dark:bg-yellow-900 ",
    buttonTailwind: "bg-orange-500 hover:bg-orange-600 text-white ",
    buttonVariant: "default"
  },
];

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
  const calculateMonthlyCost = () => {
    return yearly ? plan.yearlyPrice / 12 : plan.monthlyPrice;
  };
  const calculateSavingsPercentage = () => {
    if (plan.monthlyPrice === 0) return 0;
    const monthlySavings = plan.monthlyPrice - (plan.yearlyPrice / 12);
    return Math.round((monthlySavings / plan.monthlyPrice) * 100);
  };

  const isCurrentPlan = useMemo(() => {
    return subscriptionType === plan.name.toLocaleLowerCase();
  }, [subscriptionType]);
  const buttonText = useMemo(() => {
    if (isCurrentPlan) return "Current Plan";
    if (subscriptionType === "free" || subscriptionType === null) return "Select Plan";
    if (plan.name.toLocaleLowerCase() === "free") return "Cancel Plan";
    return "Manage Plan";
  }, [isCurrentPlan, subscriptionType]);

  return (
    <Card key={index} className={plan.cardTailwind + "border-2 max-w-[325px] h-full flex flex-col"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            {getPricingIcon(plan.name)}
            {plan.name}
          </CardTitle>
          {yearly && calculateSavingsPercentage() > 0 && (
            <span className={plan.saveBadgeTailwind + "mr-2 px-2.5 py-0.5 rounded-full"}>
              Save {calculateSavingsPercentage()}%
            </span>
          )}
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <div className="text-4xl font-bold">
            ${calculateMonthlyCost()}
            <span className="text-lg font-normal text-muted-foreground">
              /month
            </span>
          </div>
          {plan.yearlyPrice > 0 ?
            yearly ?
              <div className="text-sm text-muted-foreground mt-1">
                billed annually
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
            successUrl="/"
            cancelUrl="/pricing"
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
          <p className="text-xl text-muted-foreground mb-6">Choose the plan that's right for you</p>
          <SwitchText
            leftLabel="Monthly"
            rightLabel="Yearly"
            defaultChecked={yearly}
            onClick={() => setYearly(!yearly)}
          />
        </div>
        <div className="cu-flex-center">
          <div className="grid gap-8 lg:grid-cols-3 grid-">
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
