import apiClient from "@/lib/apiClient";
import type {
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "@/types/department.type";

export function getDepartments(params?: {
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}) {
  return apiClient("/departments", {
    method: "GET",
    query: params,
  });
}

export function getDepartment(id: string) {
  return apiClient(`/departments/${id}`, {
    method: "GET",
  });
}

export function createDepartment(payload: CreateDepartmentPayload) {
  return apiClient("/departments", {
    method: "POST",
    body: payload,
  });
}

export function updateDepartment(id: string, payload: UpdateDepartmentPayload) {
  return apiClient(`/departments/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteDepartment(id: string) {
  return apiClient(`/departments/${id}`, {
    method: "DELETE",
  });
}
