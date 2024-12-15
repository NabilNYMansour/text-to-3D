const Mixpanel = require("mixpanel");
export const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN!);