"use server";

import { ApiServices } from "./api.service";

export const BookMark = async (articleId: string) => {
  return ApiServices("POST", `/bookmarks/${articleId}`);
};

export const UnBookMark = async (articleId: string) => {
  return ApiServices("DELETE", `/bookmarks/${articleId}`);
};

export const GetMyBookmarks = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return ApiServices("GET", "/bookmarks/me", params);
};
