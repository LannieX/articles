export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export interface UserType {
  users: User[];
  pagination: Pagination;
};