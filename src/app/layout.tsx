import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from '@clerk/nextjs'
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeToggle } from "@/components/buttons/theme-toggle";
import HeaderActions from "@/components/elements/header-actions";
import { currentUser } from "@clerk/nextjs/server";
import { Geologica } from "next/font/google"

const font = Geologica({ weight: "400", subsets: ["latin"], display: "swap", adjustFontFallback: false });

const MAIN_URL = process.env.MAIN_URL; 
const description = "Text to 3D is an online tool that converts text to 3D text. You can customize the 3D text with different fonts, colors, and effects.";
const title = "Text to 3D";
const author = "Nabil Mansour";
const imageLink = `${MAIN_URL}/hero.png`;
const keywords = "text to 3d, text to 3d converter, text to 3d online, text to 3d generator, text to 3d effect, text to 3d font, text to 3d maker, text to 3d model, text to 3d animation, text to 3d logo, text to 3d image, text to 3d tool, text to 3d software, text to 3d app, text to 3d website, text to 3d program";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | " + title,
  },
  description: description,
  alternates: {
    canonical: `${MAIN_URL}`
  },
  keywords: keywords,
  openGraph: {
    title: title,
    description: description,
    url: `${MAIN_URL}`,
    type: "website",
    images: [{ url: imageLink, alt: title, }],
    locale: 'en_US',
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [imageLink],
  },
  authors: { name: author },
  creator: author,
  publisher: author,
  manifest: `${MAIN_URL}/manifest.json`,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser();
  const sidebarOpen = user ? user.unsafeMetadata.sidebarOpen as boolean : false;

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
            <SidebarProvider defaultOpen={sidebarOpen}>
              <AppSidebar />
              <SidebarInset className="overflow-hidden">
                <header className="flex items-center justify-between gap-2 p-2 z-[1] bg-gradient-to-b from-background/80">
                  <SidebarTrigger title="Toggle Sidebar" />
                  <ThemeToggle variant="ghost" />
                  <HeaderActions />
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
