const MAIN_URL = process.env.MAIN_URL;
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for an account on Text to 3D.",
  alternates: {
    canonical: `${MAIN_URL}/sign-up`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}