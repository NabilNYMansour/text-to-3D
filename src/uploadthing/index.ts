import { createFont, getSubscriptionTypeByClerkId } from "@/db/crud";
import { currentUser } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  fontUploader: f({
    blob: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");
      const subscriptionQuery = await getSubscriptionTypeByClerkId(user.id);
      if (!subscriptionQuery || subscriptionQuery.length === 0) {
        throw new UploadThingError("Unauthorized");
      }
      const subscriptionType = subscriptionQuery[0].subscriptionType;
      // if (subscriptionType === "free") {
      //   throw new UploadThingError("Unauthorized");
      // }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await createFont(metadata.userId, file.name, file.url, file.key);
      return { uploadedBy: metadata.userId };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;