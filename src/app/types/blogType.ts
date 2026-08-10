export interface BlogType {
  image: string;
  title: string;
  description: string;
}

export interface BlogsAuthor {
  id: string;
  userName: string;
}

export interface BlogsDataTableType {
  id: string;
  image: string | null;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: BlogsAuthor;
  isBookmarked: boolean;
}

export interface BlogComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: BlogsAuthor;
}

export interface BlogDetailType extends BlogsDataTableType {
  comments: BlogComment[];
}
