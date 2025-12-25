// User types
export interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // ข้อมูลส่วนตัว (Personal Information)
  employeeType?: string | null;
  nationalId?: string | null;
  titleTh?: string | null;
  firstNameTh?: string | null;
  lastNameTh?: string | null;
  firstNameEn?: string | null;
  lastNameEn?: string | null;
  nickname?: string | null;
  gender?: string | null;
  bloodType?: string | null;
  birthDate?: string | null;
  ethnicity?: string | null;
  nationality?: string | null;
  religion?: string | null;
  phone?: string | null;
  province?: string | null;
  maritalStatus?: string | null;

  // ข้อมูลการทำงาน (Employment Information)
  username?: string | null;
  employeeId?: string | null;
  position?: string | null;
  positionLevel?: string | null;
  department?: string | null;
  employmentStatus?: string | null;
  startDate?: string | null;

  // Legacy
  name?: string | null;

  _count?: {
    posts: number;
    comments: number;
  };
}

export interface CreateUserInput {
  email: string;
  password: string;

  // ข้อมูลส่วนตัว
  employeeType?: string;
  nationalId?: string;
  titleTh?: string;
  firstNameTh?: string;
  lastNameTh?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  nickname?: string;
  gender?: string;
  bloodType?: string;
  birthDate?: string;
  ethnicity?: string;
  nationality?: string;
  religion?: string;
  phone?: string;
  province?: string;
  maritalStatus?: string;

  // ข้อมูลการทำงาน
  username?: string;
  employeeId?: string;
  position?: string;
  positionLevel?: string;
  department?: string;
  employmentStatus?: string;
  startDate?: string;

  // Legacy
  name?: string;
  role?: "USER" | "ADMIN";
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  isActive?: boolean;
  role?: "USER" | "ADMIN";

  // ข้อมูลส่วนตัว
  employeeType?: string;
  nationalId?: string;
  titleTh?: string;
  firstNameTh?: string;
  lastNameTh?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  nickname?: string;
  gender?: string;
  bloodType?: string;
  birthDate?: string;
  ethnicity?: string;
  nationality?: string;
  religion?: string;
  phone?: string;
  province?: string;
  maritalStatus?: string;

  // ข้อมูลการทำงาน
  username?: string;
  employeeId?: string;
  position?: string;
  positionLevel?: string;
  department?: string;
  employmentStatus?: string;
  startDate?: string;

  // Legacy
  name?: string;
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
