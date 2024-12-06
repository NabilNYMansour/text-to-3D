"use client";

import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { UserButton, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { dark } from "@clerk/themes";
import { LogIn } from "lucide-react";
import { useToggleTheme } from "@/lib/hooks";
import dynamic from "next/dynamic";

const ClerkSkeleton = () => <Skeleton className="h-[28px] w-[28px] rounded-full bg-muted" />

const ClerkUserButton = () => {
  const { currentTheme } = useToggleTheme();

  return (
    <div>
      <ClerkLoading>
        <ClerkSkeleton />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <div className="h-[28px] w-[28px] hover:outline rounded-full outline-muted outline-4">
            <Link href="/sign-in">
              <button className="h-[28px] w-[28px] rounded-full bg-muted opacity-70 hover:opacity-100 cu-flex-center">
                <LogIn className="h-3 -translate-x-[1px]" />
              </button>
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="h-[28px] w-[28px]">
            <UserButton aria-label="Authenticator"
              userProfileMode='navigation'
              userProfileUrl='/user-profile'
              appearance={{
                baseTheme: currentTheme === "dark" ? dark : undefined,
                elements: {
                  userPreview: "bg-muted",
                  userButtonPopoverCard: "border border-primary-foreground/20 dark:border-foreground/20",
                  userButtonPopoverActionButton: "bg-muted hover:dark:bg-[#383433] disabled:dark:bg-background focus:dark:bg-[#383433]",
                  userButtonPopoverActionButtonIcon: "h-5 w-5",
                  // userButtonPopoverCustomItemButton: "^ should have the same styling as userButtonPopoverActionButton if you want to use it",
                }
              }}
            />
          </div>
        </SignedIn>
      </ClerkLoaded>
    </div>
  )
}
export default dynamic(() => Promise.resolve(ClerkUserButton), {
  ssr: false,
  loading: () => <ClerkSkeleton />
});