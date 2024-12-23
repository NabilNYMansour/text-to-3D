"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, FileType, Home, LogIn, MessageSquare, ScrollText, Settings, Theater } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import SubscriptionButtonDialog from "../buttons/subscription-button-dialog";
import Image from "next/image";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

const data = {
  navMain: [
    {
      items: [
        {
          title: "Home",
          url: "/",
          icon: <Home />,
          showSignedIn: true,
          showSignedOut: true,
        },
        // {
        //   title: "Project",
        //   url: "/project",
        //   icon: <Box />,
        //   showSignedIn: true,
        //   showSignedOut: true,
        // },
        {
          title: "My Projects",
          url: "/my-projects",
          icon: <Box />,
          showSignedIn: true,
          showSignedOut: false,
        },
        {
          title: "My Fonts",
          url: "/my-fonts",
          icon: <FileType />,
          showSignedIn: true,
          showSignedOut: false,
        },
        {
          title: "Sign in",
          url: "/sign-in",
          icon: <LogIn />,
          showSignedIn: false,
          showSignedOut: true,
        },
        {
          title: "Manage account",
          url: "/user-profile",
          icon: <Settings />,
          showSignedIn: true,
          showSignedOut: false,
        },
      ],
    },
    {
      items: [
        {
          title: "Pricing",
          url: "/pricing",
          icon: <Home />,
          showSignedIn: true,
          showSignedOut: true,
        },
        // {
        //   title: "Sign out",
        //   url: "/sign-out",
        //   icon: <LogOut />,
        //   showSignedIn: true,
        //   showSignedOut: false,
        // },
        {
          title: "Terms",
          url: "/terms",
          icon: <ScrollText />,
          showSignedIn: true,
          showSignedOut: true,
        },
        {
          title: "Feedback",
          url: "mailto:nabilnymansour@gmail.com",
          icon: <MessageSquare />,
          showSignedIn: true,
          showSignedOut: true,
        },
        {
          title: "Landing",
          url: "/landing",
          icon: <Theater />,
          showSignedIn: true,
          showSignedOut: false,
        },
      ],
    }
  ],
}

const SidebarSkeleton = () => {
  return <>
    <SidebarGroup>
      <Skeleton className="h-32 w-full bg-muted" />
    </SidebarGroup>

    <SidebarGroup>
      <Skeleton className="h-32 w-full bg-muted" />
    </SidebarGroup>
  </>
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded, user } = useUser();
  const { open } = useSidebar();

  useEffect(() => {
    user?.update({ unsafeMetadata: { sidebarOpen: open } });
  }, [open]);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row items-center py-2 border-b border-transparent">
        <Link href="/" className="w-full hover:bg-muted rounded-md p-4">
          <Image src="/long-text-logo.png" alt="logo"
            priority
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: '100%' }}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        {isLoaded ? data.navMain.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  ((isSignedIn && item.showSignedIn) || (!isSignedIn && item.showSignedOut)) && (
                    <div key={item.title}>
                      {item.title === "Pricing" ? (
                        <li><SubscriptionButtonDialog /></li>
                      ) : (
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={item.url === pathname}>
                            <Link href={item.url}>{item.icon}{item.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </div>
                  )))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )) : <SidebarSkeleton />}
      </SidebarContent>
    </Sidebar>
  )
}