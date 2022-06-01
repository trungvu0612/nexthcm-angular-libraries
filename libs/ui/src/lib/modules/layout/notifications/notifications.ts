export interface Notifications {
  unReadCount: number;
  data: {
    data: {
      hasNext: boolean;
      items: NotificationItem[];
    };
  };
}

export interface NotificationItem {
  notificationId: string;
  fullName: string;
  image: string;
  isRead: boolean;
  sendDate: string;
  shortContent: string;
}
