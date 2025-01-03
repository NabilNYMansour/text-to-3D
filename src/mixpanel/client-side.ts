"use client";

import { getOperatingSystem } from "@/lib/client-helpers";

export const sendToMixpanelClient = async (
  clerkId: string | undefined | null,
  eventName: string,
  eventProperties?: Record<string, any> // eslint-disable-line
) => {
  const additionalProperties = {
    distinct_id: clerkId,
    $user_id: clerkId,
    $browser: navigator.userAgent,
    $current_url: window.location.href,
    $device_id: navigator.userAgent,
    $initial_referrer: document.referrer ? document.referrer : undefined,
    $initial_referring_domain: document.referrer
      ? new URL(document.referrer).hostname
      : undefined,
    $screen_height: window.screen.height,
    $screen_width: window.screen.width,
    $os: getOperatingSystem(),
  };
  const properties = {
    ...eventProperties,
    ...additionalProperties,
  };

  if (process.env.NODE_ENV === 'production') {
    fetch("/api/mixpanel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: eventName,
        properties: properties,
      }),
    });
  }
};
