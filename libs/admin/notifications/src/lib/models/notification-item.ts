import { BaseObject, CommonStatus } from '@nexthcm/cdk';

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  sentDate: number;
  expiredDate: number;
  status: CommonStatus;
  roles: BaseObject[];
  repeat: string;
}
