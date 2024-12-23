import { createFont, getFontsByClerkId, getSubscriptionTypeByClerkId } from "@/db/crud";
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const fontRouter = {
  fontUploader: f({
    blob: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ files }) => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");
      const subscriptionQuery = await getSubscriptionTypeByClerkId(user.id);
      if (!subscriptionQuery || subscriptionQuery.length === 0) {
        throw new UploadThingError("Unauthorized");
      }
      const subscriptionType = subscriptionQuery[0].subscriptionType;
      if (subscriptionType === "free") {
        throw new UploadThingError("Unauthorized");
      }
      const file = files[0];
      const fonts = await getFontsByClerkId(user.id);
      const fontsNames = fonts.map((font) => font.name);
      if (fontsNames.includes(file.name.replace(".json", ""))) {
        throw new UploadThingError("Font with this name already exists");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await createFont(metadata.userId, file.name.replace(".json", ""), file.url, file.key);
      return { uploadedBy: metadata.userId };
    })
} satisfies FileRouter;

export type FontRouter = typeof fontRouter;