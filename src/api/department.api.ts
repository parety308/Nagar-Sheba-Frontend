import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type {
  CreateDepartmentPayload,
  Department,
  UpdateDepartmentPayload,
} from "@/types/department.type";

export function getDepartments(params?: {
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}) {
  return apiClient<ApiResponse<Department[]>>("/departments", {
    method: "GET",
    query: params,
  });
}

export function getDepartment(id: string) {
  return apiClient<ApiResponse<Department>>(`/departments/${id}`, {
    method: "GET",
  });
}

export function createDepartment(payload: CreateDepartmentPayload) {
  return apiClient<ApiResponse<Department>>("/departments", {
    method: "POST",
    body: payload,
  });
}

export function updateDepartment(id: string, payload: UpdateDepartmentPayload) {
  return apiClient<ApiResponse<Department>>(`/departments/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteDepartment(id: string) {
  return apiClient<ApiResponse<Department>>(`/departments/${id}`, {
    method: "DELETE",
  });
}
