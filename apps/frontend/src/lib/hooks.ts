import useSWR from "swr";
import { categoriesApi, suppliersApi, productsApi } from "./api";
import type { Category, Supplier, Product, PaginatedResponse } from "@/types";

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

// Categories hooks
export function useCategories(params?: {
  skip?: number;
  take?: number;
  isActive?: boolean;
}) {
  return useSWR<PaginatedResponse<Category>>(
    ["categories", params],
    () => fetcher(() => categoriesApi.getAll(params)),
    swrConfig
  );
}

export function useCategory(id: string | null) {
  return useSWR<Category>(
    id ? ["category", id] : null,
    () => fetcher(() => categoriesApi.getOne(id!)),
    swrConfig
  );
}

// Suppliers hooks
export function useSuppliers(params?: {
  skip?: number;
  take?: number;
  isActive?: boolean;
}) {
  return useSWR<PaginatedResponse<Supplier>>(
    ["suppliers", params],
    () => fetcher(() => suppliersApi.getAll(params)),
    swrConfig
  );
}

export function useSupplier(id: string | null) {
  return useSWR<Supplier>(
    id ? ["supplier", id] : null,
    () => fetcher(() => suppliersApi.getOne(id!)),
    swrConfig
  );
}

// Products hooks
export function useProducts(params?: {
  skip?: number;
  take?: number;
  isActive?: boolean;
  categoryId?: string;
  supplierId?: string;
}) {
  return useSWR<PaginatedResponse<Product>>(
    ["products", params],
    () => fetcher(() => productsApi.getAll(params)),
    swrConfig
  );
}

export function useProduct(id: string | null) {
  return useSWR<Product>(
    id ? ["product", id] : null,
    () => fetcher(() => productsApi.getOne(id!)),
    swrConfig
  );
}

export function useProductsByCategory(
  categoryId: string | null,
  params?: { skip?: number; take?: number }
) {
  return useSWR<PaginatedResponse<Product>>(
    categoryId ? ["products", "category", categoryId, params] : null,
    () => fetcher(() => productsApi.getByCategory(categoryId!, params)),
    swrConfig
  );
}

export function useProductsBySupplier(
  supplierId: string | null,
  params?: { skip?: number; take?: number }
) {
  return useSWR<PaginatedResponse<Product>>(
    supplierId ? ["products", "supplier", supplierId, params] : null,
    () => fetcher(() => productsApi.getBySupplier(supplierId!, params)),
    swrConfig
  );
}
