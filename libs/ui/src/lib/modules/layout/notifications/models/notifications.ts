export interface Notifications {
  unReadCount: number;
  turnOff: boolean;
  data: {
    data: {
      hasNext: boolean;
      items: NotificationItem[];
    };
  };
}

export interface NotificationItem {
  notificationId: string;
  fullName: string | null;
  image: string;
  isRead: boolean;
  sendDate: string;
  shortContent: string;
}