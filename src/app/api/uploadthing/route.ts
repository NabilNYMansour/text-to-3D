import { fontRouter } from "@/uploadthing";
import { createRouteHandler } from "uploadthing/next";

export const { GET, POST } = createRouteHandler({
  router: fontRouter,
  config: { logLevel: "Error" }
});
