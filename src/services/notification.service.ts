"use server";

import { ApiServices } from "./api.service";

export const MarkNotificationAsRead = async (id: string) => {
  return ApiServices("PATCH", `/notifications/read/${id}`);
};

export const MarkAllNotificationsAsRead = async () => {
  return ApiServices("PATCH", "/notifications/read-all");
};

export const GetMyNotifications = async () => {
  return ApiServices("GET", "/notifications/me");
};
