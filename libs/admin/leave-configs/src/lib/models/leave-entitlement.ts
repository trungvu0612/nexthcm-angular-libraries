import { BaseObject, EmployeeInfo, Organization } from '@nexthcm/cdk';
import { TuiDayRange } from '@taiga-ui/cdk';

export interface LeaveEntitlement {
  id: string;
  // Add to multiple employees
  status: boolean | 1 | 0;
  entitlement: number;
  leaveType: BaseObject;
  orgId?: string;
  orgDTO?: Organization;
  fromTo?: TuiDayRange;
  fromDate: number;
  toDate: number;
  employee?: BaseObject;
  employeeId?: string;
  jobTitle?: string[];
}

export interface EmployeeLeaveEntitlement {
  leaveTypeId: string;
  leaveTypeName: string;
  remainingEntitlement: number;
  totalEntitlement: number;
  totalUsedEntitlement: number;
  employee: EmployeeInfo;
}
