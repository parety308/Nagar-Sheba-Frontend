import apiClient from "@/lib/apiClient";
import { postFormWithProgress } from "@/lib/upload";
import type { ApiResponse } from "@/types/api.type";
import type {
  Attachment,
  CreateRequestResult,
  ServiceRequest,
} from "@/types/request.type";

export function createServiceRequest(
  formData: FormData,
  onProgress?: (percent: number) => void,
) {
  return postFormWithProgress<ApiResponse<CreateRequestResult>>(
    "/requests",
    formData,
    onProgress,
  );
}

export function searchRequests(params: {
  q: string;
  page?: number;
  limit?: number;
}) {
  return apiClient<ApiResponse<ServiceRequest[]>>("/requests/search", {
    method: "GET",
    query: params,
  });
}

export function getRequests(params?: {
  page?: number;
  limit?: number;
  status?: string;
  departmentId?: string;
  categoryId?: string;
  overdue?: boolean;
  assigned?: "me" | "unassigned";
  sortBy?: "createdAt" | "updatedAt" | "title" | "status" | "slaDueAt";
  sortOrder?: "asc" | "desc";
}) {
  return apiClient<ApiResponse<ServiceRequest[]>>("/requests", {
    method: "GET",
    query: params,
  });
}

export function getRequest(id: string) {
  return apiClient<ApiResponse<ServiceRequest>>(`/requests/${id}`, {
    method: "GET",
  });
}

export function cancelRequest(id: string) {
  return apiClient<ApiResponse<ServiceRequest>>(`/requests/${id}/cancel`, {
    method: "POST",
  });
}

export function updateRequestStatus(
  id: string,
  payload: { toStatus: string; note?: string },
) {
  return apiClient<ApiResponse<ServiceRequest>>(`/requests/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function reassignRequest(
  id: string,
  payload: { staffId?: string; departmentId?: string; reason?: string },
) {
  return apiClient<ApiResponse<ServiceRequest>>(`/requests/${id}/reassign`, {
    method: "PATCH",
    body: payload,
  });
}

export function reopenRequest(id: string, payload: { reason: string }) {
  return apiClient<ApiResponse<ServiceRequest>>(`/requests/${id}/reopen`, {
    method: "POST",
    body: payload,
  });
}

export function addRequestAttachments(
  id: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
) {
  return postFormWithProgress<ApiResponse<Attachment[]>>(
    `/requests/${id}/attachments`,
    formData,
    onProgress,
  );
}
