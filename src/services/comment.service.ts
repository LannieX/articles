"use server";

import { ApiServices } from "./api.service";

export const CreateComment = async (articleId: string, content: string) => {
  return ApiServices("POST", `/comments/${articleId}`, {
    content,
  });
};

export const UpdateComment = async (commentId: string, content: string) => {
  return ApiServices("PATCH", `/comments/${commentId}`, {
    content,
  });
};

export const DeleteComment = async (commentId: string) => {
  return ApiServices("DELETE", `/comments/${commentId}`);
};
