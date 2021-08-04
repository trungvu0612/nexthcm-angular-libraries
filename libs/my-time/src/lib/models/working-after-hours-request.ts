import { BaseRequest, BaseRequestSendToUser, BaseRequestUser } from './base-request';

export interface WorkingAfterHoursRequest extends BaseRequest {
  optCounter: number;
  reason: string;
  status: number;
  sendToUser: BaseRequestSendToUser;
  user: BaseRequestUser;
}
