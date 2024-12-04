"use client";

import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { DotsLoader} from "../elements/loader";
import PricingDialog from "../elements/pricing-dialog";
import { Button } from "../ui/button";
import { capitalizeFirstLetter, getPricingButtonTailwind, getPricingButtonVariant, getPricingIcon } from "@/lib/client-helpers";
import { cn } from "@/lib/utils";

const SubscriptionButtonDialog = () => {
  const user = useUser();
  const subscriptionButtonText = useMemo(
    () => user.user ?
      capitalizeFirstLetter(user.user.publicMetadata.subscriptionType as string) :
      "Pricing",
    [user]
  );

  return (
    <PricingDialog>
      <Button className={cn("font-bold w-full justify-start text-sm px-2", getPricingButtonTailwind(subscriptionButtonText))}
        variant={getPricingButtonVariant(subscriptionButtonText)}
        disabled={!user.isLoaded}
        size="sm"
      >
        {getPricingIcon(subscriptionButtonText)}
        {user.isLoaded ? subscriptionButtonText + (user.user ? " Member" : "") : <DotsLoader />}
      </Button>
    </PricingDialog>
  );
}

export default SubscriptionButtonDialog;