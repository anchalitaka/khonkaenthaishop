import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API functions
export const usersApi = {
  getAll: (params?: { skip?: number; take?: number }) =>
    api.get('/users', { params }),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: { email: string; password: string; name?: string }) =>
    api.post('/users', data),
  update: (id: string, data: Partial<{ email: string; name: string; isActive: boolean }>) =>
    api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const postsApi = {
  getAll: (params?: { skip?: number; take?: number; published?: boolean }) =>
    api.get('/posts', { params }),
  getOne: (id: string) => api.get(`/posts/${id}`),
  getByAuthor: (authorId: string, params?: { skip?: number; take?: number }) =>
    api.get(`/posts/author/${authorId}`, { params }),
  create: (data: { title: string; content?: string; authorId: string; published?: boolean }) =>
    api.post('/posts', data),
  update: (id: string, data: Partial<{ title: string; content: string; published: boolean }>) =>
    api.patch(`/posts/${id}`, data),
  publish: (id: string) => api.patch(`/posts/${id}/publish`),
  unpublish: (id: string) => api.patch(`/posts/${id}/unpublish`),
  delete: (id: string) => api.delete(`/posts/${id}`),
};

export default api;
