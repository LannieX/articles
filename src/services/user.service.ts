"use server";

import { ApiServices } from "./api.service";

export interface UpdateUserPayload {
  userName?: string;
  email?: string;
  isActive?: boolean;
}

export const GetUser = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return ApiServices("GET", "/user", params);
};

export const GetUserById = async (id: string) => {
  return ApiServices("GET", `/user/${id}`);
};

export const UpdateUser = async (id: string, data: UpdateUserPayload) => {
  return ApiServices("PATCH", `/user/${id}`, data);
};
