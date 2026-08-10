"use server";

import { ApiServices } from "./api.service";

export interface CreateArticlePayload {
  image?: string;
  title: string;
  description: string;
}

export const CreateBlog = async (
  data: CreateArticlePayload
) => {
  return ApiServices("POST", "/articles", data);
};

export const GetBlogs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return ApiServices("GET", "/articles", params);
};

export const GetMyBlogs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return ApiServices("GET", "/articles/me", params);
};

export const GetBlogOne = async (id: string) => {
  return ApiServices("GET", `/articles/${id}`);
};

export const UpdateBlog = async (
  id: string,
  data: Partial<CreateArticlePayload>
) => {
  return ApiServices("PATCH", `/articles/${id}`, data);
};

export const DeleteBlog = async (id: string) => {
  const data = {
    isPublished: false
  }
  return ApiServices("PATCH", `/articles/${id}`, data);
};