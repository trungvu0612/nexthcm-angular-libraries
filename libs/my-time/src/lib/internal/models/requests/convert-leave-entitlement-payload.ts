import { ConvertLeaveEntitlementType } from '../../enums';
import { RemainingLeaveEntitlement } from './leave-request-payload';

export interface ConvertLeaveEntitlementPayload {
  leaveTypeRemainingEntitlement?: RemainingLeaveEntitlement;
  typeTransfer: ConvertLeaveEntitlementType;
  durationInDayTransfer: number;
  sendTo: string;
}
