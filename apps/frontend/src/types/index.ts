// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    comments: number;
  };
}

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
  role?: 'USER' | 'ADMIN';
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  name?: string;
  isActive?: boolean;
  role?: 'USER' | 'ADMIN';
}

// Post types
export interface Post {
  id: string;
  title: string;
  content: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: {
    id: string;
    name: string | null;
    email: string;
  };
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface CreatePostInput {
  title: string;
  content?: string;
  published?: boolean;
  authorId: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  published?: boolean;
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  postId: string;
  author?: {
    id: string;
    name: string | null;
    email: string;
  };
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
