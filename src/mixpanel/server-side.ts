import { mixpanel } from "@/mixpanel";

export const sendToMixpanelServer = async (
  clerkId: string | undefined | null,
  eventName: string,
  eventProperties?: Record<string, any>
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
    console.log(error);
  }
};
