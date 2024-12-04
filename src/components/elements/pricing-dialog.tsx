"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Pricing from "../layout/pricing";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";

const PricingDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const handleClick = () => {
    if (!user) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] h-[90vh] rounded-lg p-0 overflow-auto">
        <DialogTitle hidden>Pricing</DialogTitle>
        <DialogDescription hidden>Manage your subscription</DialogDescription>
        <Pricing handleClick={handleClick} />
      </DialogContent>
    </Dialog>
  );
};

export default PricingDialog;