"use client";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { FullPageLoader } from "@/components/elements/loader";
import { useMixpanel } from "@/lib/hooks";

function Page() {
  const { resolvedTheme } = useTheme();

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  useMixpanel("sign-in", { redirectUrl });

  return <div className="flex-1 cu-flex-center p-4">
    <div className="pointer-events-none fixed inset-0 z-[0] bg-[linear-gradient(to_right,#6b7280_1px,transparent_1px),linear-gradient(to_bottom,#6b7280_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

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
      }}
    />
  </div >
}

export default dynamic(() => Promise.resolve(Page), { ssr: false, loading: () => <FullPageLoader /> });
