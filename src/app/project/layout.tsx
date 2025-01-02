const MAIN_URL = process.env.MAIN_URL;
import { Metadata } from "next";

export const metadata: Metadata = {
  description: "Create a new Text to 3D project.",
  alternates: {
    canonical: `${MAIN_URL}/project`,
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}