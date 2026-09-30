import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type {
  NotificationItem,
  NotificationsPayload,
} from "@/types/notification.type";

export function getMyNotifications(params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}) {
  return apiClient<ApiResponse<NotificationsPayload>>("/notifications/me", {
    method: "GET",
    query: params,
  });
}

export function getUnreadNotificationCount() {
  return apiClient<ApiResponse<{ unreadCount: number }>>(
    "/notifications/unread-count",
    { method: "GET" },
  );
}

export function markNotificationAsRead(id: string) {
  return apiClient<ApiResponse<NotificationItem>>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export function markAllNotificationsAsRead() {
  return apiClient<ApiResponse<{ updatedCount: number }>>(
    "/notifications/read-all",
    { method: "PATCH" },
  );
}
