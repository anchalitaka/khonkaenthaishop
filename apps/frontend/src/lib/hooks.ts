import useSWR from 'swr';
import { usersApi, postsApi } from './api';
import type { User, Post, PaginatedResponse } from '@/types';

// Generic fetcher
const fetcher = async <T>(fn: () => Promise<{ data: T }>): Promise<T> => {
  const response = await fn();
  return response.data;
};

// Users hooks
export function useUsers(params?: { skip?: number; take?: number }) {
  return useSWR<PaginatedResponse<User>>(
    ['users', params],
    () => fetcher(() => usersApi.getAll(params))
  );
}

export function useUser(id: string | null) {
  return useSWR<User>(
    id ? ['user', id] : null,
    () => fetcher(() => usersApi.getOne(id!))
  );
}

// Posts hooks
export function usePosts(params?: { skip?: number; take?: number; published?: boolean }) {
  return useSWR<PaginatedResponse<Post>>(
    ['posts', params],
    () => fetcher(() => postsApi.getAll(params))
  );
}

export function usePost(id: string | null) {
  return useSWR<Post>(
    id ? ['post', id] : null,
    () => fetcher(() => postsApi.getOne(id!))
  );
}

export function usePostsByAuthor(authorId: string | null, params?: { skip?: number; take?: number }) {
  return useSWR<PaginatedResponse<Post>>(
    authorId ? ['posts', 'author', authorId, params] : null,
    () => fetcher(() => postsApi.getByAuthor(authorId!, params))
  );
}
