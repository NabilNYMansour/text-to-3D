"use client";

import { CircleDollarSign, CircleUserRound, Gem, Palette } from "lucide-react";

export function capitalizeFirstLetter(s: string | undefined) {
  if (!s) return 'Free';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const getPricingButtonTailwind = (subscriptionType: string) => {
  switch (subscriptionType) {
    case "Free":
    case "free":
      return "cu-shadow";
    case "Basic":
    case "basic":
      return "hover:bg-yellow-300";
    case "Premium":
    case "premium":
      return "bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_10px_2px] shadow-orange-500";
    default:
      return "text-primary-foreground dark:text-primary";
  }
}
export const getPricingButtonVariant = (subscriptionType: string) => {
  switch (subscriptionType) {
    case "Free":
    case "free":
      return "outline";
    case "Basic":
    case "basic":
      return "default";
    case "Premium":
    case "premium":
      return "default";
    default:
      return "secondary";
  }
}

export const getPricingIcon = (subscriptionType: string) => {
  switch (subscriptionType) {
    case "Free":
    case "free":
      return <CircleUserRound />
    case "Basic":
    case "basic":
      return <Palette />;
    case "Premium":
    case "premium":
      return <Gem />;
    default:
      return <CircleDollarSign />;
  }
}

export function getOperatingSystem() {
  if (navigator.userAgent.indexOf('Win') !== -1) { return 'Windows OS'; }
  if (navigator.userAgent.indexOf('Mac') !== -1) { return 'MacOS'; }
  if (navigator.userAgent.indexOf('X11') !== -1) { return 'UNIX OS'; }
  if (navigator.userAgent.indexOf('Linux') !== -1) { return 'Linux OS'; }
  return "Not known";
}
