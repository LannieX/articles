"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { Button } from "@/src/components/ui/button";

import {
  GetMyNotifications,
  MarkNotificationAsRead,
  MarkAllNotificationsAsRead,
} from "@/src/services/notification.service";

type Notification = {
  id: string;
  message: string;
  type: "COMMENT" | "ARTICLE_APPROVED" | "BOOKMARK";
  articleId?: string | null;
  commentId?: string | null;
  isRead: boolean;
  createdAt: string;
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await GetMyNotifications();

      setNotifications(res?.items ?? []);
    } catch (error) {
      console.error("Get notifications error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleNotificationClick = async (id: string) => {
    const notification = notifications.find((item) => item.id === id);

    if (!notification || notification.isRead || loadingId) {
      return;
    }

    const previousNotifications = notifications;

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isRead: true,
            }
          : item,
      ),
    );

    setLoadingId(id);

    try {
      await MarkNotificationAsRead(id);
    } catch (error) {
      console.error("Mark notification as read error:", error);

      setNotifications(previousNotifications);
    } finally {
      setLoadingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || isMarkingAll) {
      return;
    }

    const previousNotifications = notifications;

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      })),
    );

    setIsMarkingAll(true);

    try {
      await MarkAllNotificationsAsRead();
    } catch (error) {
      console.error("Mark all notifications as read error:", error);

      setNotifications(previousNotifications);
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[10px]
                  text-white
                "
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            p-3
          "
        >
          <p className="font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className="
                text-xs
                text-primary
                hover:underline
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isMarkingAll ? "Marking..." : "Mark all read"}
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex min-h-32 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center p-4">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNotificationClick(item.id)}
                disabled={loadingId === item.id}
                className={`
                  flex
                  w-full
                  flex-col
                  gap-1
                  border-b
                  p-3
                  text-left
                  transition-colors
                  hover:bg-muted
                  disabled:cursor-not-allowed
                  ${!item.isRead ? "bg-muted/50" : ""}
                `}
              >
                <p className="text-sm">{item.message}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
