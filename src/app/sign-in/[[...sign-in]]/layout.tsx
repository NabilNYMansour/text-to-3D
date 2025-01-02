const MAIN_URL = process.env.MAIN_URL;
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account on Text to 3D.",
  alternates: {
    canonical: `${MAIN_URL}/sign-in`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}