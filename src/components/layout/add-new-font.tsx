"use client";

import { Dropzone } from "../elements/dropzone-ttf";
import { useState } from "react";
import { convertFontToJson } from "@/lib/facetype";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import { captureException } from "@sentry/nextjs";
import { sendToMixpanelClient } from "@/mixpanel/client-side";
import { useUploadThing } from "@/uploadthing/client-side";
import Loader from "../elements/loader";

const AddNewFont = ({ onUploadCompleteCallback }: { onUploadCompleteCallback?: () => void }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fontName, setFontName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { startUpload } = useUploadThing("fontUploader", {
    onClientUploadComplete: () => {
      sendToMixpanelClient('clerkId', 'font_added', { fontName });
      setLoading(false);
      onUploadCompleteCallback && onUploadCompleteCallback();
    },
    onUploadError: (error: Error) => {
      alert(`${error.message}`);
      captureException(error);
      setLoading(false);
    },
  });

  const handleFileAdded = (file: File | null) => {
    setUploadedFile(file)
    setFontName(file?.name.split('.')[0] || '');
  }

  const handleFileUpload = async () => {
    if (uploadedFile && fontName) {
      setLoading(true);
      convertFontToJson(uploadedFile, { jsonFormat: true })
        .then((json) => {
          startUpload([new File([json], `${fontName}.json`, { type: "application/json" })]);
        })
        .catch((err) => {
          alert(`Error converting font: ${err}`);
          captureException(err);
          setLoading(false);
        });
    }
  }

  return <div className="grid gap-2">
    <Dropzone onFileAdded={handleFileAdded} className="w-full" />
    <div className="flex gap-2">
      <Input
        placeholder="Enter font name"
        value={fontName}
        onChange={(e) => setFontName(e.target.value)}
      />
      <Button disabled={!uploadedFile || !fontName || loading} onClick={handleFileUpload}>
        {loading ? <Loader /> : <CirclePlus />}Add
      </Button>
    </div>
  </div>
};

export default AddNewFont;