export interface NotificationSettingItem {
  notifyId?: string;
  moduleName?: string;
  title?: string;
  sendToMail?: boolean;
  notifyOnHCM?: boolean;
  notifyOnDesktop?: boolean;
  notifyOnMobile?: boolean;
  soundSendToMail?: boolean;
  soundNotifyOnHCM?: boolean;
  soundNotifyOnDesktop?: boolean;
  soundNotifyOnMobile?: boolean;
}
export interface NotificationSettingResponse {
  listNotifiSetting: NotificationSettingItem[];
  userId: string;
}
