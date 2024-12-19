import { mixpanel } from "@/mixpanel";
import { captureException } from "@sentry/nextjs";

export const sendToMixpanelServer = async (
  clerkId: string | undefined | null,
  eventName: string,
  eventProperties?: Record<string, any> // eslint-disable-line
) => {
  const additionalProperties = {
    distinct_id: clerkId,
    $user_id: clerkId,
    $os: "Server",
  };
  const properties = {
    ...eventProperties,
    ...additionalProperties,
  };

  try {
    mixpanel.track(eventName, properties);
  } catch (error) {
    captureException(error);
  }
};
