"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FullPageLoader } from "@/components/elements/loader";
import { Separator } from "@/components/ui/separator";
import { useUser } from '@clerk/clerk-react'
import { Button } from "@/components/ui/button";
import PricingDialog from "@/components/elements/pricing-dialog";
import { capitalizeFirstLetter, getPricingIcon } from "@/lib/client-helpers";

const getSubscriptionTailwind = (subscriptionType: string) => {
  switch (subscriptionType) {
    case "free":
      return "";
    case "basic":
      return "text-primary-foreground dark:text-primary";
    case "premium":
      return "text-orange-500";
    default:
      return "";
  }
}

async function Page() {
  const { resolvedTheme } = useTheme();
  const user = useUser();

  if (user.isLoaded) {
    if (!user.isSignedIn) {
      window.location.href = "/sign-in";
    } else {
      const subscriptionType = user.user!.publicMetadata.subscriptionType as string;

      return <UserProfile
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
          elements: {
            rootBox: "p-4 w-[100%] cu-flex-center rounded-md",
            cardBox: "bg-muted rounded-md border border-muted",
            scrollBox: "bg-background rounded-md rounded-l-none",
            pageScrollBox: "bg-background rounded-md",
            actionCard: "bg-muted rounded-md",
            formFieldInput: "bg-background rounded-md",
            menuList: "bg-muted rounded-md",
            menuItem: "bg-muted rounded-md hover:bg-[#383433]",
            navbar: "bg-background rounded-md",
            navbarButton: "rounded-md",
          },
        }}
      >
        <UserProfile.Page label="Subscription"
          url="subscription"
          labelIcon={
            <div className="cu-flex-center h-[16px]">
              {getPricingIcon(subscriptionType)}
            </div>
          }
        >
          <div className="h-full w-full flex-col">
            <h1 className="font-bold">Subscription</h1>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm">
                  You have a <b className={getSubscriptionTailwind(subscriptionType)}>
                    {capitalizeFirstLetter(subscriptionType)}
                  </b> membership
                </p>
              </div>
              <div>
                <PricingDialog>
                  <Button className="my-2">
                    Manage Membership
                  </Button>
                </PricingDialog>
              </div>
            </div>
          </div>
        </UserProfile.Page>
      </UserProfile>
    }
  }
}

export default dynamic(() => Promise.resolve(Page), { ssr: false, loading: () => <FullPageLoader /> });
