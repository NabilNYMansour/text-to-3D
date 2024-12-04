"use client";

import { useEffect } from "react";
import { FullPageLoader } from "./loader";

const UserBeingProcessed = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });

  return <FullPageLoader />
};

export default UserBeingProcessed;