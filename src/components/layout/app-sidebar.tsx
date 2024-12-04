"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CirclePlus, Home, Images, LogIn, LogOut, Mail, Paintbrush, ScrollText, Settings } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { FullPageLoader } from "../elements/loader";
import SubscriptionButtonDialog from "../buttons/subscription-button-dialog";
import { ThemeToggle } from "../buttons/theme-toggle";

const Title = () => {
  const [hovering, setHovering] = useState(false);

  return (
    <Link href="/">
      <div className="flex items-center hover:contrast-125 transition-all duration-100 cursor-pointer"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="relative">
          <div className="h-[37px] w-[37px] cu-flex-center">
            <div
              className={
                `bg-primary rounded-full h-5 w-5
                transition-shadow duration-100 opacity-20
                ${hovering ? "shadow-[0_0_10px_10px] shadow-primary" : ""}`
              }
            />
          </div>
          <div className="absolute inset-0 cu-flex-center">
            <Image src="/logo-big.png" alt="Shader Zone Logo" width={50} height={50} />
          </div>
        </div>
        <h1 className={`text-xl font-extrabold text-primary-foreground dark:text-primary ${hovering ? "text-shadow" : ""}`}>
          Shading Zone
        </h1>
      </div>
    </Link>
  );
}

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
          title: "New Shader",
          url: "/shader",
          icon: <CirclePlus />,
          showSignedIn: true,
          showSignedOut: true,
        },
        {
          title: "My Shaders",
          url: "/my-shaders",
          icon: <Paintbrush />,
          showSignedIn: true,
          showSignedOut: false,
        },
        {
          title: "My Assets",
          url: "/my-assets",
          icon: <Images />,
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
      <SidebarHeader className="flex flex-row items-center justify-between p-2 border-b border-transparent">
        <Title />
        <ThemeToggle variant="ghost"/>
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
                            <Link href={item.url} className="!font-bold">{item.icon}{item.title}</Link>
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
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
