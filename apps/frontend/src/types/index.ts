// Category types
export interface Category {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Supplier types
export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface CreateSupplierInput {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

export interface UpdateSupplierInput {
  name?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  sku: string;
  barcode?: string | null;
  weight?: number | null;
  unit?: string | null;
  expiryDate?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId?: string | null;
  supplierId?: string | null;
  category?: {
    id: string;
    name: string;
  };
  supplier?: {
    id: string;
    name: string;
  };
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  barcode?: string;
  weight?: number;
  unit?: string;
  expiryDate?: string;
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
  image?: File;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  unit?: string;
  expiryDate?: string;
  categoryId?: string;
  supplierId?: string;
  isActive?: boolean;
  image?: File;
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
