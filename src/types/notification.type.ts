export type NotificationItem = {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type NotificationsPayload = {
  notifications: NotificationItem[];
  unreadCount: number;
};
