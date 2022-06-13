export interface NotificationSettingItem {
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
export interface NotificationSettingResponse {
  userId?: string;
  moduleName?: string;
  listNotifiSetting: NotificationSettingItem[];
}
