import { TransferLeaveEntitlementType } from '../../enums';
import { RemainingLeaveEntitlement } from './leave-request-payload';

export interface TransferLeaveEntitlementPayload {
  leaveTypeRemainingEntitlement: RemainingLeaveEntitlement;
  leaveTypeId: string;
  typeTransfer: TransferLeaveEntitlementType;
  durationInDayTransfer: number;
  sendToIds: string[];
}
