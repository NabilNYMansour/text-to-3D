"use client";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { FullPageLoader } from "@/components/elements/loader";

function Page() {
  const { resolvedTheme } = useTheme();

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  return <div className="flex-1 cu-flex-center p-4">
    <SignIn
      signUpUrl={"/sign-up"}
      forceRedirectUrl={"/" + (redirectUrl ? redirectUrl : "")}
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        elements: {
          card: "bg-muted",
          cardBox: "border-2 border-muted",
          formFieldInput: "bg-background",
        }
      }} />
  </div >
}

export default dynamic(() => Promise.resolve(Page), { ssr: false, loading: () => <FullPageLoader /> });
