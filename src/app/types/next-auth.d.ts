import "next-auth";
import "next-auth/jwt";

type Notification = {
  id: string;
  message: string;
  type: "COMMENT" | "ARTICLE_APPROVED" | "BOOKMARK";
  articleId: string | null;
  commentId: string | null;
  isRead: boolean;
  createdAt: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "USER";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };

    accessToken: string;
    notifications: Notification[];
  }

  interface User {
    id: string;
    role: "ADMIN" | "USER";
    accessToken: string;
    notifications: Notification[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "USER";
    accessToken: string;
    notifications: Notification[];
  }
}
