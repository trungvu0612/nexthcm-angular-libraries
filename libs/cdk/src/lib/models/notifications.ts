import { NotificationType } from '../enums';

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
  read: boolean;
  sendDate: string;
  shortContent: string;
  targetId: string;
  title: string;
  type: NotificationType;
  notifySetting?: NotificationSetting;
}

export interface NotificationSetting {
  notifyId?: string;
  title?: string;
  sendToMail?: boolean;
  notifyOnHCM?: boolean;
  notifyOnDesktop?: boolean;
  notifyOnMobile?: boolean;
  soundSendToMail?: boolean;
  soundNotifyOnHCM?: boolean;
  soundNotifyOnDesktop?: boolean;
  soundNotifyOnMobile?: boolean;
  active?: number;
}

export interface NotificationSettings {
  userId?: string;
  moduleName?: string;
  listNotifiSetting: NotificationSetting[];
}
