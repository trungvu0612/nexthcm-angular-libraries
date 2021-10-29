import { LeaveType } from '../../../models';
import { TransferLeaveEntitlementType } from '../../enums';
import { BaseRequest } from './base-request';

export interface TransferLeaveEntitlementsRequest extends BaseRequest {
  leaveType: LeaveType;
  typeTransfer: TransferLeaveEntitlementType;
  durationInDayTransfer: number;
  sendTo: string;
  fromDate: number;
  toDate: number;
}
