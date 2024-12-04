'use client';

import { MouseEvent } from 'react';
import { Button, ButtonProps } from '../ui/button';
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from '@clerk/nextjs';

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
    console.log(error);
  }
};

export interface SubscribeButtonProps extends ButtonProps {
  subscriptionType: string;
  successUrl: string;
  cancelUrl: string;
  yearly: boolean;
  setLoading: (loading: boolean) => void;
  onParentGivenClick?: (e: MouseEvent) => void;
}
const SubscribeButton = (props: SubscribeButtonProps) => {
  const {
    subscriptionType,
    successUrl,
    cancelUrl,
    yearly,
    setLoading,
    onParentGivenClick,
    ...buttonProps
  } = props;
  const { user } = useUser();
  const handleSubmit = async (e: any) => {
    if (!user) return;
    setLoading(true);
    await createSubscription(user.id, user.emailAddresses[0].emailAddress, subscriptionType, yearly);
    onParentGivenClick && onParentGivenClick(e);
  }

  return (
    <Button onClick={handleSubmit} {...buttonProps} />
  );
};
export default SubscribeButton;