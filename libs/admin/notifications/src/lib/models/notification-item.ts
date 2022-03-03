import { BaseObject, CommonStatus } from '@nexthcm/cdk';

export interface NotificationItem {
  notifyId: string;
  source: string;
  type: number;
  title: string;
  shortContent: string;
  content: string;
  contentDelta: string;
  top: boolean;
  sendDate: number;
  expiredDate: number;
  repeat: string;
  status: CommonStatus;
  roles: BaseObject[];
  isPushMobile: boolean;
  isAllRole: boolean;
  description: string;
}
