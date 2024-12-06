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
} from "@/components/ui/sidebar"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CirclePlus, Home, Images, LogIn, LogOut, Mail, Paintbrush, ScrollText, Settings } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { FullPageLoader } from "../elements/loader";
import SubscriptionButtonDialog from "../buttons/subscription-button-dialog";
import ThreeDText from "../ui/3d-text";

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
        {
          title: "New Project",
          url: "/project",
          icon: <CirclePlus />,
          showSignedIn: true,
          showSignedOut: true,
        },
        {
          title: "My Projects",
          url: "/my-projects",
          icon: <Paintbrush />,
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
          icon: <CirclePlus />,
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
          title: "Contact",
          url: "mailto:nabilnymansour@gmail.com",
          icon: <Mail />,
          showSignedIn: true,
          showSignedOut: true,
        },
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row items-center py-4 border-b border-transparent">
        <Link href="/"><ThreeDText text="Text to 3D" className="text-4xl hover:bg-muted p-4 rounded-md" /></Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        {isLoaded ? data.navMain.map((item, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  (isSignedIn && item.showSignedIn) || (!isSignedIn && item.showSignedOut) ? (
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
                  ) : null
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )) : <FullPageLoader />}
      </SidebarContent>
    </Sidebar>
  )
}
