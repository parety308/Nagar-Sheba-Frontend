import apiClient from "@/lib/apiClient";

export function createServiceRequest(formData: FormData) {
  return apiClient("/requests", {
    method: "POST",
    body: formData,
  });
}

export function searchRequests(params: {
  q: string;
  page?: number;
  limit?: number;
}) {
  return apiClient("/requests/search", {
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
  sortBy?: "createdAt" | "updatedAt" | "title" | "status" | "slaDueAt";
  sortOrder?: "asc" | "desc";
}) {
  return apiClient("/requests", {
    method: "GET",
    query: params,
  });
}

export function getRequest(id: string) {
  return apiClient(`/requests/${id}`, {
    method: "GET",
  });
}

export function cancelRequest(id: string) {
  return apiClient(`/requests/${id}/cancel`, {
    method: "POST",
  });
}

export function updateRequestStatus(
  id: string,
  payload: {
    toStatus: string;
    note?: string;
  },
) {
  return apiClient(`/requests/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function reassignRequest(
  id: string,
  payload: {
    staffId?: string;
    departmentId?: string;
    reason?: string;
  },
) {
  return apiClient(`/requests/${id}/reassign`, {
    method: "PATCH",
    body: payload,
  });
}

export function reopenRequest(
  id: string,
  payload: {
    reason: string;
  },
) {
  return apiClient(`/requests/${id}/reopen`, {
    method: "POST",
    body: payload,
  });
}

export function addRequestAttachments(id: string, formData: FormData) {
  return apiClient(`/requests/${id}/attachments`, {
    method: "POST",
    body: formData,
  });
}
