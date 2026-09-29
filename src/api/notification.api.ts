import apiClient from "@/lib/apiClient";

export function getMyNotifications(params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}) {
  return apiClient("/notifications/me", {
    method: "GET",
    query: params,
  });
}

export function getUnreadNotificationCount() {
  return apiClient("/notifications/unread-count", {
    method: "GET",
  });
}

export function markNotificationAsRead(id: string) {
  return apiClient(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export function markAllNotificationsAsRead() {
  return apiClient("/notifications/read-all", {
    method: "PATCH",
  });
}