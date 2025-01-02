const MAIN_URL = process.env.MAIN_URL;
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of Service  and Privacy Policy for Text to 3D.",
  alternates: {
    canonical: `${MAIN_URL}/terms`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
