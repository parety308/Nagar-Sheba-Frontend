import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api";
import type { ApiResponse } from "@/types/api.type";
import type { NotificationsPayload } from "@/types/notification.type";

export function useNotifications(
  params?: Parameters<typeof getMyNotifications>[0],
) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getMyNotifications(params),
  });
}

/**
 * Polls every 30s so the bell badge stays fresh without websockets.
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const drop = (n: number) => Math.max(n - 1, 0);

  return useMutation({
    mutationFn: markNotificationAsRead,

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      const previous = queryClient.getQueriesData({
        queryKey: ["notifications"],
      });

      queryClient.setQueriesData<ApiResponse<NotificationsPayload>>(
        { queryKey: ["notifications"] },
        (old) => {
          if (!old || !Array.isArray(old.data?.notifications)) {
            return old;
          }

          return {
            ...old,
            data: {
              unreadCount: drop(old.data.unreadCount),
              notifications: old.data.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n,
              ),
            },
          };
        },
      );

      queryClient.setQueryData<ApiResponse<{ unreadCount: number }>>(
        ["notifications", "unread-count"],
        (old) =>
          old
            ? {
                ...old,
                data: {
                  unreadCount: drop(old.data.unreadCount),
                },
              }
            : old,
      );

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      for (const [key, data] of ctx?.previous ?? []) {
        queryClient.setQueryData(key, data);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
}
