import { FontRouter } from "@/uploadthing";
import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<FontRouter>();
export const UploadDropzone = generateUploadDropzone<FontRouter>();
export const { useUploadThing, uploadFiles } = generateReactHelpers<FontRouter>();