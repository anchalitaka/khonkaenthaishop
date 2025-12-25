import useSWR from "swr";
import { usersApi, postsApi } from "./api";
import type { User, Post, PaginatedResponse } from "@/types";

// Generic fetcher
const fetcher = async <T>(fn: () => Promise<{ data: T }>): Promise<T> => {
  const response = await fn();
  return response.data;
};

// SWR Configuration - ดึงข้อมูลครั้งเดียว เก็บใน cache จนกว่าจะรีเฟรช
const swrConfig = {
  revalidateOnFocus: false,      // ไม่ดึงใหม่เมื่อ focus window
  revalidateOnReconnect: false,  // ไม่ดึงใหม่เมื่อ network กลับมา
  revalidateIfStale: false,      // ไม่ดึงใหม่ถ้าข้อมูลเก่า
  dedupingInterval: 60000,       // ไม่ส่ง request ซ้ำภายใน 60 วินาที
};

// Users hooks
export function useUsers(params?: { skip?: number; take?: number }) {
  return useSWR<PaginatedResponse<User>>(
    ["users", params],
    () => fetcher(() => usersApi.getAll(params)), //select * from
    swrConfig
  );
}

export function useUser(id: string | null) {
  return useSWR<User>(
    id ? ["user", id] : null,
    () => fetcher(() => usersApi.getOne(id!)), //select where id = {id}
    swrConfig
  );
}

// Posts hooks
export function usePosts(params?: {
  skip?: number;
  take?: number;
  published?: boolean;
}) {
  return useSWR<PaginatedResponse<Post>>(
    ["posts", params],
    () => fetcher(() => postsApi.getAll(params)),
    swrConfig
  );
}

export function usePost(id: string | null) {
  return useSWR<Post>(
    id ? ["post", id] : null,
    () => fetcher(() => postsApi.getOne(id!)),
    swrConfig
  );
}

export function usePostsByAuthor(
  authorId: string | null,
  params?: { skip?: number; take?: number }
) {
  return useSWR<PaginatedResponse<Post>>(
    authorId ? ["posts", "author", authorId, params] : null,
    () => fetcher(() => postsApi.getByAuthor(authorId!, params)),
    swrConfig
  );
}
