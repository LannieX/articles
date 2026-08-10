import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/src/components/ui/toast";
import NextAuthProvider from "../components/providers/session-provider";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blogs CRM",
  description:
    "A content management system for creating, managing, and publishing articles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.className} h-screen flex flex-col`}>
        <NextAuthProvider>{children}</NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
