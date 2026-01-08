import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  Supplier,
  CreateSupplierInput,
  UpdateSupplierInput,
  Product,
  CreateProductInput,
  UpdateProductInput,
  PaginatedResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Categories API
export const categoriesApi = {
  getAll: (params?: { skip?: number; take?: number; isActive?: boolean }) =>
    api.get<PaginatedResponse<Category>>('/categories', { params }),

  getOne: (id: string) =>
    api.get<Category>(`/categories/${id}`),

  create: (data: CreateCategoryInput) =>
    api.post<Category>('/categories', data),

  update: (id: string, data: UpdateCategoryInput) =>
    api.patch<Category>(`/categories/${id}`, data),

  delete: (id: string) =>
    api.delete(`/categories/${id}`),
};

// Suppliers API
export const suppliersApi = {
  getAll: (params?: { skip?: number; take?: number; isActive?: boolean }) =>
    api.get<PaginatedResponse<Supplier>>('/suppliers', { params }),

  getOne: (id: string) =>
    api.get<Supplier>(`/suppliers/${id}`),

  create: (data: CreateSupplierInput) =>
    api.post<Supplier>('/suppliers', data),

  update: (id: string, data: UpdateSupplierInput) =>
    api.patch<Supplier>(`/suppliers/${id}`, data),

  delete: (id: string) =>
    api.delete(`/suppliers/${id}`),
};

// Products API (with file upload support)
export const productsApi = {
  getAll: (params?: {
    skip?: number;
    take?: number;
    isActive?: boolean;
    categoryId?: string;
    supplierId?: string;
  }) =>
    api.get<PaginatedResponse<Product>>('/products', { params }),

  getOne: (id: string) =>
    api.get<Product>(`/products/${id}`),

  getByCategory: (categoryId: string, params?: { skip?: number; take?: number }) =>
    api.get<PaginatedResponse<Product>>(`/products/category/${categoryId}`, { params }),

  getBySupplier: (supplierId: string, params?: { skip?: number; take?: number }) =>
    api.get<PaginatedResponse<Product>>(`/products/supplier/${supplierId}`, { params }),

  create: (data: CreateProductInput) => {
    const formData = new FormData();

    // Append all fields except image
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'image' && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Append image file if exists
    if (data.image) {
      formData.append('image', data.image);
    }

    return api.post<Product>('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id: string, data: UpdateProductInput) => {
    const formData = new FormData();

    // Append all fields except image
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'image' && value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Append image file if exists
    if (data.image) {
      formData.append('image', data.image);
    }

    return api.patch<Product>(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (id: string) =>
    api.delete(`/products/${id}`),
};

export default api;
