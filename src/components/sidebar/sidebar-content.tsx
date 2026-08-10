"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LogOut, User } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { signOut, useSession } from "next-auth/react";

const menus = [
  {
    title: "Blogs",
    href: "/blogs",
    icon: FileText,
  },
  {
    title: "My Blogs",
    href: "/my-blogs",
    icon: FileText,
  },
  {
    title: "Saved Blogs",
    href: "/saved-blogs",
    icon: FileText,
  },
  {
    title: "Manage Users",
    href: "/manage-users",
    icon: User,
    adminOnly: true,
  },
];

type SidebarContentProps = {
  className?: string;
};

export function SidebarContent({ className }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();

  const user = session?.user;

  const visibleMenus = menus.filter((menu) => {
    if (menu.adminOnly) {
      return user?.role === "ADMIN";
    }

    return true;
  });

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      router.replace("/login");
    }
  };

  if (status === "loading") {
    return (
      <div className={cn("flex h-full flex-col p-4", className)}>
        <div className="mb-6 font-semibold">Blog CMS</div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col p-4", className)}>
      <div className="mb-6 font-semibold">Blog CMS</div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {visibleMenus.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <Icon size={18} />

              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
