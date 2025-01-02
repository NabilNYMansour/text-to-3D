const MAIN_URL = process.env.MAIN_URL; 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Text to 3D pricing page.",
  alternates: {
    canonical: `${MAIN_URL}/pricing`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}