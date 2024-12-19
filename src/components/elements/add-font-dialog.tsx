"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import AddNewFont from "../layout/add-new-font";
import { useState } from "react";

const AddFontDialog = ({ onUploadComplete, withButtonText }:
  { onUploadComplete?: (name: string, url: string) => void, withButtonText?: boolean }
) => {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button size={withButtonText ? "default" : "icon"} variant="outline" className="cu-shadow">
        <CirclePlus />
        {withButtonText && "Add Font"}
      </Button>
    </DialogTrigger>
    <DialogContent onInteractOutside={(e) => e.preventDefault()}>
      <DialogTitle>Add new Font</DialogTitle>
      <DialogDescription>
        Add a new font to the list of available fonts
      </DialogDescription>
      <AddNewFont onUploadCompleteCallback={(name, url) => {
        if (onUploadComplete) onUploadComplete(name, url);
        setOpen(false);
      }} />
    </DialogContent>
  </Dialog>
};

export default AddFontDialog;