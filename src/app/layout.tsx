import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from '@clerk/nextjs'
import localFont from 'next/font/local';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import SearchBar from "@/components/elements/search-bar";
import ClerkUserButton from "@/components/buttons/clerk-user-button";
import { NotificationButton } from "@/components/buttons/notification-button";

const font = localFont({ src: '../../public/CaviarDreams.ttf' });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClerkProvider afterSignOutUrl="/sign-in">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset className="overflow-hidden">
                <header className="flex items-center justify-between border-b gap-2 p-2">
                  <SidebarTrigger />
                  <div className="flex-1 flex justify-end items-center gap-2">
                    <SearchBar />
                    <div><NotificationButton className="cu-shadow" /></div>
                    <div><ClerkUserButton /></div>
                  </div>
                </header>
                <div className="flex flex-1 flex-col items-center">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
