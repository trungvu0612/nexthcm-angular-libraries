export interface NotificationConfigItem {
  notifyID?: string;
  moduleName?: string;
  title?: string;
  sendToMail?: boolean;
  notifyOnHCM?: boolean;
  notifyOnDesktop?: boolean;
  notifyOnMobile?: boolean;
  modifieldNotify?: boolean;
}

export interface NotificationConfigResponse<T> {
  listNotifiConfig: T[];
}
