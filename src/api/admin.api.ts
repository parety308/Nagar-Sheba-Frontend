import apiClient from "@/lib/apiClient";

export function createStaff(payload: {
  fullName: string;
  personalEmail: string;
  organizationEmail: string;
  role: "STAFF" | "ADMIN";
  departmentId?: string;
  title?: string;
}) {
  return apiClient("/admin/staff", {
    method: "POST",
    body: payload,
  });
}

export function getAdminUsers(params?: {
  page?: number;
  limit?: number;
  role?: "CITIZEN" | "STAFF" | "ADMIN";
  status?: "ACTIVE" | "BLOCKED";
  search?: string;
  sortBy?: "createdAt" | "email" | "role" | "status";
  sortOrder?: "asc" | "desc";
}) {
  return apiClient("/admin/users", {
    method: "GET",
    query: params,
  });
}

export function updateUserStatus(id: string, status: "ACTIVE" | "BLOCKED") {
  return apiClient(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function updateUserRole(
  id: string,
  payload: {
    role: "STAFF" | "ADMIN";
    departmentId?: string;
    title?: string;
  },
) {
  return apiClient(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: payload,
  });
}

export function getAuditLogs(params?: {
  page?: number;
  limit?: number;
  entityType?: string;
  actorId?: string;
}) {
  return apiClient("/admin/audit-logs", {
    method: "GET",
    query: params,
  });
}

export function getDashboardStats() {
  return apiClient("/admin/dashboard-stats", {
    method: "GET",
  });
}
