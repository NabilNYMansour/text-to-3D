'use client';

import { MouseEvent, useState } from 'react';
import { Button, ButtonProps } from '../ui/button';
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from '@clerk/nextjs';
import { captureException } from '@sentry/nextjs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const createSubscription = async (
  userId: string,
  email: string | undefined,
  subscriptionType: string,
  yearly: boolean,
) => {
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

  if (!stripe) {
    return;
  }
  try {
    const response = await fetch('/api/stripe-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subscriptionType, yearly, email })
    });
    const data = await response.json();
    if (!data.ok) throw new Error('Something went wrong', data);
    if (data.status === 'already-subscribed') {
      window.location.assign(data.redirectUrl);
    } else {
      await stripe.redirectToCheckout({
        sessionId: data.result.id,
      });
    }
  } catch (error) {
    alert('Something went wrong');
    captureException(error);
  }
};

export interface SubscribeButtonProps extends ButtonProps {
  subscriptionType: string;
  yearly: boolean;
  setLoading: (loading: boolean) => void;
  onParentGivenClick?: (e: MouseEvent) => void;
}
const SubscribeButton = (props: SubscribeButtonProps) => {
  const {
    subscriptionType,
    yearly,
    setLoading,
    onParentGivenClick,
    ...buttonProps
  } = props;
  const { user } = useUser();
  const [popOverOpen, setPopOverOpen] = useState(false);

  const handleSubmit = async (e: MouseEvent) => {
    if (!user) return;
    setLoading(true);
    await createSubscription(user.id, user.emailAddresses[0].emailAddress, subscriptionType, yearly);
    if (onParentGivenClick) onParentGivenClick(e);
  }

  if (user?.publicMetadata.subscriptionType === "pro" && subscriptionType === "free") {
    return <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
      <PopoverTrigger className='w-full'><Button onClick={undefined} {...buttonProps} /></PopoverTrigger>
      <PopoverContent>
        <div className='pb-2'>
          <p>Cancelling your subscription will <b>delete</b> all your fonts. </p>
          <p className='text-red-500'>Are you sure you want to cancel?</p>
        </div>
        <Button variant="destructive" className='w-full'
          onClick={(e) => {
            handleSubmit(e);
            setPopOverOpen(false);
          }}
        >
          Yes, Cancel
        </Button>
      </PopoverContent>
    </Popover>
  }

  return <Button onClick={handleSubmit} {...buttonProps} />
};
export default SubscribeButton;