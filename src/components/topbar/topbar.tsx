"use client";

import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarImage } from "@/src/components/ui/avatar";
import { DropdownMenu } from "@/src/components/ui/dropdown-menu";
import { MobileSidebar } from "../sidebar/mobile-sidebar";
import { NotificationDropdown } from "../Notification/NotificationDropdown";
import { useSession } from "next-auth/react";

export function TopBar() {

    const { data: session } = useSession();
  
    const user = session?.user;
  
  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        items-center
        justify-between
        border-b
        bg-background/95
        px-4
        backdrop-blur
        supports-backdrop-filter:bg-background/60
      "
    >
      <div className="md:hidden">
        <MobileSidebar />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <NotificationDropdown />
        <DropdownMenu>
          <Button
            variant="ghost"
            className="flex h-auto items-center gap-2 px-2"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://res.cloudinary.com/dyc6epcdk/image/upload/v1785920856/icon-7797704_640_ww11cf.png" />
            </Avatar>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">{user?.name ?? ""}</p>
              <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
            </div>
          </Button>
        </DropdownMenu>
      </div>
    </header>
  );
}
