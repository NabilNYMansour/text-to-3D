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

const AddFontDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus /> Add Font
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogTitle>Add new Font</DialogTitle>
        <DialogDescription>
          Add a new font to the list of available fonts
        </DialogDescription>
        <AddNewFont />
      </DialogContent>
    </Dialog>
  );
};

export default AddFontDialog;