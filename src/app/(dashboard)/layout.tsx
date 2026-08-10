"use client";

import { Sidebar } from "@/src/components/sidebar/desktop-sidebar";
import { TopBar } from "@/src/components/topbar/topbar";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:ml-64">
        <TopBar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}