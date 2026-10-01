import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category.type";

export function getCategories(params?: {
  page?: number;
  limit?: number;
  departmentId?: string;
  includeInactive?: boolean;
}) {
  return apiClient<ApiResponse<Category[]>>("/categories", {
    method: "GET",
    query: params,
  });
}

export function getCategory(id: string) {
  return apiClient<ApiResponse<Category>>(`/categories/${id}`, {
    method: "GET",
  });
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiClient<ApiResponse<Category>>("/categories", {
    method: "POST",
    body: payload,
  });
}

export function updateCategory(id: string, payload: UpdateCategoryPayload) {
  return apiClient<ApiResponse<Category>>(`/categories/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCategory(id: string) {
  return apiClient<ApiResponse<Category>>(`/categories/${id}`, {
    method: "DELETE",
  });
}
